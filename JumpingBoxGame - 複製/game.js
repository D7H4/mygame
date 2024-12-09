const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 遊戲相關屬性
let game = {
    width: 2000,
    height: canvas.height,
    offsetX: 0,
    speed: 5,
};

// Mario 屬性
let mario = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 70,
    velocityY: 0,
    gravity: 0.5,
    jumpCount: 0,
    maxJumps: 1,  // 限制最多跳一次
    isJumping: false,
    direction: "right",
    frameIndex: 0,
    frameRate: 5,
    frameCounter: 0,
    runRightFrames: [
        "mario_run_right_1.png",
        "mario_run_right_2.png",
        "mario_run_right_3.png",
    ],
    runLeftFrames: [
        "mario_run_left_1.png",
        "mario_run_left_2.png",
        "mario_run_left_3.png",
    ],
    idleImage: "mario_idle.png",
    jumpImage: "mario_jump.png",
};

// Mario 當前顯示的圖片
let marioImage = new Image();
marioImage.src = mario.idleImage;

// 畫布大小改變時自適應
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (canvas.width > canvas.height) {
        canvas.width = canvas.height * 0.6; // 保持直向
    }
    mario.x = canvas.width / 2 - mario.width / 2;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// 更新 Mario 動畫幀
function updateMarioFrame() {
    mario.frameCounter++;
    if (mario.frameCounter >= mario.frameRate) {
        mario.frameCounter = 0;
        mario.frameIndex = (mario.frameIndex + 1) % mario.runRightFrames.length;
    }
}

// 更新畫面
function update() {
    mario.velocityY += mario.gravity;
    mario.y += mario.velocityY;

    if (mario.y + mario.height > canvas.height) {
        mario.y = canvas.height - mario.height;
        mario.velocityY = 0;
        mario.jumpCount = 0;
        mario.isJumping = false;
    }

    // 更新場景偏移
    if (game.offsetX + canvas.width < game.width && mario.direction === "right") {
        game.offsetX += game.speed;
    } else if (game.offsetX > 0 && mario.direction === "left") {
        game.offsetX -= game.speed;
    }

    // 清空畫布並填充背景
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (mario.isJumping) {
        marioImage.src = mario.jumpImage;
    } else if (mario.direction === "right") {
        marioImage.src = mario.runRightFrames[mario.frameIndex];
        updateMarioFrame();
    } else if (mario.direction === "left") {
        marioImage.src = mario.runLeftFrames[mario.frameIndex];
        updateMarioFrame();
    } else {
        marioImage.src = mario.idleImage;
    }

    ctx.drawImage(marioImage, mario.x, mario.y, mario.width, mario.height);

    requestAnimationFrame(update);
}

// 手指觸摸開始時
document.addEventListener("touchstart", (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    if (touchX < canvas.width / 2) {
        mario.direction = "left";
    } else {
        mario.direction = "right";
    }

    if (touchY < canvas.height / 2 && mario.jumpCount < mario.maxJumps) {
        mario.velocityY = -10;
        mario.jumpCount++;
        mario.isJumping = true;
    }
});

// 手指觸摸結束時
document.addEventListener("touchend", () => {
    mario.direction = "idle";
});

// 開始遊戲循環
update();
