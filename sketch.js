let capture;
let handpose;
let predictions = [];
let ball = { x: 0, y: 0, radius: 30 }; // 球的初始位置和大小

function setup() {
  createCanvas(windowWidth, windowHeight); // 全螢幕畫布
  background('#edede9'); // 設定背景顏色

  // 設定攝影機
  capture = createCapture(VIDEO);
  capture.size(windowWidth * 0.8, windowHeight * 0.8);
  capture.hide();

  // 初始化 Handpose 模型
  handpose = ml5.handpose(capture, () => {
    console.log('Handpose model loaded');
  });

  // 偵測手部位置
  handpose.on('predict', (results) => {
    predictions = results;
  });

  ball.x = width / 2; // 球的初始位置在畫布中央
  ball.y = height / 2;
}

function draw() {
  background('#edede9'); // 確保背景顏色持續更新
  image(capture, (width - capture.width) / 2, (height - capture.height) / 2); // 顯示攝影機影像

  // 繪製球
  fill('#ff6f61');
  noStroke();
  ellipse(ball.x, ball.y, ball.radius * 2);

  // 如果有手部偵測結果
  if (predictions.length > 0) {
    let hand = predictions[0]; // 取第一隻手
    let indexFinger = hand.landmarks[8]; // 取食指尖端座標

    // 將食指座標轉換到畫布座標
    let fingerX = map(indexFinger[0], 0, capture.width, 0, width);
    let fingerY = map(indexFinger[1], 0, capture.height, 0, height);

    // 繪製繩子
    stroke('#000');
    strokeWeight(2);
    line(fingerX, fingerY, ball.x, ball.y);

    // 更新球的位置，使其跟隨食指
    ball.x += (fingerX - ball.x) * 0.1; // 平滑移動效果
    ball.y += (fingerY - ball.y) * 0.1;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時，調整畫布大小
}
