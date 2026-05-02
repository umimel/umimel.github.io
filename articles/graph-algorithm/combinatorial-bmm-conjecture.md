---
title: Combinatorial BMM Conjecture
category: graph-algorithm
category_label: Graph Algorithm
summary: Combinatorial BMM Conjectureについてのまとめメモ
date: 2026-04-20
tags:
  - combinatorial algorithm
  - matrix multiplication
  - triangle detection
---
# Conbinatorial BMM Conjecture

Combinatorial BMM Conjectureについてのまとめメモ

## 初めに
Combinatorial BMM Conjecture は，「 Strassen algorithm などの代数的な高速行列積を用いないアルゴリズムでは，Boolean Matrix Multiplication を真に subcubic で解くのは無理だろう」という最近人気となっている予想です．色々わからないことが多かったのでまとめます．

<div class="theorem-block" data-type="problem" markdown="1">
<div class="theorem-title">Problem : Boolean Matrix Multiplication</div>

**Input** : 2つの $n \times n$ boolean matrix $A, B \in \\{0, 1\\}^{n \times n}$ に対して，

$$C = A \circ B, C_{i, j} = \bigvee_{k = 1, \dots, n} A_{i, k} \land B_{k, j}$$

を計算する．

</div>

## BMM $\equiv_3$ Triangle Detection
Triangle Detection は，グラフ中の三角形を検出する問題です．
これは， subcubic 下でBMMと等価な問題として知られています．
Triangle Detection から BMM への帰着は簡単ですが， BMM から Triangle Detection への帰着は非自明です．

<div class="theorem-block" data-type="theorem" markdown="1">
<div class="theorem-title">Theorem</div>

ある $n$ 頂点のグラフに三角形（triangle）が存在するかを $D(n)$ 時間で検出できると仮定する．
このとき，2つの $n \times n$ の boolean matrix multiplication (BMM) は， $O(n^2 D(n^{1/3}))$ 時間で計算できる．

</div>

特に，もし $D(n) = O(n^{3 - \epsilon})$ 時間ならば， BMM は $O(n^{3-\epsilon/3})$ 時間で計算できます．
また，ある定数 $c$ に対して $D(n) = O(n^3/\log^c {n})$ 時間ならば， BMM は $O(n^3/\log^c{n})$ 時間で計算できます．

以下，帰着の説明をします．

$n \times n$ boolean marix $A, B$ を BMM インスタンスとします．  
ここで， $3n$ 頂点のグラフ $G$ を用意し，頂点集合を以下の3つに分割します．
- $I = \\{1, 2, \dots, n\\}$
- $J = \\{n+1, \dots, 2n\\}$
- $K = \\{2n+1, \dots, 3n\\}$

また，グラフ $G$ は以下のルールに従い辺を張る．
1. $i \in I$ から $j \in J$ への辺を $A_{i, j-n} = 1$ の場合にはる
2. $j \in J$ から $k \in K$ への辺を $B_{j, k-2n} = 1$ の場合にはる
3. 全ての組 $(i, k) \in I \times K$ について， $i$ から $k$ への辺をはる

この時，BMMは以下の問題と等価である．
<div class="theorem-block" data-type="problem" markdown="1">
<div class="theorem-title">Problem</div>

各辺 $(i, k) \in I \times K$ に対して，$G$ 中にこの辺を含む三角形は存在するか？

</div>

ここで，パラメータ $t$ を導入します．（これは，後で最適化するパラメータ）

$I, J, K$ をそれぞれ $t$ 分割します．すなわち，各サイズは $\frac{n}{t}$ になっている状態です． 
また，分割したそれぞれの頂点集合を $I_{1}, \dots, I_{t}$ ( $J, K$ についても同様)とします．

ここで，次のアルゴリズムを実行します．
<div class="theorem-block" data-type="algorithm" markdown="1">
<div class="theorem-title">Algorithm</div>

Input : $I_1, \dots, I_t, J_1, \dots, J_t, K_1, \dots, K_t$  
Output : $n \times n$ Boolean Matrix $C$

- Init : $C \gets {\bf 0}$
- For $(i, j, k) \in \\{1, 2, \dots, t\\}^3$
    - $H \gets$ 頂点集合 $I_i \cup J_j, K_k$ からなる誘導部分グラフ
    - While true
        - $H$ をインスタンスとして Triangle Detection を実行
            - Triangle が存在しない場合はbreak
        - Let $\\{x, y, z\\}$ be the triangle that detected the above algorithm
        - $C_{x, z} \gets 1$
        - erase an edge $(x, z)$ in $H$
    - endWhile

</div>

上記の時間計算量について考えます．
三角形を検出する回数は高々 $n^2$ 回，三角形が見つからない回数は高々 $t^3$ 回である．
したがって，全体で $O(n^2D(n/t) + t^3D(n/t))$ 時間となる．
$t = n^{2/3}$ とすることで最小値が達成され，全体の時間計算量は $O(n^2D(n^{1/3}))$ となる．
