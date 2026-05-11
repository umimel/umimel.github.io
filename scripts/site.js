(function () {
  const article = document.querySelector('.article-body');
  const searchInput = document.querySelector('#note-search');
  const tagButtons = Array.from(document.querySelectorAll('[data-tag-filter]'));
  const tagClear = document.querySelector('[data-tag-clear]');
  const tagPanelToggle = document.querySelector('[data-tag-panel-toggle]');
  const tagFilterList = document.querySelector('[data-tag-filter-list]');
  const selectedTags = new Set();

  function renderMath(container) {
    const run = () => {
      if (typeof window.renderMathInElement === 'undefined') return false;
      window.renderMathInElement(container, {
        delimiters: [
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
      });
      return true;
    };
    if (run()) return;
    window.addEventListener('load', run, { once: true });
  }

  function buildToc(container) {
    const headings = Array.from(container.querySelectorAll('h2, h3'));
    if (!headings.length) return;
    const toc = document.createElement('nav');
    toc.className = 'toc-float';
    toc.innerHTML = '<div class="toc-title">Contents</div>';
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = 'section-' + index;
      const link = document.createElement('a');
      link.className = 'toc-item toc-' + heading.tagName.toLowerCase();
      link.href = '#' + heading.id;
      link.dataset.tocTarget = heading.id;
      link.textContent = tocText(heading);
      toc.appendChild(link);
    });
    const page = container.closest('.page');
    if (page) page.appendChild(toc);
    else container.after(toc);
    observeToc(headings, toc);
  }

  function tocText(node) {
    let text = '';
    node.childNodes.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.textContent;
        return;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      if (child.classList.contains('katex')) {
        const annotation = child.querySelector('annotation');
        text += annotation ? annotation.textContent : child.textContent;
        return;
      }
      text += tocText(child);
    });
    return text.replace(/\s+/g, ' ').trim();
  }

  function observeToc(headings, toc) {
    const links = new Map(Array.from(toc.querySelectorAll('[data-toc-target]')).map((link) => [link.dataset.tocTarget, link]));

    function setActive(id) {
      links.forEach((link, key) => {
        const active = key === id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }

    setActive(headings[0].id);

    if (typeof IntersectionObserver === 'undefined') return;

    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
        else visible.delete(entry.target.id);
      });

      if (visible.size) {
        const current = Array.from(visible.entries()).sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))[0][0];
        setActive(current);
        return;
      }

      const passed = headings.filter((heading) => heading.getBoundingClientRect().top < 120);
      if (passed.length) setActive(passed[passed.length - 1].id);
    }, {
      rootMargin: '-15% 0px -70% 0px',
      threshold: [0, 1],
    });

    headings.forEach((heading) => observer.observe(heading));
  }

  function enhanceEnvironmentBlocks(container) {
    const labels = {
      theorem: 'Theorem',
      lemma: 'Lemma',
      corollary: 'Corollary',
      property: 'Property',
      definition: 'Definition',
      conjecture: 'Conjecture',
      claim: 'Claim',
      algorithm: 'Algorithm',
      problem: 'Problem',
      info: 'Info',
      success: 'Note',
      note: 'Note',
      plain: '',
    };
    splitEnvironmentParagraphs(container);
    const nodes = Array.from(container.childNodes);
    for (let i = 0; i < nodes.length; i += 1) {
      const start = nodes[i];
      if (start.nodeType !== Node.ELEMENT_NODE) continue;
      const text = start.textContent.trim();
      const match = text.match(/^:::\s*([a-zA-Z][\w-]*)?(?:\s+(.+))?$/);
      if (!match) continue;
      const type = match[1] ? match[1].toLowerCase() : 'plain';
      if (!(type in labels) && type !== 'proof') continue;
      const title = match[2] || '';
      const bodyNodes = [];
      let j = i + 1;
      while (j < nodes.length && nodes[j].textContent.trim() !== ':::') {
        bodyNodes.push(nodes[j]);
        j += 1;
      }
      if (j >= nodes.length) continue;

      const wrapper = type === 'proof' ? document.createElement('details') : document.createElement('div');
      wrapper.className = type === 'proof' ? 'proof-block' : 'theorem-block';
      if (type !== 'proof') wrapper.dataset.type = type;

      if (type === 'proof') {
        const summary = document.createElement('summary');
        summary.className = 'proof-title';
        summary.textContent = 'Proof' + (title ? ' : ' + title : '');
        const body = document.createElement('div');
        body.className = 'proof-body';
        bodyNodes.forEach((node) => body.appendChild(node));
        wrapper.append(summary, body);
      } else {
        const titleEl = document.createElement('div');
        titleEl.className = 'theorem-title';
        titleEl.textContent = type === 'plain' ? '' : labels[type] + (title ? ' : ' + title : '');
        const body = document.createElement('div');
        body.className = 'theorem-body';
        bodyNodes.forEach((node) => body.appendChild(node));
        if (type !== 'plain') wrapper.appendChild(titleEl);
        wrapper.appendChild(body);
      }

      start.replaceWith(wrapper);
      nodes[j].remove();
      i = j;
    }
    numberEnvironmentBlocks(container, labels);
  }

  function numberEnvironmentBlocks(container, labels) {
    const numberedTypes = new Set(['theorem', 'lemma', 'corollary', 'property', 'definition', 'conjecture', 'claim', 'algorithm', 'problem']);
    const counters = {};
    container.querySelectorAll('.theorem-block[data-type]').forEach((block) => {
      const type = block.dataset.type;
      if (!numberedTypes.has(type)) return;

      const title = block.querySelector(':scope > .theorem-title');
      if (!title) return;

      const label = labels[type] || type;
      const current = title.textContent.trim();
      const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const match = current.match(new RegExp('^' + escapedLabel + '(?:\\s+\\d+)?(?:\\s*:\\s*(.*))?$'));
      const suffix = match ? (match[1] || '') : current;

      counters[type] = (counters[type] || 0) + 1;
      title.textContent = label + ' ' + counters[type] + (suffix ? ' : ' + suffix : '');
    });
  }

  function splitEnvironmentParagraphs(container) {
    const paragraphs = Array.from(container.querySelectorAll('p'));
    paragraphs.forEach((paragraph) => {
      const text = paragraph.textContent;
      if (!/^:::\s*(?:[a-zA-Z][\w-]*)?(?:\s+.*)?$/m.test(text)) return;

      const lines = text.split(/\r?\n/);
      const fragment = document.createDocumentFragment();
      let buffer = [];

      function flushBuffer() {
        if (!buffer.length) return;
        const p = document.createElement('p');
        p.textContent = buffer.join('\n');
        fragment.appendChild(p);
        buffer = [];
      }

      lines.forEach((line) => {
        if (/^:::\s*(?:[a-zA-Z][\w-]*)?(?:\s+.*)?$/.test(line.trim())) {
          flushBuffer();
          const p = document.createElement('p');
          p.textContent = line.trim();
          fragment.appendChild(p);
          return;
        }
        buffer.push(line);
      });
      flushBuffer();

      paragraph.replaceWith(fragment);
    });
  }

  function enhanceLibraryLabels(container) {
    const labels = new Set(['制約', '計算量', '依存関係', '使用例', 'Verify', 'Verification']);
    container.querySelectorAll('p').forEach((paragraph) => {
      if (!labels.has(paragraph.textContent.trim())) return;
      paragraph.classList.add('library-label');
    });
  }

  function openExternalLinksInNewTab() {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;

      let url;
      try {
        url = new URL(href, window.location.href);
      } catch (_) {
        return;
      }

      if (url.origin === window.location.origin) return;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
  }

  function filterCards() {
    const cards = Array.from(document.querySelectorAll('[data-note-card]'));
    if (!cards.length) return;
    const params = new URLSearchParams(window.location.search);
    const category = params.get('cat');
    const subcategory = params.get('subcat');
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    cards.forEach((card) => {
      const cardTags = (card.dataset.tags || '').split('||').filter(Boolean);
      const matchesCategory = !category || card.dataset.category === category;
      const matchesSubcategory = !subcategory || card.dataset.subcategory === subcategory;
      const matchesQuery = !query || card.textContent.toLowerCase().includes(query);
      const matchesTags = !selectedTags.size || Array.from(selectedTags).some((tag) => cardTags.includes(tag));
      card.classList.toggle('is-filtered-out', !(matchesCategory && matchesSubcategory && matchesQuery && matchesTags));
    });
    updateSections();
  }

  function updateSections() {
    let visibleSections = 0;
    document.querySelectorAll('.library-subsection').forEach((section) => {
      const cards = Array.from(section.querySelectorAll('[data-note-card]'));
      const hidden = cards.length > 0 && cards.every((card) => card.classList.contains('is-filtered-out'));
      section.classList.toggle('is-filtered-out', hidden);
    });
    document.querySelectorAll('.section').forEach((section) => {
      const cards = Array.from(section.querySelectorAll('[data-note-card]'));
      const hidden = cards.length > 0 && cards.every((card) => card.classList.contains('is-filtered-out'));
      section.classList.toggle('is-filtered-out', hidden);
      if (!hidden) visibleSections += 1;
    });
    const empty = document.querySelector('[data-empty-state], [data-tag-empty]');
    if (empty) empty.classList.toggle('is-filtered-out', visibleSections > 0);
  }

  function syncTagControls() {
    tagButtons.forEach((button) => {
      const active = selectedTags.has(button.dataset.tagFilter);
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
    if (tagClear) tagClear.hidden = selectedTags.size === 0;
  }

  function setTagPanelOpen(open) {
    if (!tagPanelToggle || !tagFilterList) return;
    tagPanelToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    tagFilterList.hidden = !open;
  }

  function updateTagQuery() {
    const url = new URL(window.location.href);
    if (selectedTags.size) {
      url.searchParams.set('tags', Array.from(selectedTags).join(','));
    } else {
      url.searchParams.delete('tags');
    }
    window.history.replaceState({}, '', url);
  }

  function initTagFilters() {
    if (!tagButtons.length) return;
    const params = new URLSearchParams(window.location.search);
    const initialTags = (params.get('tags') || '').split(',').filter(Boolean);
    initialTags.forEach((tag) => selectedTags.add(tag));
    setTagPanelOpen(selectedTags.size > 0);
    if (tagPanelToggle) {
      tagPanelToggle.addEventListener('click', () => {
        setTagPanelOpen(tagPanelToggle.getAttribute('aria-expanded') !== 'true');
      });
    }
    tagButtons.forEach((button) => {
      button.setAttribute('aria-pressed', selectedTags.has(button.dataset.tagFilter) ? 'true' : 'false');
      button.addEventListener('click', () => {
        const tag = button.dataset.tagFilter;
        if (selectedTags.has(tag)) {
          selectedTags.delete(tag);
        } else {
          selectedTags.add(tag);
        }
        syncTagControls();
        updateTagQuery();
        filterCards();
      });
    });
    if (tagClear) {
      tagClear.addEventListener('click', () => {
        selectedTags.clear();
        syncTagControls();
        updateTagQuery();
        filterCards();
      });
    }
    syncTagControls();
  }

  if (article) {
    enhanceEnvironmentBlocks(article);
    if (article.classList.contains('library-body')) enhanceLibraryLabels(article);
    renderMath(article);
    buildToc(article);
  }

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
  initTagFilters();
  filterCards();
  openExternalLinksInNewTab();
})();
