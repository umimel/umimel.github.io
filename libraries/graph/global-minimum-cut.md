---
title: Global Minimum Cut
heading: Global Minimum Cut
breadcrumb: Library / Graph / Flow & Cut / Global Minimum Cut
summary: Stoer-Wagner algorithm により、無向重み付きグラフの global minimum cut の重みを求めます。
category: graph
subcategory: flow
library_path: umilib/graph/global_minimum_cut.hpp
---

無向重み付きグラフの global minimum cut の重みを求めます。
実装は Stoer-Wagner algorithm です。
以下では $n$ を頂点数、$m$ を辺数とします。

## 依存関係

- `umilib/header.hpp`
- `umilib/graph/graph.hpp`

## 使い方

```cpp
#include "umilib/graph/global_minimum_cut.hpp"
```

## stoer_wagner

```cpp
T stoer_wagner(graph<T>& G)
```

$G$ の global minimum cut の重みを返します。
多重辺は同じ頂点対の辺重みを足し合わせて扱います。

制約

- `G` は無向グラフ
- $n \geq 2$
- 辺重みは非負

計算量

- $O(nm \log n)$

## 使用例

```cpp
#include "umilib/graph/global_minimum_cut.hpp"

int main(){
    graph<long long> G(4);
    G.add_edge(0, 1, 3);
    G.add_edge(1, 2, 2);
    G.add_edge(2, 3, 4);
    G.add_edge(3, 0, 1);
    G.add_edge(0, 2, 5);

    cout << stoer_wagner(G) << '\n';
}
```
