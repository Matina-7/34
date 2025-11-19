// Game Canvas Setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game State
const game = {
    state: 'playing', // 'playing', 'won', 'lost', 'paused'
    timeLeft: 90.0,
    coinsCollected: 0,
    totalCoins: 10,
    selectedItem: null,
    dialogActive: false
};

// Player Object
const player = {
    x: 100,
    y: 350,
    width: 60,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    speed: 5,
    jumpPower: 12,
    grounded: false,
    image: new Image()
};

// Load Images
player.image.src = 'image1.png';

const coinImage = new Image();
coinImage.src = 'image3.png';

const enemyImage = new Image();
enemyImage.src = 'image2.png';

// Game Objects
const platforms = [
    { x: 0, y: 450, width: 1200, height: 50, color: '#2ecc71' }, // Ground
    { x: 200, y: 350, width: 150, height: 20, color: '#27ae60' },
    { x: 450, y: 280, width: 150, height: 20, color: '#27ae60' },
    { x: 700, y: 200, width: 150, height: 20, color: '#27ae60' },
    { x: 950, y: 300, width: 150, height: 20, color: '#27ae60' }
];

const coins = [];
const enemies = [];
const items = ['Speed Boost', 'Double Jump', 'Shield', 'Time Freeze'];

// Initialize Game Objects
function initGame() {
    // Create coins
    coins.length = 0;
    const coinPositions = [
        { x: 250, y: 310 },
        { x: 500, y: 240 },
        { x: 750, y: 160 },
        { x: 1000, y: 260 },
        { x: 400, y: 400 },
        { x: 600, y: 400 },
        { x: 150, y: 400 },
        { x: 900, y: 400 },
        { x: 300, y: 200 },
        { x: 1100, y: 400 }
    ];

    coinPositions.forEach(pos => {
        coins.push({
            x: pos.x,
            y: pos.y,
            width: 30,
            height: 30,
            collected: false
        });
    });

    // Create enemies
    enemies.length = 0;
    enemies.push(
        { x: 400, y: 410, width: 40, height: 40, velocityX: 2, minX: 350, maxX: 550 },
        { x: 700, y: 160, width: 40, height: 40, velocityX: -2, minX: 700, maxX: 850 },
        { x: 200, y: 310, width: 40, height: 40, velocityX: 1.5, minX: 200, maxX: 350 }
    );
}

// Input Handling
const keys = {};

window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    if (e.key.toLowerCase() === 'w' && player.grounded && game.state === 'playing') {
        player.velocityY = -player.jumpPower;
        player.grounded = false;
    }
});

window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Physics and Collision
function updatePlayer() {
    if (game.state !== 'playing') return;

    // Horizontal movement
    player.velocityX = 0;
    if (keys['a']) player.velocityX = -player.speed;
    if (keys['d']) player.velocityX = player.speed;

    player.x += player.velocityX;

    // Boundary check
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Gravity
    player.velocityY += 0.6;
    player.y += player.velocityY;

    // Ground collision
    player.grounded = false;

    platforms.forEach(platform => {
        if (checkCollision(player, platform)) {
            if (player.velocityY > 0) {
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.grounded = true;
            }
        }
    });

    // Prevent falling through bottom
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.velocityY = 0;
        player.grounded = true;
    }
}

function updateEnemies() {
    if (game.state !== 'playing') return;

    enemies.forEach(enemy => {
        enemy.x += enemy.velocityX;

        // Bounce between boundaries
        if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
            enemy.velocityX *= -1;
        }

        // Check collision with player
        if (checkCollision(player, enemy)) {
            game.state = 'lost';
            showMessage('Game Over! You were caught by a monster!');
        }
    });
}

function updateCoins() {
    coins.forEach(coin => {
        if (!coin.collected && checkCollision(player, coin)) {
            coin.collected = true;
            game.coinsCollected++;
            updateCoinCount();

            // Show dialog on certain coins
            if (game.coinsCollected === 3 || game.coinsCollected === 7) {
                showDialog();
            }

            // Check win condition
            if (game.coinsCollected >= game.totalCoins) {
                game.state = 'won';
                showMessage('Congratulations! You collected all coins!');
            }
        }
    });
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// UI Updates
function updateTimer() {
    if (game.state !== 'playing') return;

    game.timeLeft -= 0.016; // Approximately 60 FPS
    if (game.timeLeft <= 0) {
        game.timeLeft = 0;
        game.state = 'lost';
        showMessage('Time\'s up! Game Over!');
    }

    document.getElementById('timer').textContent = game.timeLeft.toFixed(1) + 's';
}

function updateCoinCount() {
    document.getElementById('coinCount').textContent = game.coinsCollected;
}

function showMessage(text) {
    document.getElementById('message').textContent = text;
}

// Dialog System
function showDialog() {
    game.dialogActive = true;
    game.state = 'paused';

    const dialogOverlay = document.getElementById('dialogOverlay');
    const dialogText = document.getElementById('dialogText');
    const dialogChoices = document.getElementById('dialogChoices');

    dialogText.textContent = 'You found a magical treasure! Choose an item to help you on your journey:';

    dialogChoices.innerHTML = '';
    items.forEach(item => {
        const button = document.createElement('button');
        button.textContent = item;
        button.addEventListener('click', () => selectItem(item));
        dialogChoices.appendChild(button);
    });

    dialogOverlay.classList.remove('hidden');
}

function selectItem(item) {
    game.selectedItem = item;
    document.getElementById('itemStatus').textContent = item;
    closeDialog();

    // Apply item effect
    applyItemEffect(item);
}

function applyItemEffect(item) {
    switch(item) {
        case 'Speed Boost':
            player.speed = 8;
            showMessage('Speed Boost activated! You move faster!');
            setTimeout(() => {
                player.speed = 5;
                showMessage('Speed Boost wore off.');
            }, 10000);
            break;
        case 'Double Jump':
            showMessage('Double Jump unlocked! (Not implemented yet)');
            break;
        case 'Shield':
            showMessage('Shield activated! You\'re protected for 15 seconds!');
            // Would need to implement shield logic
            break;
        case 'Time Freeze':
            game.timeLeft += 20;
            showMessage('Time Freeze! Added 20 seconds to the timer!');
            break;
    }
}

function closeDialog() {
    const dialogOverlay = document.getElementById('dialogOverlay');
    dialogOverlay.classList.add('hidden');
    game.dialogActive = false;
    if (game.state === 'paused') {
        game.state = 'playing';
    }
}

document.getElementById('dialogClose').addEventListener('click', closeDialog);

// Drawing Functions
function drawPlayer() {
    if (player.image.complete) {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
        // Fallback rectangle if image not loaded
        ctx.fillStyle = '#3498db';
        ctx.fillRect(player.x, player.y, player.width, player.height);
    }
}

function drawPlatforms() {
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

        // Add border
        ctx.strokeStyle = '#229954';
        ctx.lineWidth = 2;
        ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function drawCoins() {
    coins.forEach(coin => {
        if (!coin.collected) {
            if (coinImage.complete) {
                ctx.drawImage(coinImage, coin.x, coin.y, coin.width, coin.height);
            } else {
                ctx.fillStyle = '#f39c12';
                ctx.beginPath();
                ctx.arc(coin.x + coin.width/2, coin.y + coin.height/2, coin.width/2, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    });
}

function drawEnemies() {
    enemies.forEach(enemy => {
        if (enemyImage.complete) {
            ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        } else {
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
    });
}

function drawBackground() {
    // Sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Simple clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.arc(200, 80, 30, 0, Math.PI * 2);
    ctx.arc(230, 80, 40, 0, Math.PI * 2);
    ctx.arc(260, 80, 30, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(600, 120, 35, 0, Math.PI * 2);
    ctx.arc(640, 120, 45, 0, Math.PI * 2);
    ctx.arc(680, 120, 35, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(1000, 70, 30, 0, Math.PI * 2);
    ctx.arc(1030, 70, 40, 0, Math.PI * 2);
    ctx.arc(1060, 70, 30, 0, Math.PI * 2);
    ctx.fill();
}

// Game Loop
function gameLoop() {
    // Clear canvas
    drawBackground();

    // Update
    updatePlayer();
    updateEnemies();
    updateCoins();
    updateTimer();

    // Draw
    drawPlatforms();
    drawCoins();
    drawEnemies();
    drawPlayer();

    requestAnimationFrame(gameLoop);
}

// Start Game
initGame();
updateCoinCount();
gameLoop();
