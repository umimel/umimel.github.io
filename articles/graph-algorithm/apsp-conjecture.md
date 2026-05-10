---
title: APSP Conjecture と subcubic 界隈
category: graph-algorithm
category_label: Graph Algorithm
summary: APSP Conjecture についてのまとめメモ
date: 2026-06-01
published: false
tags:
  - shortest paths
  - all pairs shortest paths
---

# APSP Conjecture について

APSP Conjectureについて勉強したので，まとめます．

## APSP Conjecture とは？
APSP とは，All-Paris Shortest Paths の略で古くから考えられている問題です．
グラフの重みや有向・無向など様々な問題設定で考えられていますが，今回は以下を考えます．

:::problem All-Paris Shortest Paths
- **Instance**: 重み付き有向グラフ $G=(V, E, w)$
    - $w: E \rightarrow \{1, 2, \dots, n^c\}$ ($c$ は任意の定数)
- **Ouput**: 任意の2頂点 $x, y \in V$ に対する最短距離 $\mathsf{dist}_G(x, y)$

:::

以下では，$n = |V|, m = |E|$ として記述します．
APSP は，ワーシャルフロイド法によって $O(n^3)$ 時間，または，各始点からダイクストラ法を実行することで $O(mn + n^2 \log n)$ 時間で解くことができます．
これらは，共に最悪ケースが $\tilde{O}(n^3)$ (後者は，$m = \Theta(n^2)$ の場合) となっています．

実は，最近の研究ではより高速なアルゴリズムが提案されており，Chan と Williams によって，$O \left (\frac{n^3}{2^{\Omega (\sqrt{\log n })}} \right )$ 時間のアルゴリズムが提案されており2026年5月5日現在において理論最速のアルゴリズムになります．

大雑把に，APSP Conjecture とは 「$O(n^3)$ 時間よりも真に高速に解けるか」という問題に対して，難しいのではという予想になります．
より厳密には，以下のような予想になります．

:::conjecture APSP Conjecture

任意の定数 $\epsilon > 0$ に対して，APSP を　$O(n^{3 - \epsilon})$ 時間で解くアルゴリズムは存在しない．

:::

## 

## 参考
- https://hardness.mit.edu/drafts/2026-02-16.pdf
- 
