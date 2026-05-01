---
title: Maximum Reachable Orientation
category: graph-algorithm
category_label: Graph Algorithm
summary: 到達可能な頂点対の数を最大化する向きづけに関するアルゴリズム
date: 2026-05-01
published: true
tags:
  - orientation
  - reachability
  - graph
---

# Maximum Reachable Orientation

TUNA Camp の Welcome コンテストで出題した問題についての記事です．
- [TUNACamp Welcome Contest L - Orientation](https://judge.tuna.camp/contests/TUNA2026Welcome-OPEN/problems/orientation/statement)

## 問題概要

:::problem Maximum Reachable Orientation

$n$ 頂点 $m$ 辺の単純連結な無向グラフが与えられます．
$i~(1 \le i \le m)$ 番目の辺は頂点 $u_i$ と頂点 $v_i$ を双方向に結びます．

グラフ中の各辺に適切な向きをつけたときの，到達可能な頂点対の数の最大値を求めてください．

ただし，到達可能な頂点対の数とは， $f(s, t)$ を頂点 $s$ から頂点 $t$ へ到達可能ならば $1$ ，そうでないならば $0$ であるような関数としたときに，以下で表される値となります．

$$
\sum_{1 \le s, t \le N} f(s, t)
$$

:::

この問題は，以下の論文でも紹介されている古典的な問題です．
- [https://www.sciencedirect.com/science/article/pii/S0020019097001294](https://www.sciencedirect.com/science/article/pii/S0020019097001294)

上記では，時間計算量が $O(m + n^2)$ だったのですが，もっと高速化できるので出題しました．
基本的なアイデアは全く同じですが，最後のパートだけ時間計算量を改善できます．
今回は以下の時間計算量で解けることを示します．
- deterministic : $O(m + n\sqrt{n})$
- randomized : $O(m + n \log n)$

## Algorithm

### 2辺連結成分分解
まず初めに，2辺連結成分分解をします．
このとき，同一の2辺連結成分が強連結となるように向きづけ出来ます．
（これは，教科書にも載っている有名な事実で，Strong Orientation とも呼ばれています）

したがって，2辺連結成分の頂点数を重みとする頂点重み付き木の問題に帰着できます．

### 木に対する向きづけ
ここが，この問題の一番面白いポイントです．
実は，1頂点を中心として各辺を「中心へ向かう」もしくは「中心から出ていく」ような向きづけを行うのが最適であることを示せます．
