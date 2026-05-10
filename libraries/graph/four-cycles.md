---
title: Four Cycles
heading: Four Cycles
breadcrumb: Library / Graph / Cycle / Four Cycles
summary: 無向グラフに含まれる $C_4$ を数える、列挙する、重み最小・最大のものを探す関数群です。
category: graph
subcategory: cycle
library_path: umilib/graph/four_cycles.hpp
---

無向グラフに含まれる $C_4$ を扱う関数群です。
以下では $n$ を頂点数、$m$ を辺数、$T$ を出力される $C_4$ の個数とします。

## 依存関係

- `umilib/header.hpp`
- `umilib/graph/graph.hpp`

## 使い方

```cpp
#include "umilib/graph/four_cycles.hpp"
```

## count_4cycles

```cpp
long long count_4cycles(graph<S>& G)
```

$G$ に含まれる $C_4$ の個数を返します。

制約

- `G` は無向グラフ

計算量

- $O(n^4 + T)$

## enumerate_4cycles

```cpp
vector<array<edge<S>, 4>> enumerate_4cycles(graph<S>& G)
```

$G$ に含まれるすべての $C_4$ を返します。
各 $C_4$ は $4$ 本の辺の配列として返されます。

制約

- `G` は無向グラフ

計算量

- $O(n^4 + T)$

## find_4cycle

```cpp
array<edge<S>, 4> find_4cycle(graph<S>& G)
```

$G$ に含まれる $C_4$ を $1$ つ返します。
存在しない場合は空の `array` を返します。

制約

- `G` は無向グラフ

計算量

- $O(n^4)$

## find_min_4cycle

```cpp
array<edge<S>, 4> find_min_4cycle(graph<S>& G)
```

$G$ に含まれる $C_4$ のうち、辺重みの総和が最小のものを返します。
存在しない場合は空の `array` を返します。

制約

- `G` は無向グラフ

計算量

- $O(n^4 + T)$

## find_max_4cycle

```cpp
array<edge<S>, 4> find_max_4cycle(graph<S>& G)
```

$G$ に含まれる $C_4$ のうち、辺重みの総和が最大のものを返します。
存在しない場合は空の `array` を返します。

制約

- `G` は無向グラフ

計算量

- $O(n^4 + T)$

## 使用例

```cpp
#include "umilib/graph/four_cycles.hpp"

int main(){
    graph<int> G(4);
    G.add_edge(0, 1, 1);
    G.add_edge(1, 2, 1);
    G.add_edge(2, 3, 1);
    G.add_edge(3, 0, 1);

    cout << count_4cycles(G) << '\n';
    auto cycle = find_4cycle(G);
}
```
