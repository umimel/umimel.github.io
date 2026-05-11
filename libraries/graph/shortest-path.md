---
title: Shortest Path
heading: Shortest Path
breadcrumb: Library / Graph / Shortest Path / Shortest Path
summary: 単一始点・全頂点対の最短経路を求めます。
category: graph
subcategory: shortest-path
library_path: umilib/graph/shortest_path.hpp
---

単一始点または全頂点対の最短経路を求めます。
以下では $n$ を頂点数、$m$ を辺数とします。

## 依存関係

- `umilib/header.hpp`
- `umilib/graph/graph.hpp`

## 使い方

```cpp
#include "umilib/graph/shortest_path.hpp"
```

## dijkstra

```cpp
vector<T> dijkstra(graph<T>& G, int s)
```

頂点 $s$ を始点とする単一始点最短経路を返します。
到達不可能な頂点の距離は `numeric_limits<T>::max()/3` です。

制約

- 辺重みは非負

計算量

- $O(m \log n)$

## bellman_ford

```cpp
vector<T> bellman_ford(graph<T>& G, int s)
```

頂点 $s$ を始点とする単一始点最短経路を返します。
負のサイクルの影響を受ける頂点の距離は `-numeric_limits<T>::max()/3` になります。
到達不可能な頂点の距離は `numeric_limits<T>::max()/3` です。

制約

- 辺重みは実数（負可）

計算量

- $O(nm)$

## warshall_floyd

```cpp
vector<vector<T>> warshall_floyd(graph<T>& G)
```

全頂点対の最短経路を返します。
到達不可能な頂点対の距離は `numeric_limits<T>::max()/3` です。

制約

- 辺重みは実数（負可）

計算量

- $O(n^3)$

## 使用例

```cpp
#include "umilib/graph/shortest_path.hpp"

int main(){
    graph<long long> G(4, true);
    G.add_edge(0, 1, 2);
    G.add_edge(1, 2, 3);
    G.add_edge(0, 2, 10);
    G.add_edge(2, 3, 1);

    // Dijkstra
    auto d = dijkstra(G, 0);
    cout << d[3] << '\n'; // 6

    // Bellman-Ford（負辺あり）
    graph<long long> H(3, true);
    H.add_edge(0, 1, -1);
    H.add_edge(1, 2,  3);
    auto d2 = bellman_ford(H, 0);
    cout << d2[2] << '\n'; // 2

    // Warshall-Floyd（全頂点対）
    auto dist = warshall_floyd(G);
    cout << dist[0][3] << '\n'; // 6
}
```
