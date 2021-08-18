"use strict";
(() => {
  class ClockDrawer {
    constructor(canvas) {
      // コンストラクタですが、時計を描画する Canvas 要素を切り替えられるように、引数として渡す事にしてあげましょう。

      this.ctx = canvas.getContext("2d");
      this.width = canvas.width;
      this.height = canvas.height;
    }

    draw(angle, func) {
      // 盤面以外の描画ロジック。
      // angle() と描画処理のための関数が渡される。

      this.ctx.save();

      this.ctx.translate(this.width / 2, this.height / 2);
      // 座標空間を時計の中身へ移動

      this.ctx.rotate((Math.PI / 180) * angle);
      // angle をラジアンに変換しつつ rotate させる。

      this.ctx.beginPath();
      // 線を引く処理。

      func(this.ctx);
      // ctx を引数でセット。

      this.ctx.stroke();

      this.ctx.restore();
      // 次のループに映る際に、座標空間を戻すため、 save と restore で囲む。
    }

    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // canvas 全体をクリアする。
    }
  }

  class Clock {
    constructor(drawer) {
      // ClockDrawer のインスタンスを Clock 側で使いたいので、コンストラクタでインスタンスを渡すようにしてあげて、そのインスタンスをプロパティとして持っておきましょう。

      this.r = 100;
      // 時計の半径を定義。

      this.drawer = drawer;
    }

    drawFace() {
      // 盤面の描画処理のみ。

      for (let angle = 0; angle < 360; angle += 6) {
        // for文で0度から360度まで60個の短い目盛りを6度ずつ回転しながら描画。

        this.drawer.draw(angle, (ctx) => {
          // ctx は ClockDrawer() から引数で渡す。

          ctx.moveTo(0, -this.r);
          // 円の中心からマイナス半径分真上に移動。

          if (angle % 30 === 0) {
            ctx.lineWidth = 2;
            ctx.lineTo(0, -this.r + 10);
            // 30度ごとに太く長い目盛りにする。

            ctx.font = "13px Arial";
            ctx.textAlign = "center";
            ctx.fillText(angle / 30 || 12, 0, -this.r + 25);
            // angle を 30 で割った数値を入れる。
            // 0 が false と評価されることを利用して、12字を表示させる。
          } else {
            ctx.lineTo(0, -this.r + 5);
            // 5px 分だけ真下に線を引く。
          }
        });
      }
    }

    drawHands() {
      this.drawer.draw(this.h * 30 + this.m * 0.5, ctx => {
        // 時針の描画処理。
        // 盤面の目盛りと同じく回転させたあとに描画するので、 drawer() の draw() メソッドを使用。
        // draw メソッドには回転角度と ctx を渡しつつ、処理の内容を関数で渡す。
        // angle は 時間 h に 30 度をかけたものに、60 分かけて 30 度進む処理を加える。

        ctx.lineWidth = 6;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 50);
        // 針の描画。
      });

      this.drawer.draw(this.m * 6, ctx => {
        // 分針の描画処理。

        ctx.lineWidth = 4;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 30);
      });

      this.drawer.draw(this.s * 6, ctx => {
        // 秒針の描画処理。

        ctx.lineWidth = 4;
        ctx.strokeStyle = "pink";
        ctx.moveTo(0, 20);
        ctx.lineTo(0, -this.r + 20);
      });
    }

    update() {
      // 現在時刻で時刻を更新。
      this.h = (new Date()).getHours();
      this.m = (new Date()).getMinutes();
      this.s = (new Date()).getSeconds();
    }

    run() {
      this.update();

      this.drawer.clear();
      // 描画する前に、描画したものをクリアする。

      this.drawFace();
      // 時計の盤面を描画するメソッド。

      this.drawHands();
      // 時計の針を描画するメソッド。

      setTimeout(() => {
        this.run();
      }, 100);
      // 時計がリアルタイムで動くように、 setTimeout() を使って run() メソッドを再起的に実行する。
    }
  }

  const canvas = document.querySelector("canvas");
  if (typeof canvas.getContext === "undefined") {
    return;
    // canvas がサポートされていなかったら処理をしない。
    // この return は、関数から抜けて処理を止める為のもの。関数を作らなければいけないので、全体を即時関数で囲う。
  }

  const clock = new Clock(new ClockDrawer(canvas));
  clock.run();
})();
