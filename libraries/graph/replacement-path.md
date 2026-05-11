---
title: Replacement Path
heading: Replacement Path
breadcrumb: Library / Graph / Shortest Path / Replacement Path
summary: 最短経路上の各辺を除いたときの s-t 最短経路長を求めます。
category: graph
subcategory: shortest-path
library_path: umilib/graph/replacement_path.hpp
---

最短経路上の各辺を1本ずつ除いたとき、それぞれの s-t 最短経路長を求めます。
以下では $n$ を頂点数、$m$ を辺数とします。

## 依存関係

- `umilib/header.hpp`
- `umilib/graph/graph.hpp`
- `umilib/graph/shortest_path_tree.hpp`

## 使い方

```cpp
#include "umilib/graph/replacement_path.hpp"
```

戻り値はどちらのアルゴリズムも同じ形式です。

- `ans[e.id]` — 辺 `e` が最短経路上にあるとき: その辺を除いた s-t 最短経路長（存在しない場合は `INF`）
- `ans[e.id]` — 辺 `e` が最短経路上にないとき: 元の最短経路長 `dist(s, t)`

## malick_mittal_gupta

```cpp
vector<T> replacement_path::malick_mittal_gupta(graph<T>& G, int s, int t)
```

無向グラフの辺置換路を求めます。
内部で Dijkstra を2回（始点 $s$ からと終点 $t$ から）実行し、最短経路木上でのラベリングとスイープによって各辺の置換路を $O((n+m)\log n)$ で求めます。

制約

- `G` は無向グラフ
- 辺重みは非負

計算量

- $O((n + m) \log n)$

## roditty_zwick

```cpp
vector<T> replacement_path::roditty_zwick(graph<T>& G, int s, int t)
```

辺重みを無視した有向グラフ（非重み付きグラフ）の辺置換路を求めます。
$\sqrt{n}$ 間隔のシードを用いた多始点 BFS で短い迂回路を検出し、非経路頂点のランダムサンプリングで長い迂回路を検出します。
確率的アルゴリズムであり、高確率で正しい答えを返します。

制約

- `G` は有向グラフ
- 辺重みは無視される（各辺のホップ数 = 1）

計算量

- $O(m \sqrt{n} \log n)$ 期待

## 使用例

```cpp
#include "umilib/graph/replacement_path.hpp"

int main(){
    // Malick-Mittal-Gupta（無向グラフ）
    graph<long long> G(5);
    G.add_edge(0, 1, 2);
    G.add_edge(1, 2, 3);
    G.add_edge(2, 3, 1);
    G.add_edge(3, 4, 4);
    G.add_edge(0, 3, 10);

    auto ans = replacement_path::malick_mittal_gupta(G, 0, 4);
    // ans[e.id]: 最短経路上の各辺を除いたときの 0-4 最短路長

    for(int i = 0; i < G.edge_size(); i++){
        auto e = G.get_edge(i);
        cout << e.from << "->" << e.to << ": " << ans[i] << "\n";
    }

    // Roditty-Zwick（有向グラフ、非重み付き）
    graph<int> H(4, true);
    H.add_edge(0, 1);
    H.add_edge(1, 2);
    H.add_edge(2, 3);
    H.add_edge(0, 2);

    auto ans2 = replacement_path::roditty_zwick(H, 0, 3);
    for(int i = 0; i < H.edge_size(); i++){
        auto e = H.get_edge(i);
        cout << e.from << "->" << e.to << ": " << ans2[i] << "\n";
    }
}
```
