---
title: Maximum Reachable Orientation
category: graph-algorithm
category_label: Graph Algorithm
summary: 到達可能な頂点対の数を最大化する向きづけに関するアルゴリズム
date: 2026-05-02
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
\sum_{1 \le s, t \le n} f(s, t)
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
このとき，同一の2辺連結成分が強連結となるように向きづけできます．
（これは，教科書にも載っている有名な事実で，Strong Orientation とも呼ばれています）

したがって，2辺連結成分の頂点数を重みとする頂点重み付き木の問題に帰着できます．

<div class="article-figure-grid">
  <figure class="article-figure article-figure-wide">
    <a href="{{ '/images/articles/graph-algorithm/maximum-reachable-orientation/two-ecc.svg' | relative_url }}" target="_blank" rel="noopener">
      <img
        src="{{ '/images/articles/graph-algorithm/maximum-reachable-orientation/two-ecc.svg' | relative_url }}"
        alt="2辺連結成分分解の図"
      >
    </a>
    <figcaption>2辺連結成分分解</figcaption>
  </figure>
  <figure class="article-figure">
    <a href="{{ '/images/articles/graph-algorithm/maximum-reachable-orientation/weighted-tree.svg' | relative_url }}" target="_blank" rel="noopener">
      <img
        src="{{ '/images/articles/graph-algorithm/maximum-reachable-orientation/weighted-tree.svg' | relative_url }}"
        alt="2辺連結成分を縮約した頂点重み付き木の図"
      >
    </a>
    <figcaption>縮約後の頂点重み付き木</figcaption>
  </figure>
</div>

### 木に対する向きづけ
ここが，この問題の一番面白いポイントです．

まず，木に対する最適な向き付けになり得る構造について考えます．
実は，以下のような主張が成立します．

:::lemma
任意の2頂点間のパスに対して，向きが変わるのは高々1回である．
:::

:::proof
論文を参照
:::

上記の補題により以下の重要な主張が成立します．

:::corollary
向きの切り替わりが起こる頂点は高々1つである．
:::

したがって，中心を固定して良いことがわかりました．  
中心を取り除いた部分木は，中心に向かう部分木（以下，In 側）と中心から出る部分木（以下，Out 側）のどちらかとなります．  
どちらに割り当てられても部分木内での到達可能な頂点対の個数は変わらないため，

$$
(\text{In} 側の頂点重みの総和) \times (\text{Out} 側の頂点重みの総和)
$$

が最大となるように各部分木を割り当てる問題となります．
これは，出来るだけ部分木の重みを均等になるように割り当てるのが最適であるため，部分和問題を解くことで解決できます．

<figure class="article-figure article-figure-compact">
  <a href="{{ '/images/articles/graph-algorithm/maximum-reachable-orientation/orientation.svg' | relative_url }}" target="_blank" rel="noopener">
    <img
      src="{{ '/images/articles/graph-algorithm/maximum-reachable-orientation/orientation.svg' | relative_url }}"
      alt="中心から各部分木を In 側と Out 側へ割り当てる向きづけの図"
    >
  </a>
  <figcaption>中心を固定したときの In 側と Out 側への割り当て</figcaption>
</figure>

しかし，部分和問題を考える前に中心がどこになるのかを考える必要があります．
実は，中心は「木の重み付き重心」となることを証明することができます．

:::lemma

最適な割り当てにおける中心は，重み付き重心となる．

:::

:::proof
証明は論文を参照
:::

### 部分和問題
上記の議論により，以下の問題に帰着できます．

:::problem

Input : 正整数列 $A = (a_1, a_2, \dots, a_k)$
- $k$ は，重み付き重心の次数
- $\sum_{i = 1}^k a_i \le n-1$

Output : 各 $i~(0 \le i \le \frac{n}{2})$ に対して， $A$ から $0$ 個以上の要素を選び和を $i$ にできるか？
:::

数列の重複なしの要素数は，和が $n-1$ 以下であることから $O(\sqrt{n})$ 個程度となります．  
また，これらの個数を2冪で分けて処理することで数列のサイズが $O(\sqrt{n})$ 個まで減少します．（類題 : [ABC269-G](https://atcoder.jp/contests/abc269/tasks/abc269_g)）

したがって，上記の Problem 2 に関しては，動的計画法を行うことで $O(n\sqrt{n})$ 時間で処理できることがわかりました．

また，この問題は mod 乱択することで fps の explog で $O(n \log n)$ 時間で解くことができます．

### 全体の時間計算量
それぞれの時間計算量は以下になります．
- 2辺連結成分分解 : $O(m + n)$
- 重心の計算 : $O(n)$
- 部分和問題パート : $O(n \sqrt{n})$ もしくは $O(n \log n)$ (乱択)

全体として $O(m + n\sqrt{n})$ または，乱択で $O(m + n \log n)$ 時間で解くことができました．
