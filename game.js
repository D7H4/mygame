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
    x: canvas.width / 2 - 25, // 固定在畫布中間
    y: canvas.height - 100,
    width: 50,
    height: 70,
    velocityY: 0,
    gravity: 0.5,
    jumpCount: 0,
    maxJumps: 1,
    isJumping: false,
    direction: "idle", // 初始方向
    frameIndex: 0, // 當前動畫幀索引
    frameRate: 5, // 幀切換速率
    frameCounter: 0,
    runRightFrames: [
        "images/mario_run_right_1.png",
        "images/mario_run_right_2.png",
        "images/mario_run_right_3.png",
    ],
    runLeftFrames: [
        "images/mario_run_left_1.png",
        "images/mario_run_left_2.png",
        "images/mario_run_left_3.png",
    ],
    idleImage: "images/mario_idle.png",
    jumpImage: "images/mario_jump.png",
};

// 用於緩存加載的圖片
const marioImages = {
    runRight: [],
    runLeft: [],
    idle: null,
    jump: null
};

// 加載所有 Mario 圖片
function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

// 加載所有圖片
function preloadImages(callback) {
    let imagesLoaded = 0;
    let totalImages = mario.runRightFrames.length + mario.runLeftFrames.length + 3; // 3 是為了包含 idle 和 jump 圖片

    // 加載 runRight 方向的圖片
    mario.runRightFrames.forEach((src, index) => {
        marioImages.runRight[index] = loadImage(src);
        marioImages.runRight[index].onload = imageLoaded;
        marioImages.runRight[index].onerror = imageError;
    });

    // 加載 runLeft 方向的圖片
    mario.runLeftFrames.forEach((src, index) => {
        marioImages.runLeft[index] = loadImage(src);
        marioImages.runLeft[index].onload = imageLoaded;
        marioImages.runLeft[index].onerror = imageError;
    });

    // 加載 idle 和 jump 圖片
    marioImages.idle = loadImage(mario.idleImage);
    marioImages.idle.onload = imageLoaded;
    marioImages.idle.onerror = imageError;
    marioImages.jump = loadImage(mario.jumpImage);
    marioImages.jump.onload = imageLoaded;
    marioImages.jump.onerror = imageError;

    function imageLoaded() {
        imagesLoaded++;
        console.log(`圖片加載完成: ${imagesLoaded}/${totalImages}`);
        if (imagesLoaded === totalImages) {
            callback(); // 所有圖片加載完成後啟動遊戲
        }
    }

    function imageError() {
        console.error("圖片加載錯誤:", this.src);
    }
}

// 畫布大小改變時自適應
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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

    // 碰到地面時重置跳躍
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

    // 動態切換圖片
    let currentImage;
    if (mario.isJumping) {
        currentImage = marioImages.jump;
    } else if (mario.direction === "right") {
        currentImage = marioImages.runRight[mario.frameIndex];
        updateMarioFrame();
    } else if (mario.direction === "left") {
        currentImage = marioImages.runLeft[mario.frameIndex];
        updateMarioFrame();
    } else {
        currentImage = marioImages.idle;
    }

    // 繪製 Mario
    ctx.drawImage(currentImage, mario.x, mario.y, mario.width, mario.height);

    requestAnimationFrame(update);
}

// 虛擬按鈕事件
document.getElementById("leftBtn").addEventListener("click", () => {
    mario.direction = "left";
});
document.getElementById("rightBtn").addEventListener("click", () => {
    mario.direction = "right";
});
document.getElementById("jumpBtn").addEventListener("click", () => {
    if (mario.jumpCount < mario.maxJumps) {
        mario.velocityY = -10;
        mario.jumpCount++;
        mario.isJumping = true;
    }
});

// 開始遊戲
preloadImages(() => {
    update(); // 當所有圖片加載完成後開始遊戲循環
});
