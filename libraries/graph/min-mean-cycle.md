---
title: Min Mean Cycle
heading: Min Mean Cycle
breadcrumb: Library / Graph / Cycle / Min Mean Cycle
summary: 有向グラフに含まれる辺重みの平均が最小のサイクルを求めます。
category: graph
subcategory: cycle
library_path: umilib/graph/min_mean_cycle.hpp
---

有向グラフに含まれる閉路のうち、辺重みの平均が最小のものを求めます。
実装は Karp's algorithm です。
以下では $n$ を頂点数、$m$ を辺数とします。

## 依存関係

- `umilib/header.hpp`
- `umilib/graph/graph.hpp`

## 使い方

```cpp
#include "umilib/graph/min_mean_cycle.hpp"
```

## min_mean_cycle

```cpp
edges<S> min_mean_cycle(graph<S>& G)
```

$G$ に含まれる閉路のうち、辺重みの平均が最小のものを返します。
閉路が存在しない場合は空の `edges<S>` を返します。

**アルゴリズム概要**

仮想ソース（全頂点へコスト $0$ で接続）から「ちょうど $k$ 辺を使う最短距離」$d_k(v)$ を $k=0,\ldots,n$ について計算し、Karp の定理

$$\mu^* = \min_{v} \max_{0 \le k < n} \frac{d_n(v) - d_k(v)}{n - k}$$

により最小平均 $\mu^*$ を求めます。
その後、親ポインタを $n$ 回たどった頂点列から鳩の巣原理により閉路を復元します。

制約

- `G` は有向グラフ
- 辺重みは実数（負可）

計算量

- $O(mn)$

## 使用例

```cpp
#include "umilib/graph/min_mean_cycle.hpp"

int main(){
    graph<long long> G(4, true);
    G.add_edge(0, 1,  3);
    G.add_edge(1, 2,  1);
    G.add_edge(2, 3,  2);
    G.add_edge(3, 1,  0); // 1->2->3->1: mean = (1+2+0)/3

    auto cycle = min_mean_cycle(G);
    if(cycle.empty()){
        // 閉路なし
    } else {
        double mean = 0;
        for(auto e : cycle) mean += e.cost;
        mean /= cycle.size();
        cout << mean << '\n';
    }
}
```
