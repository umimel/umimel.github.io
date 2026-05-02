---
title: 2-apx. APSP - (1)
category: graph-algorithm
category_label: Graph Algorithm
summary: APSPの2-近似について improve があったので勉強メモ
date: 2026-05-02
published: false
tags:
  - shortest paths
  - approximation
  - APSP
---

# 2-apx. APSP - (1)

近年，All Pairs Shortest Paths Problem (APSP) の 2-近似アルゴリズムに進展があったので，そのまとめメモ

## 文献紹介
- Title : Improved 2-Approximate Shortest Paths for close vertex pairs (FOCS'25)
- Author : Manoj Gupta
- 

## 基礎知識

### APSP
APSP は All Pairs Shortest Paths Problem の略であり，古くから様々な研究が行われています．
:::problem APSP

$n$ 頂点 $m$ 辺のグラフが与えられます．

任意の2頂点間の最短距離を出力してください．

:::

上記の問題はかなり曖昧に書いており，例えば重み関数の値域（ $\mathbb{N}, \mathbb{R}, \mathbb{F}, \mathbb{R_{\ge 0}}$ ）や有向or無向など様々な問題設定を考えることができます．

一般的には，負重みが絡むと最短距離=最長距離の問題に帰着されるためNP-困難となります．しかし，入力グラフにnegative cycle が存在しないという仮定をおくと多項式時間で解くことができます．

APSPは様々なアルゴリズムが知られており，[Wikipedia](https://en.wikipedia.org/wiki/Shortest_path_problem) にまとまっているので見てみるとよいです（ここではまとめません）．

有名どころでいうと，Floyd-Warshall Algorithm や Bellman-Ford Algorithm（+ Potential Dijkstra) かなと思います．

### APSP Conjecture

(重み付き) APSP については，$O(n^{3-\epsilon})$ 時間のアルゴリズムは存在するのか？という長年の未解決問題が存在します．これに関して，以下のような予想が（割と）信じられています．

:::conjecture APSP Conjecture

There is no subcubic algorithm for APSP.

:::

