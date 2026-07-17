# ST6 TRAINING — Combo Rhythm Lab

Street Fighter 6のコンボ入力を、60fpsタイムライン・クリック音・コントローラー表示で反復練習する静的Webアプリです。

## 主な機能

- Web Audio APIの時刻を基準にした60fpsタイムライン
- WATCH / RHYTHM / CONTROLLERの3モード
- SVG/CSSコントローラーの入力点灯
- 25%・50%・75%・100%の速度変更
- ループ再生とフレーム単位の入力判定
- キーボード、タッチ、Gamepad API対応
- コンボ、推奨フレーム、受付幅の編集
- JSONインポート／エクスポート
- LocalStorageへの保存
- PWA / オフラインキャッシュ
- GitHub Pages自動デプロイ

## 操作

- 方向：矢印キー / WASD
- 弱：J
- 中：K
- 強：L
- 必殺：U
- アシスト：I
- ドライブインパクト：O
- 再生・一時停止：Space

標準Gamepadでは、A=弱、X=中、B=強、Y=必殺、RB=アシスト、LB/LT=DIとして割り当てています。

## フレーム精度について

再生フレームは `AudioContext.currentTime` から毎回算出します。`setInterval(16.67)`でフレームを加算しないため、描画が一時的に落ちても時計そのものは累積ズレしません。

一方、ブラウザで取得する実入力には、コントローラー・Bluetooth・OS・ディスプレイ・ブラウザの遅延が含まれます。また、コンボの成立には発生、ヒットストップ、キャンセル受付、先行入力、距離などが関係します。

そのため、初期プリセットは「練習用の入力位置」として登録し、ゲーム内トレーニングモードで成功を確認した値を編集画面から保存してください。確認済みになったデータは「ゲーム内確認済み」へ変更できます。

## データ形式

```json
{
  "id": "combo-id",
  "title": "コンボ名",
  "category": "BASIC",
  "description": "説明",
  "totalFrames": 60,
  "verified": false,
  "sourceVersion": "2026-05-28",
  "steps": [
    {
      "label": "しゃがみ弱",
      "inputs": ["down", "light"],
      "frame": 0,
      "early": 2,
      "late": 2
    }
  ]
}
```

利用可能な入力名：`up`, `down`, `left`, `right`, `light`, `medium`, `heavy`, `special`, `assist`, `drive`

## 公開

`.github/workflows/pages.yml` が `main` へのpush時に静的ファイルをGitHub Pagesへデプロイします。初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。

## 参考

- [CAPCOM公式 マリーザ フレームデータ](https://www.streetfighter.com/6/ja-jp/character/marisa/frame)
- [CAPCOM公式 マリーザ 技表](https://www.streetfighter.com/6/ja-jp/character/marisa/movelist)
- [MDN Gamepad API](https://developer.mozilla.org/docs/Web/API/Gamepad_API)
- [MDN AudioContext.currentTime](https://developer.mozilla.org/docs/Web/API/BaseAudioContext/currentTime)
