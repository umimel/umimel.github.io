---
title: Undo Union Find
heading: Undo Union Find
breadcrumb: Library / Data Structure / Undo Union Find
summary: 直前の併合操作を取り消せる Union Find です。
category: datastructure
library_path: umilib/datastructure/undo_union_find.hpp
---

Undo Union Find は、Union Find に `undo` 操作を追加したデータ構造です。
集合の併合、連結判定、集合サイズ取得に加えて、直前の `unite` を取り消すことができます。

`undo` を高速に行うため、通常の経路圧縮は使いません。
代わりに union by size のみで木の高さを抑えます。

## 依存関係

- `umilib/header.hpp`

## コンストラクタ

```cpp
undo_union_find uf(int n)
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

- $O(\log n)$

## unite

```cpp
void uf.unite(int x, int y)
```

$x$ が属する集合と $y$ が属する集合を併合します。

制約

- $0 \leq x < n$
- $0 \leq y < n$

計算量

- $O(\log n)$

## same

```cpp
bool uf.same(int x, int y)
```

$x$ と $y$ が同じ集合に属するかを返します。

制約

- $0 \leq x < n$
- $0 \leq y < n$

計算量

- $O(\log n)$

## size

```cpp
int uf.size(int x)
```

$x$ が属する集合のサイズを返します。

制約

- $0 \leq x < n$

計算量

- $O(\log n)$

## undo

```cpp
void uf.undo()
```

直前の `unite` 操作を取り消します。

制約

- 取り消していない `unite` 操作が $1$ 回以上存在する

計算量

- $O(1)$

## 使用例

```cpp
#include "umilib/datastructure/undo_union_find.hpp"

int main(){
    undo_union_find uf(3);

    uf.unite(0, 1);
    cout << uf.same(0, 1) << '\n'; // 1

    uf.unite(1, 2);
    cout << uf.size(0) << '\n'; // 3

    uf.undo();
    cout << uf.same(0, 2) << '\n'; // 0
}
```
