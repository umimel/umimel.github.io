---
title: Minimum Diameter Spanning Tree
heading: Minimum Diameter Spanning Tree
breadcrumb: Library / Graph / Spanning Tree / Minimum Diameter Spanning Tree
summary: 正の重み付き無向グラフの minimum diameter spanning tree を求めます。
category: graph
subcategory: spanning-tree
library_path: umilib/graph/minimum_diameter_spanning_tree.hpp
---

正の重み付き無向グラフ $G$ の minimum diameter spanning tree を求めます。
以下では $n$ を頂点数、$m$ を辺数とします。

## 依存関係

- `umilib/header.hpp`
- `umilib/graph/graph.hpp`
- `umilib/graph/dijkstra.hpp`

## 使い方

```cpp
#include "umilib/graph/minimum_diameter_spanning_tree.hpp"
```

## minimum_diameter_spanning_tree

```cpp
pair<S, edges<S>> minimum_diameter_spanning_tree(graph<S>& G)
```

$G$ の minimum diameter spanning tree を返します。
返り値を `(diam, es)` とすると、`diam` は最小直径、`es` は対応する spanning tree の辺集合です。

制約

- `G` は連結な無向グラフ
- $1 \leq n$
- 辺重みは非負

計算量

- $O(mn \log n)$

Verification

- 

## 使用例

```cpp
#include "umilib/graph/minimum_diameter_spanning_tree.hpp"

int main(){
    graph<long long> G(4);
    G.add_edge(0, 1, 1);
    G.add_edge(1, 2, 2);
    G.add_edge(2, 3, 1);
    G.add_edge(0, 3, 5);

    auto [diam, es] = minimum_diameter_spanning_tree(G);

    cout << diam << '\n';
    for(auto e : es){
        cout << e.from << ' ' << e.to << '\n';
    }
}
```
