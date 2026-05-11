---
title: Breadth First Search
heading: Breadth First Search
breadcrumb: Library / Graph / Shortest Path / Breadth First Search
summary: BFS およびその派生アルゴリズムにより最短距離を求めます。
category: graph
subcategory: shortest-path
library_path: umilib/graph/breadth_first_search.hpp
---

BFS およびその派生アルゴリズムにより最短距離を求めます。
以下では $n$ を頂点数、$m$ を辺数とします。

## 依存関係

- `umilib/header.hpp`
- `umilib/graph/graph.hpp`

## 使い方

```cpp
#include "umilib/graph/breadth_first_search.hpp"
```

## bfs

```cpp
vector<T> bfs(graph<T>& G, int s)
```

頂点 $s$ を始点とする BFS を行い、各頂点への最短距離（辺数）を返します。
到達不可能な頂点の距離は `-1` です。
辺の `cost` フィールドは無視されます。

計算量

- $O(n + m)$

## binary_bfs

```cpp
vector<T> binary_bfs(graph<T>& G, int s)
```

辺重みが $0$ または $1$ のグラフに対して、頂点 $s$ を始点とする最短距離を返します。
0-1 BFS（deque を用いた BFS）で実装されています。
到達不可能な頂点の距離は `-1` です。

制約

- 辺重みは $0$ または $1$

計算量

- $O(n + m)$

## constant_bfs

```cpp
vector<T> constant_bfs(graph<T>& G, int s, T W)
```

辺重みが $0$ 以上 $W$ 以下の整数のグラフに対して、頂点 $s$ を始点とする最短距離を返します。
到達不可能な頂点の距離は `-1` です。

制約

- 辺重みは $0$ 以上 $W$ 以下の整数

計算量

- $O(nW + m)$

## complement_bfs

```cpp
vector<T> complement_bfs(graph<T>& G, int s)
```

$G$ の補グラフ上で頂点 $s$ を始点とする BFS を行い、各頂点への最短距離（辺数）を返します。
到達不可能な頂点の距離は `-1` です。

計算量

- $O((n + m) \log m)$

## 使用例

```cpp
#include "umilib/graph/breadth_first_search.hpp"

int main(){
    // bfs（辺重み無視）
    graph<int> G(4);
    G.add_edge(0, 1);
    G.add_edge(1, 2);
    G.add_edge(2, 3);
    G.add_edge(0, 3);

    auto d = bfs(G, 0);
    cout << d[3] << '\n'; // 1

    // binary_bfs（辺重み 0/1）
    graph<int> H(3, true);
    H.add_edge(0, 1, 0);
    H.add_edge(1, 2, 1);
    H.add_edge(0, 2, 1);

    auto d2 = binary_bfs(H, 0);
    cout << d2[2] << '\n'; // 1

    // complement_bfs
    graph<int> C(4);
    C.add_edge(0, 1);
    C.add_edge(0, 2);
    // 補グラフでの距離
    auto d3 = complement_bfs(C, 0);
    cout << d3[3] << '\n'; // 1
}
```
