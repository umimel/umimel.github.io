---
title: Transitive Orientation
category: graph-algorithm
category_label: Graph Algorithm
summary: 無向グラフを推移性を満たすように向き付けをするアルゴリズムのメモ
date: 2026-04-22
published: true
tags:
  - orientation
  - comparability
  - triangle
---
# Transitive Orientation

無向グラフを推移性を満たすように向き付けをするアルゴリズムのメモ

## Transitive Orientationとは？

Transitive Orientationとは、単純無向グラフ $G = (V, E)$ に対して，推移律が成立するように辺を向き付けすることを指します．厳密には，向き付け後のグラフ $G' = (V', E')$ が以下の状態になっていれば良いです．

<div class="theorem-block" data-type="plain" markdown="1">

任意の異なる3頂点 $x, y, z \in V' $ に対して，
$
(x, y), (y, z) \in E' \Rightarrow (x, z) \in E'
$

</div>

Transitive Orientation が可能な無向グラフのことを [Comparability Graph](https://en.wikipedia.org/wiki/Comparability_graph) と呼びます。


## 応用例

Comparability Graphでは、一般的にはNP-困難であるいくつかの問題を多項式時間で解くことが出来ます。例えば、以下のような問題が挙げられます。

- 最大クリーク問題
- 最大独立集合問題
- 彩色問題
- etc…

これは、Dilworthの定理を用いると容易に求めることが出来ます。この辺のお話は[こちらの記事](https://miscalc.hatenablog.com/entry/2022/11/11/213943#Dilworth-%E3%81%AE%E5%AE%9A%E7%90%86)に詳しく記載されているので読んでみることをお勧めします。

## Comparability Graphの特徴
重要な性質として、以下の性質が成立します。

<div class="theorem-block" data-type="property" markdown="1">
<div class="theorem-title">Property</div>

Comparability Graph中の任意の奇サイクルからなる誘導部分グラフは $C_3$ を含む

</div>
これは、数学的帰納法を用いて簡単に証明することが出来ます。

今回は、この特徴を利用したアルゴリズムを考えます。
具体的には、向き付けのルールを定める辺 $E$ 上の二項関係 $\Gamma$ を以下のように定めます。

<div class="theorem-block" data-type="definition" markdown="1">
<div class="theorem-title">Definition : 二項関係 $\Gamma$</div>

任意の $i \neq k$, $\{i, j\}$, $\{j, k\} \in E$ に対して、$\{i, j\} \Gamma \{j, k\} \Leftrightarrow \{i, k\} \notin E$

</div>

先ほどの性質より、Comparability Graph中の任意の2辺に対して二項関係 $\Gamma$ が成立するならば二部グラフであることが分かります。

## Recoginition
ここで少し唐突ですが、与えられた有向グラフが推移律を満たすかを判定することを考えます。この判定は、後のほど説明する向き付けのアルゴリズムでも使用します。
今回は、$O(m \sqrt{m})$ 時間のアルゴリズムを紹介します。

### Recoginition Algorithm
与えられた有向グラフ $G_d = (V_d, E_d)$ が、推移律を満たすかを判定します。これは、任意の頂点 $u \in V_d$ に対して、

$$
\bigcup_{v \in N_{out}(u)} N_{out}(v) \subset N_{out}(u) 
$$

が成立することが必要十分条件です。この条件は各頂点に対して愚直にチェック(つまり毎回 $N_{out}$ の和集合をとる)することで計算可能です。
$C_3$ の個数が $O(m \sqrt{m})$ であることから計算時間も $O(m \sqrt{m})$ となります．

## Orientation
辺に向きを付けている最中は、無向辺と有向辺が混じっている状態になります。これを $G^\ast = (V, E^\ast)$ と表現します。ここで $G^\ast$ 中のある有向辺に対して、二項関係$\Gamma$が成立する無向辺が存在するとき、この有向辺を**暗黙的である**と呼びます。また、暗黙的な辺を少なくとも一本含むグラフを**不安定**、そうでない場合は**安定**と呼びます。

ある暗黙的な辺が存在するとき、以下の手順で暗黙的な辺を除去することが出来ます。

<div class="theorem-block" data-type="algorithm" markdown="1">
<div class="theorem-title">Algorithm : $\Gamma$-implied Orientation Rule</div>

- 暗黙的な辺 $(i, j)$ を1つ選択
- $(i, j)$ と二項関係 $\Gamma$ が成立する無向辺 $\{i, i'\}$ に対して、$i \rightarrow i'$ に向きを割当
- $(i, j)$ と二項関係 $\Gamma$ が成立する無向辺 $\{j, j'\}$ に対して、$j' \rightarrow j$ に向きを割当

</div>

この操作を繰り返すことでグラフ中から暗黙的な辺を除去することが出来ます。

アルゴリズムの概要は以下の通りです。

<div class="theorem-block" data-type="algorithm" markdown="1">
<div class="theorem-title">Algorithm : Orientation Algorithm</div>

- $G’ \gets G$ で初期化
- グラフ $G’$ 中の任意の辺を1本選択し、適当な方向に向き付け
- グラフ $G’$ が不安定ならば、 安定になるまで $\Gamma$-implied Orientation Rule を適用
- グラフ $G’$ に対して、有向辺、無向辺のみから構成される辺誘導部分グラフそれぞれを $G_d, G_u$ とする
- $G_d$ に対して、Reconginition Algorithm を実行
    - $G_d$ が Comparability Graph でない場合 : Transitive Orientation は不可能
    
- $G’ \gets G_u$ として2.に戻る。ただし、 $G_u$ に辺が存在しない場合は終了

</div>

全体としての時間計算量は$O(m\sqrt{m})$となります。

## 参考

- [TRANSITIVE ORIENTATION OF GRAPHS AND IDENTIFICATION OF PERMUTATION GRAPHS](https://www.cambridge.org/core/services/aop-cambridge-core/content/view/C9E11C37FE3FCB7A88C333E74C9EED01/S0008414X00053074a.pdf/transitive-orientation-of-graphs-and-identification-of-permutation-graphs.pdf)
- [https://miscalc.hatenablog.com/entry/2022/11/11/213943#Dilworth-の定理](https://miscalc.hatenablog.com/entry/2022/11/11/213943#Dilworth-%E3%81%AE%E5%AE%9A%E7%90%86)
