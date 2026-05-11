---
title: Minimum Weight Cycle
heading: Minimum Weight Cycle
breadcrumb: Library / Graph / Cycle / Minimum Weight Cycle
summary: 重み付きグラフに含まれる最小重み閉路を求めます。
category: graph
subcategory: cycle
library_path: umilib/graph/min_weight_cycle.hpp
---

重み付きグラフに含まれる最小重み閉路を求めます。
有向グラフ・無向グラフの両方に対応しています。
以下では $n$ を頂点数、$m$ を辺数とします。

## 依存関係

- `umilib/header.hpp`
- `umilib/graph/graph.hpp`
- `umilib/graph/shortest_path_tree.hpp`

## 使い方

```cpp
#include "umilib/graph/min_weight_cycle.hpp"
```

## min_weight_cycle : 1頂点固定

```cpp
edges<S> min_weight_cycle(graph<S>& G, int s)
```

頂点 $s$ を含む閉路のうち、辺重みの総和が最小のものを返します。
存在しない場合は空の `edges<S>` を返します。

制約

- $0 \leq s < n$
- 辺重みは非負

計算量

- $O(m \log n)$

## min_weight_cycle

```cpp
edges<S> min_weight_cycle(graph<S>& G)
```

$G$ に含まれる閉路のうち、辺重みの総和が最小のものを返します。
存在しない場合は空の `edges<S>` を返します。

制約

- 辺重みは非負

計算量

- $O(mn \log n)$

Verification

- [yukicoder No.1320 Two Type Min Cost Cycle](https://yukicoder.me/submissions/1164286)

## 使用例

```cpp
#include "umilib/graph/min_weight_cycle.hpp"

int main(){
    graph<long long> G(4);
    G.add_edge(0, 1, 2);
    G.add_edge(1, 2, 3);
    G.add_edge(2, 0, 4);
    G.add_edge(2, 3, 1);

    auto cycle = find_min_cycle(G);
    long long sum = 0;
    for(auto e : cycle) sum += e.cost;

    cout << sum << '\n';
}
```
