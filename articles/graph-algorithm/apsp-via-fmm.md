---
title: All Pairs Shortest Paths via Faster Matrix Multiplication
category: graph-algorithm
category_label: Graph Algorithm
summary: 行列積を用いた最短経路の計算について勉強したのでメモ
date: 2026-04-24
tags:
  - shortest path
  - APSP
  - matrix multiplication
---
# All Pairs Shortest Paths via Faster Matrix Multiplication

行列積を用いた最短経路の計算について勉強したのでメモ

- 参考：[Shoshan and Zwick[FOCS’99]](https://dl.acm.org/doi/10.5555/795665.796471)

## 基礎知識

### Matrix Multiplication

以下で定義する問題をMatrix Multiplication（以下，MM）と呼びます．基本的には長方形行列 $n \times m$ で考えるのが一般的ですが，議論が面倒くさいので今回は正方行列を考えます．

:::problem Matrix Multiplication

$n\times n$ 行列 $A, B$ が与えられます． $n \times n$ 行列 $C=A \times B$ を用いて以下で定義します．

$$
C_{i, j} = \sum_{k=1}^n A_{i, k} \times B_{k, j}
$$

$C$ を出力してください．

:::

特に何も考えずに計算すると， $O(n^3)$ 時間で計算することができます．MMは古くから研究されており，1969年にStrassenにより， $O(n^{\log_2 7}) \approx O(n^{2.807})$ 時間のアルゴリズム（[Strassen Algorithm](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%A5%E3%83%88%E3%83%A9%E3%83%83%E3%82%BB%E3%83%B3%E3%81%AE%E3%82%A2%E3%83%AB%E3%82%B4%E3%83%AA%E3%82%BA%E3%83%A0)）が提案されました．さらに近年もこの記録は更新され続けており，直近の結果（2026年2月1日 現在）だと， Almanらによって $\tilde{O}(n^{2.371339})$ 時間のアルゴリズムが提案されています（[SODA’25](https://epubs.siam.org/doi/10.1137/1.9781611978322.63)）．一般に，MMの時間計算量は square matrix multiplication exponent $\omega < 2.371339$ を用いて $\tilde{O}(n^\omega)$ と表記されます．

ちなみに余談ですが，MMの計算ではなく判定問題版も存在します．

<div class="theorem-block" data-type="problem" markdown="1">
<div class="theorem-title">Problem : Matrix Multiplication（判定版）</div>


$n\times n$ 行列 $A, B, C$ が与えられます． $C = A \times B$ かどうかを判定してください．


</div>

実は，この問題を $\tilde{O}(n^2)$ 時間で解く乱択アルゴリズム（モンテカルロ）が存在します．
詳しくは，[この辺の記事](https://tech.preferred.jp/ja/blog/matrix-multiplication-and-polynomial-identity/)を見てみると分かりよいと思います．

### All Pairs Shortest Paths Problem

以下で定義する問題を All Pairs Shortest Paths Problem （以下，APSP）と呼びます．

<div class="theorem-block" data-type="problem" markdown="1">
<div class="theorem-title">Problem</div>


**All Pairs Shortest Paths**

$n$ 頂点 $m$ 辺のグラフが与えられます．任意の2頂点間の最短距離を出力してください．


</div>

上記の問題はかなり曖昧に書いており，例えば重み関数の値域（ $\mathbb{N}, \mathbb{R}, \mathbb{F}, \mathbb{R_{\ge 0}}$ ）や有向or無向など様々な問題設定を考えることができます．

一般的には，負重みが絡むと最短距離=最長距離の問題に帰着されるためNP-困難となります．しかし，入力グラフにnegative cycle が存在しないという仮定をおくと多項式時間で解くことができます．

APSPは様々なアルゴリズムが知られており，[Wikipedia](https://en.wikipedia.org/wiki/Shortest_path_problem) にまとまっているので見てみるとよいです（ここではまとめません）．

有名どころでいうと，Floyd-Warshall Algorithm や Bellman-Ford Algorithm（+ Potential Dijkstra) かなと思います．

実はこの問題はMMを用いることでも解けるよというのが今回のお話になります．

## (min, +)-Matrix Multiplication

ここでは，どのようにしてAPSPを行列積として計算できるかについて考えてます．

(min, +)の細かい内容は[こちらの記事](https://qiita.com/lotz/items/094bffd77b24e37bf20e)の方がよくまとまっていると思います．

基本的には，MMは「×したものを+すること」でMMにおける1要素を計算することができます．

ここで，「+したもののminを取る」という操作に置き換えたものを (min, +)-MM 呼びます．具体的には以下のような問題となります．

<div class="theorem-block" data-type="problem" markdown="1">
<div class="theorem-title">Problem : (min, +)-Matrix Multiplication</div>


$n\times n$ 行列 $A, B$ が与えられます． $n \times n$ 行列 $C=A \otimes B$ を以下で定義します．

$$
C_{i, j} = \min_{k=1, \dots, n} A_{i, k} + B_{k, j}
$$

$C$ を出力してください．


</div>

これは，(min, +)-semiringと呼ばれる半環上の演算となっています．もちろん， 愚直に計算すると $O(n^3)$ 時間で計算できるわけですが，「MMと同等の計算時間で解けるか？」という問いに対しては簡単にYesということは出来ません．

実は，上記の演算をグラフの隣接行列同士に適用すると1hop先の最短距離を計算することができます．すなわち，以下が成立します．

<div class="theorem-block" data-type="claim" markdown="1">
<div class="theorem-title">Claim</div>


任意の $n$ 頂点のグラフの隣接行列を $A$ とする．（ただし，辺が存在しない要素については $\infty$ ， $A_{i, i} = 0$ とする ）
また， 任意 $1 \le h < n$ に対して， $n \times n$ 行列 $B$ を以下で定義する．（ただし，累乗は(min, +)-MMを $h-1$ 回適用しているものとする）

$$
B = \bigotimes_{i = 1, 2, \dots, h} A
$$

このとき，任意の２頂点 $s,t$  に対して， $s-t$ 間のパスであり $h-1$ hop 以下 であるようなものの最小値は $B_{s, t}$ である． 


</div>

任意の2頂点間の最短経路のhop長は高々 $n-1$ であることから，この演算を $n-1$ 回行うことでAPSPを解くことができます．

これを愚直に実行すると全体で $O(n^4)$ 時間ですが，この(min, +)-MMについては結合則が成立することからダブリング（繰り返し二乗法）をしても問題ないです．

ということで，全体で $O(n^3 \log n)$ 時間で計算できます． 

(min, +)-MM のままでは，Faster Matrix Multiplication の恩恵を受けることが出来ないので，(+, ×)-MMの形でシミュレーションできるようにうまく変形を行います．

以下，行列内の値域が時間計算量に関わってくるため， $[-M, M] \in \mathbb{Z}$ 内の整数値を取るという下で考えます．

変換の手順は，以下の通りです．

<div class="theorem-block" data-type="algorithm" markdown="1">
<div class="theorem-title">Algorithm : (min, +)-MM から (+, ×)-MM へのインスタンス変換</div>


**入力** : $n \times n$ 行列 $A, B \in [-M, M]^{n \times n}$

**出力** : $n \times n$ 行列 $A', B' \in [-O(n^M), O(n^M)]^{n \times n}$

1. 整数 $b$ を $2n < b < 3n$ となるように適当にとる（これは適当でよくて，とりあえず $n < b$ かつ $b=O(n)$ だったらなんでもよいはず… ）
2. $n \times n$ 行列 $A', B'$ を {::nomarkdown}$A'_{i, j} = b^{2M-A_{i, j}}, B'_{i, j} = b^{2M-B_{i, j}}${:/nomarkdown} とする．

</div>

実はこのような変換を行い $A’ \times B’$ を計算することで元の $A \otimes B$ も計算できます．

具体的には，以下の主張が成立します．

<div class="theorem-block" data-type="claim" markdown="1">
<div class="theorem-title">Claim</div>


$A \otimes B = C, A’ \times B’ = C’$ とする．

このとき，任意の $1 \le i, j \le n$  に対して，以下が成立する．

$$
C_{i, j} = 4M - (C'_{i, j} の b 進表記における桁数)
$$


</div>

証明は省略しますが， $b>n$ と取ることで $C’_{i, j}$ の計算時に（b進表記で）繰り上がりが発生しないように調整しています．したがって，そのまま桁数が(min, +)-MMを表すようになっています．

一方でこのインスタンス変換についてですが，扱う数字がとても大きくなってしまいます．基本的な word-RAM Model では $O(\log n)$ bit を 1 word として取り扱います．すなわち，今回の変換により1つの数値が $O(\log n^M) = O(M \log n)$ bit となります．したがって，1つの数値を取り扱うのに $M$ word 必要となります．

例えば，（1 word の数値）×（1 word の数値）の計算は $O(1)$ としてよいですが，（ $M$ word の数値）×（ $M$ word の数値）の計算は word-RAM Model だと $O(M \log M)$ 時間（畳み込み）の計算が必要となります．

したがって，時間計算量は $\tilde{O}(Mn^{\omega})$ となります．

ここまで来ると，APSPにも適用してあげることが出来ます．

APSPインスタンスにおけるグラフの重み関数を $[-M, M]$ とすると，最短距離は高々 $M(n-1)$であることから $\tilde{O}(Mn \times n^{\omega})$  になりました！！

めでたしめでたし…

**とはなりません．**よく見比べてみると $\tilde{O}(Mn^{\omega+1})$ は $\tilde{O}(n^3)$ よりも遅いですね．

ということで，ここからが本題です．

今回は，これを $\tilde{O}(Mn^{\omega})$ 時間で計算する方法についてのお話です．


## $\tilde{O}(Mn^\omega)$ 時間のアルゴリズム

以下の論文に書かれているアルゴリズムについてまとめます．

- 参考：[Shoshan and Zwick[FOCS’99]](https://dl.acm.org/doi/10.5555/795665.796471)

上記の論文の主結果は，以下になります．

<div class="theorem-block" data-type="theorem" markdown="1">
<div class="theorem-title">Theorem</div>


$n$ 頂点の重み無し無向グラフに対するAPSPは， $O(\log n)$ 回のBoolean Matrix Multiplicationを行うことで計算可能である．このとき，全体の時間計算量は $\tilde{O}(n^\omega)$ となる．


</div>

<div class="theorem-block" data-type="theorem" markdown="1">
<div class="theorem-title">Theorem</div>


$n$ 頂点の $[-M, M]$ の整数重み付き無向グラフに対するAPSPは， $O(\log Mn)$ 回の Matrix Multiplication を行うことで計算可能である．このとき，全体の時間計算量は $\tilde{O}(Mn^\omega)$ となる．


</div>

- Boolean Matrix Multiplicationとは？
    
    各要素が0 or 1の(or, and)-MMを表します．(+, ×)-MMを実行することで解くことができ，時間計算量は $\tilde{O}(n^\omega)$ となります．
    

まずは，重み無し無向グラフに対するアルゴリズム → 重み付き無向グラフの順でアルゴリズムの説明をします．

### 用語の定義

- $A$ : 入力グラフの隣接行列
- $\Delta$ : 入力グラフにおける距離行列（すなわち，今回求めたい答え）

### 重み無し無向グラフに対するアルゴリズム

$\ell = \lfloor \log n \rfloor$ とします．最終的なゴールは以下の条件を満たす $\ell+1$ 個 $n \times n$ Boolean Matrix $C^0, C^1, \dots, C^\ell$ を構築することです．

$$
C_{i, j}^k = 
\begin{cases}
1 \quad (0 \le \Delta_{i, j} \bmod 2^{k+1} < 2^k) \\
0 \quad (2^k \le \Delta_{i, j} \bmod 2^k < 2^{k+1})
\end{cases}
$$


上記の各行列 $C^k$ は， $\Delta_{i, j}$ の (2進表記で) $k$ bit 目が立っているかを表してます． したがって，以下の式が成立するため復元することが出来ます．

<div class="theorem-block" data-type="claim" markdown="1">
<div class="theorem-title">Claim</div>


任意の $1 \le i, j \le n$ に対して，以下が成立する．

$$
\Delta_{i, j} = \sum_{k = 0}^\ell 2^k \cdot (1-C^k_{i, j})
$$


</div>

この $C$ を計算するために，別で 5つの行列 $A, B, D, P, Q$ を定義します． $C$ と同様にそれぞれ $\ell+1$ 個存在するため，各 $0 \le k < \ell$ に対して， $A^k, B^k, D^k, P^k, Q^k$ と表します．また，それぞれの定義は以下になります．


$$
A_{i, j}^k = 
\begin{cases}
1 \quad (0 \le \Delta_{i, j} < 2^k) \\
0 \quad (2^k \le \Delta_{i, j})
\end{cases}
$$

$$
B_{i, j}^k = 
\begin{cases}
1 \quad (0 \le \Delta_{i, j} \le 2^k) \\
0 \quad (2^k < \Delta_{i, j})
\end{cases}
$$

$$
D_{i, j}^k = 
\begin{cases}
1 \quad (0 \le \Delta_{i, j} \bmod 2^{k+1} \le 2^k) \\
0 \quad (2^k < \Delta_{i, j} \bmod 2^{k+1} < 2^{k+1})
\end{cases}
$$

$$
P_{i, j}^k = 
\begin{cases}
1 \quad (\Delta_{i, j} \bmod 2^{k+1} = 0) \\
0 \quad (\Delta_{i, j} \bmod 2^{k+1} \neq 0)
\end{cases}
$$

$$
Q_{i, j}^k = 
\begin{cases}
1 \quad (\Delta_{i, j} \bmod 2^{k+1} = 2^k) \\
0 \quad (\Delta_{i, j} \bmod 2^{k+1} \neq 2^k)
\end{cases}
$$

これらの $A, B, C, D, P, Q$ はそれぞれいい感じに組み合わせることで計算することが出来るようになっています．先にそれぞれを計算するアルゴリズムについて述べた後，正当性について確認します．

まず， $A, B$ を計算します．これはトップダウンに計算することができます．

- **各演算の説明**
    
    $X \cdot Y$ : Boolean Matrix Multiplication 
    
    $X \land Y$ : 各要素のand
    
    $X \lor Y$ : 各要素のor
    
    $\lnot X$ : 各要素のnot
    

<div class="theorem-block" data-type="algorithm" markdown="1">
<div class="theorem-title">Algorithm</div>


**$A, B$ の計算**

**入力** : $n \times n$ の隣接行列 $A \in \{0, 1\}^{n \times n}$

**出力** : $2(\ell+1)$ 個の $n \times n$ Boolean Matrix $A_0, \dots, A_{\ell-1}, B_0, \dots, B_{\ell-1} \in \{0, 1\}^{n \times n}$

- Init： $A^0 \gets I, B^0 \gets A \lor I$
- for $i = 1, 2, \dots, \ell$
    - $A^k \gets A^{k-1} \cdot B^{k-1}$
    - $B^k \gets B^{k-1} \cdot B^{k-1}$

</div>

<details class="proof-block" markdown="1">
<summary class="proof-title">Proof</summary>
<div class="proof-body" markdown="1">

- Algorithm2で $A, B$ が計算できることの Proof Sketch
    
    $A^k_{i, j}$ では以下の値を計算している．
    
    $$
    A^k_{i, j} = \bigvee_{k' = 1, 2, \dots, n} A^{k-1}_{i, k'} \land B^{k-1}_{k', j}
    $$
    
    これはすなわち，頂点 $i$ から 頂点 $k’$ への長さ $2^k-1$ 未満のパスが存在するかつ頂点 $k’$ から頂点 $j$ への長さ $2^k$ へのパスが存在するかという演算を表している．
    
    $B$ についても同様

</div>
</details>

次に， $C(, D, P, Q)$ を計算します．これは，ボトムアップに計算することができます．

<div class="theorem-block" data-type="algorithm" markdown="1">
<div class="theorem-title">Algorithm</div>


**$C(, D, P, Q)$ の計算**

**入力** : $n \times n$ の行列 $A, B \in \{0, 1\}^{n \times n}$

**出力** : $\ell+1$ 個の $n \times n$ Boolean Matrix $C_0, \dots, C_{\ell}\in \{0, 1\}^{n \times n}$

- Init： $C_\ell \gets {\bf 1}, D_\ell \gets {\bf1}, P_\ell \gets I, Q_\ell \gets {\bf 0}$
- For $i = \ell-1, \dots, 0$
    - $C^k \gets ((P^{k+1} \cdot A^k) \land C^{k+1}) \lor ((Q^{k+1} \cdot A^k) \land \lnot C^{k+1})$
    - $D^k \gets ((P^{k+1} \cdot B^k) \land C^{k+1}) \lor ((Q^{k+1} \cdot B^k) \land \lnot C^{k+1})$
    - $P^k \gets P^{k+1} \lor Q^{k+1}$
    - $Q^k \gets D^k \land \lnot C^k$

</div>

<details class="proof-block" markdown="1">
<summary class="proof-title">Proof</summary>
<div class="proof-body" markdown="1">

- $P, Q$ が計算できることのProof Sketch
    
    $P^k$ について…
    
    任意の整数 $m$ について，以下が成立することから正しい．
    
    $$
    m \bmod 2^{k+1} = 0 \Leftrightarrow m \bmod 2^{k+2} = 0 \text{ or } 2^{k+1}
    $$
    
    $Q^k$ について…
    
    任意の整数 $m$ について， 以下が成立することから正しい．
    
    $$
    m \bmod 2^{k+1} = 2^k \Leftrightarrow (0 \le m \bmod 2^{k+1} \le 2^k) \land \lnot (0 \le m \bmod 2^{k+1} < 2^k)  
    $$

</div>
</details>

$C, D$ が成立することはかなり非自明です． $C, D$ の証明方法はほとんど同じなため，今回は $C$ のみ示します．

論文では，以下の（論文中の）補題2.1&2.2を経由して解いています．今回は，一般化せず以下が成立することだけを示します．

<div class="theorem-block" data-type="lemma" markdown="1">
<div class="theorem-title">Lemma</div>


$P^{k+1} \cdot A^k$ の $(i, j)$ 成分を $\delta_{i, j}$ とする．任意の $i, j$ に対して以下の2つが成立する．

1. $0 \le \Delta_{i, j} \bmod 2^{k+2} < 2^k \Rightarrow \delta_{i, j} = 1$
2. $\delta_{i, j} = 1 \Rightarrow -2^{k} < \Delta_{i, j} \bmod 2^{k+2} < 2^k$

</div>

<details class="proof-block" markdown="1">
<summary class="proof-title">Proof</summary>
<div class="proof-body" markdown="1">

    
    **1の証明**
    
    $0 \le \Delta_{i, j} \bmod 2^{k+2} < 2^k$ より， $i$ - $j$ 間の適当な最短パス中で $i$ から 長さ $2^{k+2} \times \lfloor \frac{\Delta_{i, j}}{2^{k+2}} \rfloor$ の地点に存在する頂点を $k’$ とする．このとき，明らかに $P^{k+1}_{i, k'} = 1$ かつ $A^k_{k’, j} = 1$ である．したがって， $\delta_{i, j} = 1$ となる．
    
    **2の証明**
    
    $\delta_{i, j} = 1$ より， ある $k’$ が存在して $\Delta_{i, k’} \bmod 2^{k+2} = 0$ かつ $\Delta_{k’, j} < 2^k$ が成り立つ．
    
    また，**無向グラフ**においては3点間の三角不等式が成立し，以下が成り立つ．
    
    $$
    |\Delta_{i, k'} - \Delta_{k', j}| \le \Delta_{i, j} \le \Delta_{i, k'} + \Delta_{k', j}
    $$
    
    よって，2が成立する．
    

</div>
</details>

上記の補題により，以下の系が容易に導けます．

<div class="theorem-block" data-type="corollary" markdown="1">
<div class="theorem-title">Corollary</div>


$(P^{k+1} \cdot A^k) \land C^{k+1}$ の $(i, j)$ 成分を $\delta_{i, j}$ とする．任意の $i, j$ に対して以下が成立する．

$$
0 \le \Delta_{i, j} \bmod 2^{k+2} < 2^k \Leftrightarrow \delta_{i, j} = 1
$$


</div>

同じ議論をすると，以下の系も容易に導けます．

<div class="theorem-block" data-type="corollary" markdown="1">
<div class="theorem-title">Corollary</div>


$(Q^{k+1} \cdot A^k) \land \lnot C^{k+1}$ の $(i, j)$ 成分を $\delta_{i, j}$ とする．任意の $i, j$ に対して以下が成立する．

$$
2^{k+1} \le \Delta_{i, j} \bmod 2^{k+2} < 2^{k+1} + 2^k \Leftrightarrow \delta_{i, j} = 1
$$


</div>

上記の2つの系により $C^k$ が正しく計算できていることが証明できます． 

$Q^k$ についても同様に議論することで，Algorithm2が正しいことが証明できます．

### 重み付き無向グラフに対するアルゴリズム

**TODO:いつかまとめる**
