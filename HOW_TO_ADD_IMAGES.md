# 新しいイラストを追加する方法

LP「まったり部屋」に新しいイラストを追加する手順を説明します。

## 1. 画像の準備
追加したい画像を用意し、ファイル名を半角英数字に変更します（例: `cooking.png`）。
推奨サイズ: 横幅 800px 〜 1200px 程度

## 2. 画像の配置
画像を以下のフォルダにコピーします。
`mattari-room/assets/images/`

## 3. index.html の編集
`index.html` をテキストエディタで開き、`<!-- Gallery Section -->` 内の `<div class="gallery-grid">` の中に追加します。
以下のコードをコピーして、適切な場所に貼り付けてください。

```html
<div class="gallery-item" data-image="assets/images/ファイル名.png" data-title="イラストのタイトル">
    <img src="assets/images/ファイル名.png" alt="イラストのタイトル" loading="lazy">
    <div class="overlay">
        <span>View More</span>
    </div>
</div>
```

### 変更箇所
- `ファイル名.png`: 手順1で用意した画像ファイル名に書き換えてください（2箇所あります）。
- `イラストのタイトル`: 画像に表示したいタイトルに書き換えてください（2箇所あります）。

## 例
`cooking.png` という画像を「休日の料理」というタイトルで追加する場合:

```html
<div class="gallery-item" data-image="assets/images/cooking.png" data-title="休日の料理">
    <img src="assets/images/cooking.png" alt="休日の料理" loading="lazy">
    <div class="overlay">
        <span>View More</span>
    </div>
</div>
```

保存してブラウザを更新すると、新しいイラストが追加されます。
