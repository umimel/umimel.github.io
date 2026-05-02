---
title: Unweighted Directed Replacement Paths
category: graph-algorithm
category_label: Graph Algorithm
summary: 重みなし有向グラフに対する Replacement Paths に対する高速なアルゴリズムのメモ
date: 2026-04-23
published: false
tags:
  - shortest paths
  - replacement paths
---
# Unweighted Undirected Replacement Paths

本記事は [ABC218 F - Blocked Roads](https://atcoder.jp/contests/abc218/tasks/abc218_f) の combinatorial BMM Conjecture の下で，ほぼタイトな乱択アルゴリズムの備忘録です．
BMM Conjecture に関しては，以下の記事を参考にしてください．
- [Combinatorial BMM Conjecture]()

また，行列積を用いることで $\tilde{O}(n^\omega)$ 時間で計算できることが知られています．

## 問題概要

:::problem Unweighted Directed Replacement Paths Problem

$n$ 頂点 $m$ 辺の重みなし有向グラフ $G = (V, A)$ が与えられる．

グラフ中の各辺に対して，その辺を通らない頂点 $1$ から頂点 $n$ への最短距離を求めよ．

:::

Replacement Paths Problem に関しては，かなり古くから研究が行われている．今回紹介するアルゴリズムは，以下のものを参考にしているが一部アルゴリズムを簡略化している．
- [Replacement paths and k simple shortest paths in unweighted directed graphs, Roditty and Zwick](https://dl.acm.org/doi/10.1145/2344422.2344423)

## アルゴリズム
今回は上記の問題を $O(m \sqrt{n} \log{n})$ 時間で解く乱択アルゴリズムを紹介します．

### $O(mn)$ 解法
AtCoderに記載されている想定解法では，時間計算量 $O(mn)$ のアルゴリズムが紹介されている．この解法は今回のアルゴリズムの前提となる．
頂点 $1$ から頂点 $n$ への任意の最短パスを $P$ とすると，$P$ 中以外の辺が通れなくなったとしても，最短経路 $P$ を通ることができる．したがって，考慮する辺は $P$ 上のみでよく高々 $n-1$ 本となり，各辺に対して愚直にBFSを行うことで計算できる．

### 用語の定義
以下は，本記事にて説明なしに用いる記号である．
- $P$ : 頂点 $1$ から頂点 $n$ への任意の最短パス
    - $(v_0, v_1, \dots, v_h)$ : パス $P$ の頂点列
    - $A_P$ : パス $P$ の辺集合
- $\mathsf{dist}_H(u, v)$ : グラフ $H$ における頂点 $u$ から頂点 $v$ への最短距離
- $H-e$ : グラフ $H$ から辺 $e$ を取り除いたグラフ

### Detourの導入
辺 $e_j = (v_j, v_{j+1})$ が通れない場合の最短距離 $\mathsf{dist}_{G - e_j}(1, n)$ は以下で表すことが出来る． 

$$
\mathsf{dist}_{G-e_j}(1, n) = \min_{0 \leq i \leq j < k \leq h} \left \{ \mathsf{dist}_G(1, v_i) + \mathsf{dist}_{G \setminus A_P}(v_i, v_k) + \mathsf{dist}_G(v_j, n) \right \}
$$

この時，$d_{G-E_P}(v_i, v_k)$ をパス $P$ 上の頂点 $v_i$ から頂点 $v_k$ へのdetourと呼ぶ．

### 方針
先ほど導入したdetourについて小さい場合と大きい場合で手法を変える．  
具体的には，detourの長さを $B = \lceil \sqrt{n} \rceil$ を基準として以下のように分ける．
- **Shortest Path with Short Detour** : detourの長さが $B$ 未満である頂点 $1$ から頂点 $n$ への迂回パス
- **Shortest Path with Long Detour** : detourの長さが $B$ 以上である頂点 $1$ から頂点 $n$ への迂回パス

これら２つのパス集合に対して，それぞれ最短距離 
$\mathsf{sdist}_{G \setminus \{e\}}(1, n), \mathsf{ldist}_{G \setminus \{e\}}(1, n)$ 
を計算し小さい方が答えとなります．

### Short Detour
$P$ 上の各頂点を始点としてグラフ $G \setminus A_P$ 上でBFSを実行します．ただし，頂点 $v_i$ を始点とした際に探索する頂点集合は， $\{v \mid v \in V, i - B < \mathsf{dist}_G(1, v) \leq i + B \}$ に限定します．各頂点と各辺は高々 $2B$ 回しかBFSの探索範囲に入らないことから，時間計算量は $O(mB)$ であることがわかります．また，この頂点集合のみで十分であることは証明可能です．

:::algorithm

1. 各 $i~(0 \le i < h)$ に対して，グラフ $H_i = (V_i, A_i)$ を構築する．
    - $V_i = \{ v \mid v \in V, i - B < \mathsf{dist}_G(1, v) \leq i + B \}$
    - $A_i = \{ e \mid e=(u, v) \in A \setminus A_P, u, v \in V_i \}$
2. 各 $i~(0 \le i < h)$ に対して，頂点 $v_i$ を始点としてグラフ $H_i$ 上で BFS を実行
    - $\mathsf{dist}_{H_i}(v_i, \cdot)$ を計算する．
3. 任意の辺 $e_j = (v_j, v_{j+1})~(0 \le j < h>)$ に対して，以下を計算する．
$$
\mathsf{sdist}_{G - e_j}(1, n) = 
$$

:::

<div class="theorem-block" data-type="algorithm" markdown="1">
<div class="theorem-title">Algorithm</div>

- 各頂点 $v_i \in P$ に対して，$V_i = \{ v \mid v \in V, i - \sqrt{n} < d_G(1, v) \leq i + \sqrt{n} \}$ とする． 
- 各頂点 $v_i \in P$ に対して，$V_i$ からなる誘導部分グラフ上で頂点 $v_i$ を始点としてBFSを実行
-  任意の辺 $e_j = (v_i, v_j)~(0 \le j < h)$ に対して，以下を計算する．
    $$
        \mathsf{sdist}_{G-e_j}(1, n) = \min_{j-\sqrt{n} < i < j < k < j + \sqrt{n}} \mathsf{dist}_{G}(1, v_i) + \mathsf{dist}_{G \setminus A_P}(v_i, v_k) + \mathsf{dist}_{G}(v_k, n)
    $$

</div>

<details class="proof-block" markdown="1">
<summary class="proof-title">Proof</summary>
<div class="proof-body" markdown="1">

各頂点は高々 $2\sqrt{n}+1$ 回しか訪問されないことを示す．
ある頂点 $x$ が $2\sqrt{n}+2$ 回以上訪問されたとする．この時，訪問したBFSの始点の添字の最小値を $i$，最大値を $j$ とする．この時，$d_G(v_i, v_j) \geq 2\sqrt{n}+1 $である．しかし，BFSの終了条件より $d_G(

</div>
</details>

### Long Detour の計算
Long Detourの計算には，サンプリングした頂点をベースとした経路を使用します．
Long Detourの距離は $B$ 以上であることから， $V$ 中の各頂点を $\frac{3 \log n}{B}$ の確率でサンプリングすると，高確率で Long Detour 中にサンプリングした頂点が少なくとも1つ存在します．したがって，サンプリングした頂点を経由するような経路を計算すれば十分です．

<div class="theorem-block" data-type="algorithm" markdown="1">
<div class="theorem-title">Algorithm</div>

- 頂点集合 $V$ の各頂点を $\sqrt{n} \log{n}$ 個の頂点をランダムサンプリング．サンプリングした頂点集合を $R$ とする．
- 各頂点 $r \in R$ に対して，$d_{G - E_P}(\cdot, r)$ と $d_{G - E_P}(r, \cdot)$ を計算
- 各辺 $e_j \in E_P$ に対して， Long Detour を持つ経路 $\ell d_{G - e_j}(1, n)$ を計算
    $$
        \begin{align}
            \ell d_{G - e_j}(1, n) = \min_{r \in R} \{ \min_{1 \leq i \leq j} &d_{G}(1, i)+d_{G-E_P}(i, r) 
            \\\\ &+ \min_{j < k \leq p} d_{G-E_P}(r, k)+d_{G}(k, n) \}
        \end{align}
    $$

</div>

## 余談
このアルゴリズムは，辺が通れなくなる場合だけでなく頂点が通れない場合でも適用可能です．
