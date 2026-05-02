(function () {
  const targets = document.querySelectorAll('[data-md],[data-md-dir]');
  if (!targets.length) return;

  function renderMarkdown(el, mdText) {
    if (typeof window.marked !== 'undefined') {
      el.innerHTML = renderWithEnvironments(mdText);
      buildToc(el);
      renderMath(el);
      return;
    }
    el.textContent = mdText;
  }

  function centerStandaloneMath(container) {
    const paragraphs = Array.from(container.querySelectorAll('p'));
    paragraphs.forEach((p) => {
      const nodes = Array.from(p.childNodes);
      let hasKatex = false;
      for (const node of nodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          if (node.textContent && node.textContent.trim()) return;
          continue;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          if (node.classList && (node.classList.contains('katex') || node.querySelector('.katex'))) {
            hasKatex = true;
            continue;
          }
          return;
        }
      }
      if (hasKatex) p.classList.add('math-display-block');
    });
  }

  function renderMath(el) {
    const run = () => {
      if (typeof window.renderMathInElement === 'undefined') return false;
      window.renderMathInElement(el, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ]
      });
      centerStandaloneMath(el);
      return true;
    };

    if (run()) return;

    if (!el.dataset.mathPending) {
      el.dataset.mathPending = '1';
      window.addEventListener('load', function () {
        run();
      }, { once: true });
    }
  }

  function showError(el, message) {
    el.innerHTML = '<div class="note-item"><div>' + message + '</div></div>';
  }

  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  function sanitizeSlug(value) {
    const clean = value.replace(/[^a-zA-Z0-9_\/-]/g, '');
    if (clean.includes('..')) return '';
    return clean.replace(/^\/+/, '').replace(/\/+$/, '');
  }

  function renderWithEnvironments(text) {
    const segments = splitByFence(text);
    const counters = {};
    let html = '';
    segments.forEach((seg) => {
      if (seg.type === 'code') {
        html += window.marked.parse(seg.text);
        return;
      }
      html += renderTextWithEnvironments(seg.text, counters);
    });
    return html;
  }

  function splitByFence(text) {
    const lines = text.split(/\r?\n/);
    const segments = [];
    let buffer = [];
    let inFence = false;
    lines.forEach((line) => {
      const fence = line.trim().startsWith('```');
      if (fence) {
        buffer.push(line);
        segments.push({ type: inFence ? 'code' : 'text', text: buffer.join('\n') });
        buffer = [];
        inFence = !inFence;
        return;
      }
      buffer.push(line);
    });
    if (buffer.length) {
      segments.push({ type: inFence ? 'code' : 'text', text: buffer.join('\n') });
    }
    return segments;
  }

  function renderTextWithEnvironments(text, counters) {
    const envs = new Set(['theorem', 'lemma', 'corollary', 'property', 'definition', 'conjecture', 'claim', 'algorithm', 'problem', 'info', 'success', 'note', 'proof']);
    const lines = text.split(/\r?\n/);
    let out = '';
    let buffer = [];
    let i = 0;

    function flushBuffer() {
      if (!buffer.length) return;
      out += renderMarked(buffer.join('\n'));
      buffer = [];
    }

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();
      const match = trimmed.match(/^:::\s*([a-zA-Z][\w-]*)?(?:\s+(.+))?\s*$/);

      const normalizedName = match && match[1] ? match[1].toLowerCase() : '';
      if (match && (!normalizedName || envs.has(normalizedName))) {
        const name = normalizedName || 'plain';
        const title = match[2] ? match[2].trim() : '';
        flushBuffer();
        i += 1;
        const blockLines = [];
        while (i < lines.length && lines[i].trim() !== ':::') {
          blockLines.push(lines[i]);
          i += 1;
        }
        const body = blockLines.join('\n').trim();
        const bodyHtml = renderMarked(body);
        if (name === 'plain') {
          out += buildPlainBlock(bodyHtml);
        } else if (name === 'proof') {
          out += buildProofBlock(bodyHtml, title);
        } else {
          out += buildEnvBlock(name, bodyHtml, title, counters);
        }
        i += 1;
        continue;
      }

      buffer.push(line);
      i += 1;
    }

    flushBuffer();

    const envsRegex = '(theorem|lemma|corollary|property|definition|conjecture|claim|algorithm|problem|info|success|note|proof)';
    const re = new RegExp('\\\\\\\\begin\\\\{' + envsRegex + '\\\\}([\\\\s\\\\S]*?)\\\\\\\\end\\\\{\\\\1\\\\}', 'g');
    if (re.test(out)) {
      out = out.replace(re, function (_, name, body) {
      const bodyHtml = renderMarked(body.trim());
      if (name === 'proof') {
        return buildProofBlock(bodyHtml);
      }
        return buildEnvBlock(name, bodyHtml, '', counters);
      });
    }
    return out;
  }

  function renderMarked(text) {
    const fixed = protectMath(text);
    const html = window.marked.parse(fixed.text);
    return restoreMath(html, fixed.placeholders);
  }

  function protectMath(text) {
    const placeholders = [];
    const stash = (value, display) => {
      const id = placeholders.length;
      placeholders.push({ value: value, display: display });
      return (display ? '@@MATHD_' : '@@MATH_') + id + '@@';
    };
    let out = text.replace(/\$\$([\s\S]*?)\$\$/g, function (m) {
      return stash(m, true);
    });
    out = out.replace(/\$([^\n]*?)\$/g, function (m) {
      return stash(m, false);
    });
    return { text: out, placeholders: placeholders };
  }

  function restoreMath(html, placeholders) {
    let out = html;
    placeholders.forEach((item, idx) => {
      const value = item && item.value ? item.value : item;
      const display = item && item.display;
      const token = new RegExp((display ? '@@MATHD_' : '@@MATH_') + idx + '@@', 'g');
      const replacement = display ? '<span class="math-display">' + value + '</span>' : value;
      out = out.replace(token, replacement);
    });
    return out;
  }

  function buildEnvBlock(name, bodyHtml, title, counters) {
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
    };
    const label = labels[name] || name;
    const numberedTypes = new Set(['theorem', 'lemma', 'corollary', 'property', 'definition', 'conjecture', 'claim', 'algorithm', 'problem']);
    const number = numberedTypes.has(name) ? ' ' + ((counters[name] = (counters[name] || 0) + 1)) : '';
    const suffix = title ? ' : ' + title : '';
    return (
      '<div class="theorem-block" data-type="' + name + '">' +
        '<div class="theorem-title">' + label + number + suffix + '</div>' +
        '<div class="theorem-body">' + bodyHtml + '</div>' +
      '</div>'
    );
  }

  function buildPlainBlock(bodyHtml) {
    return (
      '<div class="theorem-block" data-type="plain">' +
        '<div class="theorem-body">' + bodyHtml + '</div>' +
      '</div>'
    );
  }

  function buildProofBlock(bodyHtml, title) {
    const suffix = title ? ' : ' + title : '';
    return (
      '<details class="proof-block">' +
        '<summary class="proof-title">Proof' + suffix + '</summary>' +
        '<div class="proof-body">' + bodyHtml + '</div>' +
      '</details>'
    );
  }

  function buildToc(container) {
    const headings = Array.from(container.querySelectorAll('h1, h2, h3'));
    if (!headings.length) return;

    headings.forEach((h, idx) => {
      if (!h.id) h.id = 'section-' + (idx + 1);
    });

    const items = headings.map((h) => {
      const level = h.tagName.toLowerCase();
      return (
        '<a class="toc-item toc-' + level + '" href="#' + h.id + '" data-toc-target="' + h.id + '">' +
          tocText(h) +
        '</a>'
      );
    }).join('');

    const toc = document.createElement('div');
    toc.className = 'toc-float';
    toc.innerHTML = '<div class="toc-title">目次</div>' + items;
    const page = container.closest('.page');
    if (page) page.appendChild(toc);
    else container.appendChild(toc);
    observeToc(headings, toc);
  }

  function observeToc(headings, toc) {
    const links = new Map(Array.from(toc.querySelectorAll('[data-toc-target]')).map((link) => [link.dataset.tocTarget, link]));
    const setActive = (id) => {
      links.forEach((link, key) => {
        const active = key === id;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    };
    setActive(headings[0].id);
    if (typeof IntersectionObserver === 'undefined') return;

    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visible.set(entry.target.id, entry.boundingClientRect.top);
        else visible.delete(entry.target.id);
      });
      if (visible.size) {
        setActive(Array.from(visible.entries()).sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))[0][0]);
      }
    }, { rootMargin: '-15% 0px -70% 0px', threshold: [0, 1] });
    headings.forEach((heading) => observer.observe(heading));
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

  function groupByCategory(items, categories) {
    const order = (categories || []).map((c) => ({ slug: c[0], label: c[1] }));
    const map = {};
    order.forEach((c) => { map[c.slug] = { label: c.label, items: [] }; });
    items.forEach((item) => {
      const key = item.category || 'other';
      if (!map[key]) map[key] = { label: item.categoryLabel || key, items: [] };
      map[key].items.push(item);
    });
    return Object.entries(map).map(([slug, data]) => ({ slug, ...data }));
  }

  function renderCards(el, items, categories) {
    if (!items.length) {
      el.innerHTML = '<div class="note-item"><div>まだファイルがありません。</div></div>';
      return;
    }

    const selectedCategory = getQueryParam('cat');
    const filtered = selectedCategory
      ? items.filter((item) => item.category === selectedCategory)
      : items;

    const groups = groupByCategory(filtered, categories);
    const sections = groups
      .filter((g) => g.items.length)
      .map((group) => {
        const cards = group.items
          .map((item) => {
            const slug = sanitizeSlug(item.category ? item.category + '/' + item.slug : item.slug || '');
            const title = item.title || item.slug || 'Untitled';
            const summary = item.summary || '';
            const link = '?md=' + encodeURIComponent(slug);
            return (
              '<a class="card" href="' + link + '">' +
                '<h3>' + title + '</h3>' +
                '<p>' + summary + '</p>' +
              '</a>'
            );
          })
          .join('');
        return (
          '<div class="section">' +
            '<div class="section-title">' + group.label + '</div>' +
            '<div class="card-grid">' + cards + '</div>' +
          '</div>'
        );
      })
      .join('');

    el.innerHTML = sections;
  }

  function resolvePath(el) {
    const direct = el.getAttribute('data-md');
    if (direct) return { type: 'file', path: direct };

    const dir = el.getAttribute('data-md-dir');
    if (!dir) return null;

    const requested = getQueryParam('md');
    if (requested) {
      const safe = sanitizeSlug(requested);
      if (!safe) return { type: 'dir', path: dir.replace(/\/$/, '') };
      return { type: 'file', path: dir.replace(/\/$/, '') + '/' + safe + '.md' };
    }

    return { type: 'dir', path: dir.replace(/\/$/, '') };
  }

  targets.forEach((el) => {
    const resolved = resolvePath(el);
    if (!resolved) return;

    if (resolved.type === 'dir') {
      const manifest = resolved.path + '/manifest.json';
      fetch(manifest, { cache: 'no-store' })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load ' + manifest);
          return res.json();
        })
        .then((data) => renderCards(el, (data && data.items) ? data.items : [], data && data.categories))
        .catch(() => showError(el, 'manifest.json が見つかりません: ' + manifest));
      return;
    }

    fetch(resolved.path, { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load ' + resolved.path);
        return res.text();
      })
      .then((text) => renderMarkdown(el, text))
      .catch(() => showError(el, 'Markdown file not found: ' + resolved.path));
  });
})();
