---
title: Recognition
heading: Recognition
breadcrumb: Library / Graph / Recognition
summary: グラフが特定の性質を満たすか判定する関数群です。
category: graph
subcategory: recognition
library_path: umilib/graph/recognition.hpp
---

グラフが連結、木、DAG、二部グラフなどの性質を満たすかを判定する関数群です。
すべて `umilib/graph/recognition.hpp` にまとめています。
以下では $n$ を頂点数、$m$ を辺数とします。

## 依存関係

- `umilib/header.hpp`
- `umilib/graph/graph.hpp`

## 使い方

```cpp
#include "umilib/graph/recognition.hpp"
```

## is_connected

```cpp
bool is_connected(graph<S>& G)
```

$G$ が連結なら `true`、そうでなければ `false` を返します。
空グラフは連結として扱います。

制約

- `G` は無向グラフ

計算量

- $O(n + m)$

## is_tree

```cpp
bool is_tree(graph<S>& G)
```

$G$ が木なら `true`、そうでなければ `false` を返します。

制約

- `G` は無向グラフ

計算量

- $O(n + m)$

## is_forest

```cpp
bool is_forest(graph<S>& G)
```

$G$ が森なら `true`、そうでなければ `false` を返します。

制約

- `G` は無向グラフ

計算量

- $O((n + m)\alpha(n))$

## is_path

```cpp
bool is_path(graph<S>& G)
```

$G$ が単純パスなら `true`、そうでなければ `false` を返します。
頂点数 $0$ のグラフは `true` として扱います。

制約

- `G` は無向グラフ

計算量

- $O(n + m)$

## is_biconnected

```cpp
bool is_biconnected(graph<S>& G)
```

$G$ が二頂点連結なら `true`、そうでなければ `false` を返します。

制約

- `G` は無向グラフ

計算量

- $O(n + m)$

## is_bipartite

```cpp
bool is_bipartite(graph<S>& G)
```

$G$ が二部グラフなら `true`、そうでなければ `false` を返します。

計算量

- $O(n + m)$

## is_dag

```cpp
bool is_dag(graph<S>& G)
```

$G$ が DAG なら `true`、そうでなければ `false` を返します。

制約

- `G` は有向グラフ

計算量

- $O(n + m)$

## is_eulerian

```cpp
bool is_eulerian(graph<S>& G)
```

$G$ がオイラー閉路を持つなら `true`、そうでなければ `false` を返します。
辺が存在しないグラフは `true` として扱います。

計算量

- $O(n + m)$

## is_simple

```cpp
bool is_simple(graph<S>& G)
```

$G$ が自己ループと多重辺を持たないなら `true`、そうでなければ `false` を返します。

計算量

- $O(m \log m)$

## is_complete

```cpp
bool is_complete(graph<S>& G)
```

$G$ が完全グラフなら `true`、そうでなければ `false` を返します。
有向グラフの場合は、相異なる頂点対すべてについて両方向の辺が存在するかを判定します。

計算量

- $O(n + m \log m)$

## is_regular

```cpp
bool is_regular(graph<S>& G)
```

すべての頂点の次数が等しければ `true`、そうでなければ `false` を返します。
有向グラフの場合は出次数を見ます。

計算量

- $O(n)$

## is_transitive

```cpp
bool is_transitive(graph<int>& G)
```

すべての辺 $(u, v)$ と $(v, w)$ について辺 $(u, w)$ が存在するなら `true`、そうでなければ `false` を返します。

制約

- `G` は有向グラフ

計算量

- $O\left(n + \sum_{(u,v) \in E} \mathrm{outdeg}(v)\right)$

## is_cactus

```cpp
bool is_cactus(graph<S>& G)
```

$G$ が cactus graph なら `true`、そうでなければ `false` を返します。
デフォルトでは、各辺が高々 $1$ つの単純閉路に含まれるかを判定します。

制約

- `G` は無向グラフ
- 自己ループを含まない

計算量

- $O((n + m)\log(n + m))$

## is_cactus&lt;false&gt;

```cpp
bool is_cactus<false>(graph<S>& G)
```

各頂点が高々 $1$ つの単純閉路に含まれる、より強い意味での cactus graph かを判定します。

制約

- `G` は無向グラフ
- 自己ループを含まない

計算量

- $O(n + m)$
