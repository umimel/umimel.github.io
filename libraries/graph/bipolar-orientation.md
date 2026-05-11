---
title: Bipolar Orientation
heading: Bipolar Orientation
breadcrumb: Library / Graph / Orientation / Bipolar Orientation
summary: 無向グラフと2頂点 $s,t$ に対して、$s$ を唯一の source、$t$ を唯一の sink にする向き付けを求めます。
category: graph
subcategory: orientation
library_path: umilib/graph/bipolar_orientation.hpp
---

無向グラフ $G$ と異なる $2$ 頂点 $s,t$ に対して、$s$ を唯一の source、$t$ を唯一の sink にする向き付けを求めます。
そのような向き付けが存在しない場合は空の `vector` を返します。
以下では $n$ を頂点数、$m$ を辺数とします。

## 依存関係

- `umilib/header.hpp`
- `umilib/graph/graph.hpp`

## 使い方

```cpp
#include "umilib/graph/bipolar_orientation.hpp"
```

## bipolar_orientation

```cpp
vector<bool> bipolar_orientation(graph<S> G, int s, int t)
```

$G$ の各辺を向き付けた結果を返します。
返り値を `orient` とすると、辺 `G.get_edge(i)` に対して次の意味になります。

- `orient[i] == false`: `edge.from` から `edge.to` へ向ける
- `orient[i] == true`: `edge.to` から `edge.from` へ向ける

向き付けが存在しない場合は空の `vector` を返します。

制約

- `G` は無向グラフ
- $2 \leq n$
- $1 \leq m$
- $0 \leq s,t < n$
- $s \neq t$

計算量

- $O(n + m)$

## 使用例

```cpp
#include "umilib/graph/bipolar_orientation.hpp"

int main(){
    graph<int> G(4);
    G.add_edge(0, 1);
    G.add_edge(1, 2);
    G.add_edge(2, 3);
    G.add_edge(0, 3);

    auto orient = bipolar_orientation(G, 0, 3);
    if(orient.empty()){
        cout << "No orientation\n";
        return 0;
    }

    for(int i=0; i<G.edge_size(); i++){
        auto e = G.get_edge(i);
        if(orient[i]) swap(e.from, e.to);
        cout << e.from << ' ' << e.to << '\n';
    }
}
```
