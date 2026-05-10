---
title: Union Find
heading: Union Find
breadcrumb: Library / Data Structure / Union Find
summary: 素集合を管理し、連結判定・集合の併合・集合サイズ取得を amortized $O(\alpha(n))$ で行うデータ構造です。
category: datastructure
library_path: umilib/datastructure/union_find.hpp
verified: https://judge.yosupo.jp/problem/unionfind
verified_label: Library Checker - Unionfind
---

Union Find は、互いに素な集合族を管理するデータ構造です。
要素どうしを同じ集合に併合する操作と、$2$ 要素が同じ集合に属するかを判定する操作を amortized $O(\alpha(n))$ 時間で処理できます。

内部的には各集合ごとに代表元を $1$ つ持ちます。
集合が併合されるとき、新しい代表元は併合前の代表元のどちらかになります。

## 依存関係

- `umilib/header.hpp`

## コンストラクタ

```cpp
union_find uf(int n)
```

- $n$ 個の集合 $\{0\}, \{1\}, \ldots, \{n-1\}$ を作ります。

制約

- $0 \leq n$

計算量

- $O(n)$

## root

```cpp
int uf.root(int x)
```

$x$ が属する集合の代表元を返します。

制約

- $0 \leq x < n$

計算量

- amortized $O(\alpha(n))$

## unite

```cpp
void uf.unite(int x, int y)
```

$x$ が属する集合と $y$ が属する集合を併合します。
すでに同じ集合に属している場合は何もしません。

制約

- $0 \leq x < n$
- $0 \leq y < n$

計算量

- amortized $O(\alpha(n))$

## same

```cpp
bool uf.same(int x, int y)
```

$x$ と $y$ が同じ集合に属するかを返します。

制約

- $0 \leq x < n$
- $0 \leq y < n$

計算量

- amortized $O(\alpha(n))$

## size

```cpp
int uf.size(int x)
```

$x$ が属する集合のサイズを返します。

制約

- $0 \leq x < n$

計算量

- amortized $O(\alpha(n))$

## 使用例

```cpp
#include "umilib/datastructure/union_find.hpp"

int main(){
    int n, q;
    cin >> n >> q;

    union_find uf(n);
    while(q--){
        int t, u, v;
        cin >> t >> u >> v;
        if(t == 0){
            uf.unite(u, v);
        }else{
            cout << uf.same(u, v) << '\n';
        }
    }
}
```

## Verify

- [Library Checker - Unionfind](https://judge.yosupo.jp/problem/unionfind)
