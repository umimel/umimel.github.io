---
title: Three Cycles
heading: Three Cycles
breadcrumb: Library / Graph / Cycle / Three Cycles
summary: 無向グラフに含まれる $C_3$ を数える、列挙する、重み最小・最大のものを探す関数群です。
category: graph
subcategory: cycle
library_path: umilib/graph/three_cycles.hpp
---

無向グラフに含まれる $C_3$ を扱う関数群です。
以下では $n$ を頂点数、$m$ を辺数、$T$ を出力される $C_3$ の個数とします。

## 依存関係

- `umilib/header.hpp`
- `umilib/graph/graph.hpp`

## 使い方

```cpp
#include "umilib/graph/three_cycles.hpp"
```

## count_3cycles

```cpp
long long count_3cycles(graph<S>& G)
```

$G$ に含まれる $C_3$ の個数を返します。

制約

- `G` は無向グラフ

計算量

- $O\left(\sum_{(u,v)\in E}\min(\deg(u), \deg(v))\right)$

## enumerate_3cycles

```cpp
vector<array<edge<S>, 3>> enumerate_3cycles(graph<S>& G)
```

$G$ に含まれるすべての $C_3$ を返します。
各 $C_3$ は $3$ 本の辺の配列として返されます。

制約

- `G` は無向グラフ

計算量

- $O\left(\sum_{(u,v)\in E}\min(\deg(u), \deg(v)) + T\right)$

## find_3cycle

```cpp
array<edge<S>, 3> find_3cycle(graph<S>& G)
```

$G$ に含まれる $C_3$ を $1$ つ返します。
存在しない場合は空の `array` を返します。

制約

- `G` は無向グラフ

計算量

- $O\left(\sum_{(u,v)\in E}\min(\deg(u), \deg(v))\right)$

## find_min_3cycle

```cpp
array<edge<S>, 3> find_min_3cycle(graph<S>& G)
```

$G$ に含まれる $C_3$ のうち、辺重みの総和が最小のものを返します。
存在しない場合は空の `array` を返します。

制約

- `G` は無向グラフ

計算量

- $O\left(\sum_{(u,v)\in E}\min(\deg(u), \deg(v)) + T\right)$

## find_max_3cycle

```cpp
array<edge<S>, 3> find_max_3cycle(graph<S>& G)
```

$G$ に含まれる $C_3$ のうち、辺重みの総和が最大のものを返します。
存在しない場合は空の `array` を返します。

制約

- `G` は無向グラフ

計算量

- $O\left(\sum_{(u,v)\in E}\min(\deg(u), \deg(v)) + T\right)$

## 使用例

```cpp
#include "umilib/graph/three_cycles.hpp"

int main(){
    graph<int> G(3);
    G.add_edge(0, 1, 2);
    G.add_edge(1, 2, 3);
    G.add_edge(2, 0, 4);

    cout << count_3cycles(G) << '\n';
    auto cycle = find_min_3cycle(G);
}
```
