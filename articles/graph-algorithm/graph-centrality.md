---
title: Graph Centrality
category: graph-algorithm
category_label: Graph Algorithm
summary: APSP Conjecture とグラフ中心性の関係についてのまとめメモ
date: 2026-05-06
published: false
tags:
  - shortest paths
  - all pairs shortest paths
  - centrality
---

# Graph Centrality ~ グラフの中心性について ~

APSP Conjecture の資料 [[1]](#ref-1) の Chapter 18 に出てくる，グラフの中心性に関する問題をまとめます．
特に，半径・中心・直径・メディアン・betweenness centrality と APSP の関係を整理します．

以下では，$G=(V, E, w)$ を辺重み付き有向グラフとし，$n=|V|$ とします．
また，頂点 $u, v \in V$ に対して，$u$ から $v$ への最短距離を $\mathsf{dist}_G(u, v)$ と書きます．

## 中心性とは？

グラフにおける中心性とは，ざっくり言うと「どの頂点が重要か」を測るための量です．
社会ネットワーク，生物ネットワーク，交通ネットワークなどで自然に現れる概念です．

APSP の章では，まず以下のような距離ベースの量が紹介されています．

:::problem Radius

**Input** : 辺重み付き有向グラフ $G=(V, E, w)$

**Output** :

$$
\min_{v \in V} \max_{u \in V} \mathsf{dist}_G(v, u)
$$

この値を $G$ の **radius** と呼ぶ．

:::

:::problem Center

**Input** : 辺重み付き有向グラフ $G=(V, E, w)$

**Output** :

$$
\max_{u \in V} \mathsf{dist}_G(v, u)
$$

を最小化する頂点 $v$．このような頂点を $G$ の **center** と呼ぶ．

:::

Radius は「最悪ケースでも一番近い中心」を探す問題です．
つまり，各頂点 $v$ について「$v$ から最も遠い頂点までの距離」を考え，その値が最小となるものを選びます．

次に，直径は「グラフ中で最も遠い2点間距離」です．

:::problem Diameter

**Input** : 辺重み付き有向グラフ $G=(V, E, w)$

**Output** :

$$
\max_{u, v \in V} \mathsf{dist}_G(u, v)
$$

この値を $G$ の **diameter** と呼ぶ．

:::

また，メディアンは「全頂点への距離和が最小となる頂点」に対応します．
これは closeness centrality と近い概念です．

:::problem Median

**Input** : 辺重み付き有向グラフ $G=(V, E, w)$

**Output** :

$$
\min_{v \in V} \sum_{u \in V} \mathsf{dist}_G(v, u)
$$

この値を $G$ の **median** と呼ぶ．

:::

## Betweenness Centrality

距離の最大値や総和だけでなく，「ある頂点が最短路にどれくらい現れるか」を測る中心性もあります．
これが betweenness centrality です．

頂点 $s,t,x \in V$ に対して，$\sigma_{s,t}$ を $s$ から $t$ への最短路の本数，$\sigma_{s,t}(x)$ をそのうち $x$ を通るものの本数とします．
このとき，$x$ の $s,t$ に関する betweenness centrality は，典型的には以下のように定義されます．

$$
\mathsf{BC}_{s,t}(x) = \frac{\sigma_{s,t}(x)}{\sigma_{s,t}}
$$

全体の betweenness centrality は，これを全ての $s,t$ について足し合わせた値です．

$$
\mathsf{BC}(x) = \sum_{s,t \in V} \mathsf{BC}_{s,t}(x)
$$

APSP の章では，判定版として次の問題も導入されています．

:::problem Positive Betweenness Centrality

**Input** : 辺重み付き有向グラフ $G=(V, E, w)$ と頂点 $x \in V$

**Output** : $x$ がある最短路上に現れるか？

:::

すなわち，$\mathsf{BC}(x)>0$ であるかを判定する問題です．
これは後に Diameter との subcubic equivalence を示すために使われます．

## APSP との関係

これらの中心性は，APSP を計算してしまえば素直に $O(n^3)$ 時間で求められます．
実際，すべての頂点対距離が分かっていれば，

- Radius / Center : 各 $v$ について $\max_u \mathsf{dist}_G(v,u)$ を計算する
- Diameter : 全ての $\mathsf{dist}_G(u,v)$ の最大値を取る
- Median : 各 $v$ について $\sum_u \mathsf{dist}_G(v,u)$ を計算する
- Betweenness Centrality : 最短路構造を用いて，各頂点が最短路に現れる量を計算する

という形で求めることができます．

一方で，「APSP より簡単なのか？」という問いは非自明です．
APSP Conjecture は，APSP に真に劣三乗時間，すなわち $O(n^{3-\epsilon})$ 時間のアルゴリズムは存在しない，という予想です．
この予想の下では，APSP-hard な問題にも真に劣三乗時間のアルゴリズムは期待しにくいことになります．

:::theorem

Radius, Median, Betweenness Centrality, Negative Triangle は APSP-complete である [[1]](#ref-1) [[2]](#ref-2) [[3]](#ref-3)．

:::

ここで APSP-complete とは，以下の2つを満たすという意味です．

1. APSP を用いれば $O(n^3)$ 時間程度で解ける．
2. その問題に真に劣三乗時間アルゴリズムがあるなら，APSP にも真に劣三乗時間アルゴリズムが得られる．

したがって，APSP Conjecture を仮定すると，Radius, Median, Betweenness Centrality には真に劣三乗時間アルゴリズムは存在しないと考えられます．

## Diameter はどうか？

Diameter も APSP から直接計算できるため $O(n^3)$ 時間で解けます．
しかし，APSP の章では Diameter の状態は Radius や Median と少し違うものとして扱われています．

資料 [[1]](#ref-1) では，Diameter が subcubic-complete であることを示す証拠として Boroujeni らの結果 [[4]](#ref-4) が参照されていますが，APSP-complete とまでは書かれていません．
つまり，少なくともこの資料の整理では，

- Radius, Median, Betweenness Centrality は APSP-complete
- Diameter の APSP-complete 性は未解決寄り
- ただし Positive Betweenness Centrality とは subcubic equivalent

という位置づけです．

## まとめ

グラフ中心性の多くは，定義だけを見ると APSP の後処理として簡単に計算できます．
しかし fine-grained complexity の観点では，「APSP を本質的に避けられるか」が問題になります．

APSP の章に出てくる中心性問題の関係をまとめると，以下のようになります．

<figure class="article-figure">
  <a href="{{ '/images/articles/graph-algorithm/graph-centrality/centrality-apsp-relations.svg' | relative_url }}" target="_blank" rel="noopener">
    <img
      src="{{ '/images/articles/graph-algorithm/graph-centrality/centrality-apsp-relations.svg' | relative_url }}"
      alt="APSP, Diameter, Negative Triangle とグラフ中心性問題の subcubic reduction 関係"
    >
  </a>
  <figcaption>APSP 章の Figure 18.1 に基づく subcubic reduction の関係図</figcaption>
</figure>

- Radius / Center は，最悪距離を最小化する中心を探す問題
- Diameter は，最も遠い2頂点間距離を求める問題
- Median は，全頂点への距離和を最小化する問題
- Betweenness Centrality は，頂点が最短路上にどれだけ現れるかを測る問題
- Radius, Median, Betweenness Centrality は APSP-complete
- Diameter は APSP から計算できるが，APSP-complete 性についてはより繊細

## 参考文献

<span id="ref-1">[1]</span> Erik D. Demaine, William Gasarch, Mohammad Hajiaghayi,
*Computational Intractability: A Guide to Algorithmic Lower Bounds*, Draft from February 16, 2026,
Chapter 18 “APSP Conjecture: A Method for Obtaining Cubic Lower Bounds”.
[https://hardness.mit.edu/drafts/2026-02-16.pdf](https://hardness.mit.edu/drafts/2026-02-16.pdf)

<span id="ref-2">[2]</span> Amir Abboud, Fabrizio Grandoni, Virginia Vassilevska Williams,
“Subcubic Equivalences Between Graph Centrality Problems, APSP and Diameter”,
SODA 2015.
[https://doi.org/10.1137/1.9781611973730.112](https://doi.org/10.1137/1.9781611973730.112)

<span id="ref-3">[3]</span> Virginia Vassilevska Williams, R. Ryan Williams,
“Subcubic Equivalences between Path, Matrix, and Triangle Problems”,
JACM 2018.
[https://doi.org/10.1145/3186893](https://doi.org/10.1145/3186893)

<span id="ref-4">[4]</span> Mahdi Boroujeni, Sina Dehghani, Soheil Ehsani, Mohammad Taghi Hajiaghayi, Saeed Seddighin,
“Subcubic Equivalences Between Graph Centrality Measures and Complementary Problems”, 2019.
[https://arxiv.org/abs/1905.08127](https://arxiv.org/abs/1905.08127)
