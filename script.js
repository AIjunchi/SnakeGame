const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let score = 0;
let snake = [];
let food = { x: 0, y: 0 };
let dx = 0;
let dy = 0;
let gameInterval;
let isGameRunning = false;

// 初始化游戏
function initGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    score = 0;
    dx = 1;
    dy = 0;
    scoreElement.innerText = score;
    createFood();
    if (gameInterval) clearInterval(gameInterval);
    isGameRunning = true;
    startBtn.innerText = '重新开始';
    gameInterval = setInterval(gameLoop, 100);
}

// 游戏主循环
function gameLoop() {
    if (!isGameRunning) return;
    update();
    draw();
}

// 更新游戏状态
function update() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // 检查碰撞墙壁
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver();
        return;
    }

    // 检查碰撞自己
    for (let i = 0; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // 检查吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.innerText = score;
        createFood();
    } else {
        snake.pop();
    }
}

// 绘制游戏画面
function draw() {
    // 清空画布
    ctx.fillStyle = '#ecf0f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇
    ctx.fillStyle = '#2ecc71';
    snake.forEach((part, index) => {
        // 蛇头颜色稍深
        if (index === 0) ctx.fillStyle = '#27ae60';
        else ctx.fillStyle = '#2ecc71';
        
        ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // 绘制食物
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// 生成食物
function createFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
    };
    // 确保食物不生成在蛇身上
    snake.forEach(part => {
        if (part.x === food.x && part.y === food.y) {
            createFood();
        }
    });
}

// 游戏结束
function gameOver() {
    isGameRunning = false;
    clearInterval(gameInterval);
    alert(`游戏结束! 你的得分是: ${score}`);
    startBtn.innerText = '开始游戏';
}

// 键盘控制
document.addEventListener('keydown', (event) => {
    if (!isGameRunning) return;

    switch (event.key) {
        case 'ArrowUp':
            if (dy !== 1) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy !== -1) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx !== 1) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx !== -1) { dx = 1; dy = 0; }
            break;
    }
});

startBtn.addEventListener('click', initGame);

// 初始绘制一次背景
ctx.fillStyle = '#ecf0f1';
ctx.fillRect(0, 0, canvas.width, canvas.height);
