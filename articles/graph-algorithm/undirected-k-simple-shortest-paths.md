---
title: Undirected K Simple Shortest Paths
category: graph-algorithm
category_label: Graph Algorithm
summary: 正の重み付き無向グラフにおける特定の2頂点間の最短経路を小さい順に k 個列挙するアルゴリズムのメモ
date: 2026-04-25
published: false
tags:
  - shortest path
  - enumeration
  - undirected graph
---
# Undirected K Simple Shorteset Paths Problem

考えたのでメモ．元論文が見れなくて悲しい．

## 初めに

正の(辺)重み付き無向グラフ $G=(V, E, w)$ における特定の2頂点 $s, t$ 間における最短経路を小さい順に $k$ 個列挙する $O(k(m+n \log n))$ 時間のアルゴリズムの説明です。よく知られている Yen’ algorithmは有向グラフにおいて $O(kn(m+n \log n))$ 時間ですので、かなり高速になります。Yen's algorithmについては[こちらの記事](https://qiita.com/nariaki3551/items/821dc6ffdc552d3d5f22)が分かりやすいですので先に読んでおくことをおすすめします。

既存研究として、[N. Katoh, T. Ibaraki, and H. Mine. An efficient algorithm for K shortest simple paths.](https://qiita.com/Qiita/items/c686397e4a0f4f11683d)で解かれていますが、有料でないと読めなかったので諦めました。

この時間計算量で解けることは知っていた(アルゴリズムは知らない)のですが、あまり記事などを見かけなかったのでまとめておく目的で書きました。大部分は自身で考えているので間違えている箇所があるかも知れませんが、ご了承ください。

## 記法

全体を通して(説明無しで)使用している記法です。

- $d_H(x, y)$ := グラフ $H$ における 頂点 $x$ から頂点 $y$ への最短経路長
- $N_H(x)$ := 頂点 $x$ の隣接頂点集合
- $V(H)$ := グラフ $H$ における頂点集合
- $H-e$ := グラフ $H$ から辺 $e$ を取り除いたグラフ

## 第1最短経路

Dijkstra法を実行することで求めることが可能です。

## 第2最短経路

先ほど計算した第1最短経路 $P_1$ に対して、各辺が通れない場合の $s$-$t$ 最短経路を求め、それらの最短経路を採用すれば良いです。すなわち、パス $P_1$ の辺列を $(e_1, e_2, \dots, e_{p-1})$ としたとき、

$$
\min_{1 \leq i < p} d_{G-e_i}(s, t)
$$

を達成する経路が第2最短経路となります。これは、 $O(m+n\log n)$ 時間で計算可能です。

まず、グラフ $G$ における $s$ を根とする最短経路木を $S$、 $t$ を根とする最短経路木を $T$ とします。ただし、これらは共にパス $P_1$ を含むものとします。また、各 $i$ $(1 \leq i < p)$ に対して、 $S$ から辺 $e_i$ を除去した時に頂点 $s$ 含む方の木を $S_i$ , 含まない方の木を $\overline{S_i}$ とします。同様に、$T$ から辺 $e_i$ を除去した時に頂点 $t$ 含む方の木を $T_i$ , 含まない方の木を $\overline{T_i}$ とします。

 $G=(V, E, w)$ が<span style="color: red; "><b>無向グラフ</b></span>であることから、以下が成立します。

<div class="theorem-block" data-type="lemma" markdown="1">
<div class="theorem-title">Lemma</div>

パス $P$ 上の任意の辺 $e_i$ $(1 \leq i < p)$ に対して、
$$
    d_{G - e_i}(s, t) = \min_{\substack{(x, y) \in E \\\\ x \in V(S_i), y \in V(T_i)}}{d_{G}(s, x) + w(x, y) + d_G(y, t)}
$$
が成り立つ．

</div>

<details class="proof-block" markdown="1">
<summary class="proof-title">Proof</summary>
<div class="proof-body" markdown="1">


$$
d_{G - e_i}(s, t) = 
\min_{\substack{(x, y) \in E \setminus \{e_i\} \\ x \in V(S_i), y \in V(\overline{S_i})}}
{d_{G}(s, x) + w(x, y) + d_G(y, t)}
$$

は成立する。ここで、 \(V(\overline{S_i}) = V(T_i)\) であることを示す。 
これは、 \(V(T_i) \subseteq V(\overline{S_i})\) かつ \(V(\overline{S_i}) \subseteq V(T_i)\) を示せば十分である。どちらも証明方法は同じなので、 \(V(\overline{S_i}) \subseteq V(T_i)\) だけ背理法を用いて示す。以降、 \(e_i = (v_i, v_{i+1})\) とする。
ある頂点 \(y\) に対して、 \(y \in V(\overline{S_i})\)  かつ \(y \notin V(T_i)\) と仮定すると、\(y \in V(\overline{T_i})\) より、 \(T\) において \(y\) は \(v_{i+1}\) の孫であることから、

$$
    d_G(v_{i+1}, y) = w(e_i)+d_G(v_i, y) > d_G(v_i, y)
$$

一方、 \(y \in V(\overline{S_i})\) より、 \(S\) において \(y\) は \(v_i\) の孫であることから、 

$
d_G(v_i, y) = w(e_i)+d_G(v_{i+1}, y) > d_G(v_{i+1}, y)
$

したがって矛盾が生じる。 

</div>
</details>

つまり，故障辺によって分割された２つの木の間を結ぶ各辺 $(x, y)$ に対して，頂点 $s$ から頂点 $x$ までの最短経路
上記の補題1により、以下のアルゴリズムが正しく動作します。

<div class="theorem-block" data-type="algorithm" markdown="1">
<div class="theorem-title">Algorithm : Second Shortest Path Algorithm</div>

<b>Input : </b> 
- $G = (V, E, w)$ : 正の辺重み付き無向グラフ
- $s \in V$ : 始点
- $t \in V$ : 終点

<b>Algorithm : </b> 
1. 頂点 $s$ を始点としてダイクストラ法を実行
    - $P$ : $s$-$t$ 最短経路
        - 辺列 : $(e_1, e_2, \dots, e_{p-1})$
        - 頂点列 : $(v_1, v_2, \dots, v_p)$
    - $S$ : $s$ を根とする最短経路木
    - $d_G(s, u)$ : 頂点 $s$ から各頂点 $u \in V$ への最短経路長

2. 頂点 $t$ を始点としてダイクストラ法を実行
    - $d_G(u, t)$ : 各頂点 $u \in V$ から頂点 $t$ への最短経路長

3. 各頂点 $u \in V$ に対して、ラベル $L(u)$ を計算
    - $L(u)$ := $LCA_S(u, t) = v_i$ を満たす添字 $i$

4. $i = 1, 2, \dots, p-1$ の順に以下の操作を行う
    - $L(x) \leq L(y) = i$ を満たす各辺 $e = (x, y) \in E \setminus E(P)$ に対して、multiset から $d_G(s, x)+w(x, y)+d_G(y, t)$ を削除
    - $i = L(x) \leq L(y)$ を満たす各辺 $e = (x, y) \in E \setminus E(P)$ に対して、multiset に $d_G(s, x)+w(x, y)+d_G(y, t)$ を追加
    - $d_{G-e_i}(s, t)$ をmultiset中の最小値とする
        - ただし、存在しない場合は inf

<b> Output : </b> $\min_{1 \leq i < p} d_{G-e_i}(s, t)$ 

</div>

以上が第2最短経路となります。最小値のみ経路の復元を行いましょう。同じ値があった場合は辺の添字が小さい経路を選択します。

と言いたいところですが，第3最短経路以降でも使用するために少し求める値を変更します．
具体的には，$d_{G-e_i}(v_i, t)$ を計算することとします．

## 第3最短経路

第2最短経路では先の説明で十分ですが，これから

第2最短経路における距離を $d_{G - e_x}(s, t)$，経路を $P_2$ をとします．
先ほども言いましたが，同じ値があった場合は $e_x$ の添字が小さい経路を選択します(これにより，パス $P_1$ において頂点 $v_x$ から分岐が始まる経路であることが保証されます)．

$P_2$ を対象に第2最短経路と似たようなアルゴリズムを適用しますが、最短経路木を構築する際に注意が必要です。 辺 $e_x$ が残っていると $P_1$ が $s$ - $t$ 最短経路となってしまうので、グラフから辺 $e_x$ を除去します。ただし、 必要無いのは $v_x \rightarrow v_{x+1}$ の向きだけであり、 $v_{x+1} \rightarrow v_x$ の向きは使用される可能性があるので残しておきます．

これにより $P$ が最短経路であることが保証されます。あとは同じアルゴリズムを適用して計算しましょう。**有向グラフ**になっているので補題1が成り立つかどうかを考慮する必要がありますが、証明をよく見ると $Q$ 上が無向辺のみであることから成り立ちます。(証明略)

次に $P$ についてももう一度計算しなおします。ただし、 先に計算した $Q$ 自身や $Q$ をベースとする経路との重複を除くため、prefixの辺列を $(e_1, e_2, \dots, e_x)$ に固定した経路に限定して調べます。 グラフ $G$ において、各頂点 $v_i$ $(1 \leq i \leq x+1)$ に接続している辺の内、パス $P$ 上以外のものを全て削除します。このグラフ上でアルゴリズム1を適用することで新たな経路を計算します。

第3最短経路としては上記で計算した2つの経路の内、短い方を採用します。

## アルゴリズム

ある程度の具体例の説明は終わったので、アルゴリズムの説明に移ります。

### 記号の説明

- $P_i$ :=  $i$ 番目の最短経路 $(1 \leq i \leq k)$
- $G_i$ := $i$ 番目に構築するグラフ $(1 \leq i \leq k)$
    - $G_1$ := 入力グラフ
- que := 最短経路の候補を格納するpriority queue
    - (距離, 何番目のグラフ上の経路か, 経路, どの辺(辺の添字)が通れない時の最短経路か)

### アルゴリズム

<div class="theorem-block" data-type="info" markdown="1">
<div class="theorem-title">Info</div>

<b><u>Algorithm2 : Undirected Kth Shortest Path</u></b>

<b>Input</b> : 
- `G` : input graph
- `s` : source

<b>Variable Decleration :</b>
- `H[i]` := $i$ 番目に構築するグラフ


</div>

1. Dijkstra’s algorithm で最短経路を求め $P_1$ とする
2. que に $($P_1$の距離, $1$, $P_1$, $0$)$ をpush
3. $i = 2, 3, \dots, k$ の順に以下の操作を行う
    1. que から最小距離を持つ情報 $(dist_{G_j}(s, t), j, Q, x)$ を取り出す
        - $P_j$ の辺列を $(e_1, e_2, \dots, e_{x-1}, e_x, \dots, e_{p-1})$ 、頂点列を $(v_1, v_2, \dots, v_p)$ とする
        - $Q$ の辺列を $(f_1(=e_1), f_2(=e_2), \dots, f_{x-1}(=e_{x-1}), f_x, \dots, f_{q-1})$ とする
    2. $G_i \gets G_j$, $P_i \gets Q$
    3. $G_i$ において、辺 $e_x$ を $v_{x+1} \rightarrow v_x$ の方向に向き付け
    4. 各 $\ell$ $(x+1 \leq \ell \leq p)$ に対して、 $N_{G_i}(v_{\ell}) \gets N_{G_1}(v_\ell)$ を行い向き付けされた辺をリセット
    5. $G_i$, $Q$ を入力として Second Shortest Path Algorithmを実行
        - 結果を経路 $R_i$, 辺 $f_y$ が通れない場合の経路とする
    6. que に($dist_{G_i - f_y}(s, t)$, $R_i$, $i$, $y$)を push
    7. $G_j$において、頂点 $v_1, v_2, \dots, v_x$ に接続する辺の内、パス $P_j$ 上にあるもの以外を全て削除
    8. $G_j$, $R$ を入力として Second Shortest Path Aglrithmを実行
        - 結果を経路 $R_j$, 辺 $e_z$ が通れない場合の経路とする
    9. que に($dist_{G_i - e_z}(s, t)$, $R_i$, $i$, $z$)を push

全体を見ると、各グラフから1本の経路を候補として採用しているだけですので、経路自体は que に入れる必要はなく、別の配列で管理しても良いです(定数倍が早くなると思います)。

## 最後に

アルゴリズムにおいて、重複がないこととその都度最小のものを取れていることの証明を行っていないので、また考えて追記します。あと、間違えていたらすみません。
