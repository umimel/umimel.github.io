# Unweighted Undirected Replacement Paths

重みなし有向グラフに対する Replacement Paths を高速にとくアルゴリズムの備忘録

## 初めに
本記事は [ABC218 F - Blocked Roads](https://atcoder.jp/contests/abc218/tasks/abc218_f) の Path Comparison Model 下でもほぼタイトな Ramdomized Algorithm の備忘録です．Path Comparison Model の理解としては，行列積を使用しない解法だと思っておけばイメージとして十分です（(min, +)の行列積を使用すると，$O(n^\omega)$ 時間で計算可能です）．

## 問題概要
:::problem
重みなし有向グラフが与えられます．各辺に対して，その辺が通れない場合の頂点 $1$ から頂点 $n$ への最短距離を求めてください．
:::

## アルゴリズム
今回は上記の問題を $O(m \sqrt{n} \log{n})$ 時間で解く乱拓アルゴリズムを紹介します．

### $O(mn)$ 解法
AtCoderに記載されている想定解法では，時間計算量 $O(mn)$ のアルゴリズムが紹介されています．この解法は今回のアルゴリズムの前提となります．
頂点 $1$ から頂点 $n$ への任意の最短パスを $P$ とすると，$P$ 中以外の辺が通れなくなったとしても，最短経路 $P$ を通ることができます．したがって，考慮する辺は $P$ 上のみでよく高々 $n-1$ 本となります．各辺に対して愚直にBFSを行うことで計算できます．

### 用語の定義
以下，本記事にて説明なしに用いる記号です．
- $P$ : 頂点 $1$ から頂点 $n$ への任意の最短パス
    - $(v_1, v_2, \dots, v_p)$ : パス $P$ の頂点列
    - $E_P = (e_1, e_2, \dots, e_{p-1})$ : パス $P$ の辺列
- $d_H(u, v)$ : グラフ $H$ における頂点 $u$ から頂点 $v$ への最短距離
- $H-e$ : グラフ $H$ から辺 $e$ を取り除いたグラフ

### Detourの導入
辺 $e_j$ が通れない場合の最短距離 $d_{G - e_j}(1, n)$ は以下で表すことが出来る． 

$$
d_{G-e_j}(1, n) = \min_{1 \leq i \leq j < k \leq p} d_G(1, v_i) + d_{G-E_P}(v_i, v_k) + d_G(v_j, n)
$$

この時，$d_{G-E_P}(v_i, v_k)$ をパス $P$ 上の頂点 $v_i$ から頂点 $v_k$ へのdetourと呼ぶ．

### 方針
先ほど導入したdetourについて小さい場合と大きい場合で手法を変える．
具体的には，detourの長さを $\sqrt{n}$ を基準として以下のように分けます．
- **Replacement Path with Short Detour** : detourの長さが $\sqrt{n}$ 未満である頂点 $1$ から頂点 $n$ への迂回パス
- **Replacement Path with Long Detour** : detourの長さが $\sqrt{n}$ 以上である頂点 $1$ から頂点 $n$ への迂回パス

これら２つのパス集合に対して，最短経路を計算し小さい方が答えとなります．

### Short Detour
$P$ 上の各頂点を始点としてグラフ $G - E_P$ 上でBFSを実行します．ただし，頂点 $v_i$ を始点とした際に探索する頂点集合は， $\{v \mid v \in V, i - \sqrt{n} < d_G(1, v) \leq i + \sqrt{n} \}$ に限定します．各頂点は高々 $2\sqrt{n}$ 回しかBFSの探索範囲に入らないことから，時間計算量は $O(m \sqrt{n})$ であることがわかります．また，この頂点集合のみで十分であることは証明可能です．

:::algorithm
- 各頂点 $v_i \in P$ に対して，$V_i = \{ v \mid v \in V, i - \sqrt{n} < d_G(1, v) \leq i + \sqrt{n} \}$ とする． 
- 各頂点 $v_i \in P$ に対して，$V_i$ からなる誘導部分グラフ上で頂点 $v_i$ を始点としてBFSを実行
-  任意の $j$ $(1 \leq i < j < k \leq q, k-i \leq \sqrt{n}) $ に対して， 
    $$
        sd_{G-e_j}(1, n) = \min_{j-\sqrt{n} < i < j < k < j + \sqrt{n}} d_{G}(1, v_i) + d_{G-E_P}(v_i, v_k) + d_{G}(v_k, n)
    $$
:::

:::proof
各頂点は高々 $2\sqrt{n}+1$ 回しか訪問されないことを示す．
ある頂点 $x$ が $2\sqrt{n}+2$ 回以上訪問されたとする．この時，訪問したBFSの始点の添字の最小値を $i$，最大値を $j$ とする．この時，$d_G(v_i, v_j) \geq 2\sqrt{n}+1 $である．しかし，BFSの終了条件より $d_G(
:::

### Long Detour の計算
Long Detourの計算には，サンプリングした頂点をベースとした経路を使用します．
Long Detourの距離は $\sqrt{n}$ 以上であることから， $O(\sqrt{n} \log{n})$ 個の頂点をランダムにサンプリングすると，高確率でLong Detourとサンプリングした頂点集合が交差します．したがって，サンプリングした頂点を経由するような経路を計算すれば十分です．

:::algorithm
- 頂点集合 $V$ の各頂点を $\sqrt{n} \log{n}$ 個の頂点をランダムサンプリング．サンプリングした頂点集合を $R$ とする．
- 各頂点 $r \in R$ に対して，$d_{G - E_P}(\cdot, r)$ と $d_{G - E_P}(r, \cdot)$ を計算
- 各辺 $e_j \in E_P$ に対して， Long Detour を持つ経路 $\ell d_{G - e_j}(1, n)$ を計算
    $$
        \begin{align}
            \ell d_{G - e_j}(1, n) = \min_{r \in R} \{ \min_{1 \leq i \leq j} &d_{G}(1, i)+d_{G-E_P}(i, r) 
            \\\\ &+ \min_{j < k \leq p} d_{G-E_P}(r, k)+d_{G}(k, n) \}
        \end{align}
    $$
:::

## 余談
このアルゴリズムは，辺が通れなくなる場合だけでなく頂点が通れない場合でも適用可能です．