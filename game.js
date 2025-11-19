const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

let catImg = new Image();
catImg.src = "assets/image1.png";

let monsterImg = new Image();
monsterImg.src = "assets/image2.png";

let coinImg = new Image();
coinImg.src = "assets/image3.png";

/********** GAME VARIABLES **********/
let cat = {
    x: 100,
    y: 300,
    w: 60,
    h: 60,
    vy: 0,
    onGround: false,
    jumpCount: 0,
    speed: 3,  // Speed set to 3 as requested
    sprint: false
};

let gravity = 0.6;
let platforms = [];
let coins = [];
let monsters = [];
let dialogTriggers = [500, 1200, 1800]; // narrative points
let currentDialog = null;
let itemActive = "None";
let itemTimer = 0;

let collectedCoins = 0;
let gameTime = 90;
let gameOver = false;

/********** CREATE PLATFORMS **********/
for (let i = 0; i < 8; i++) {
    platforms.push({
        x: 400 + i * 300,
        y: 300 - (i % 3) * 50,
        w: 120,
        h: 20
    });
}

/********** CREATE COINS **********/
for (let i = 0; i < 10; i++) {
    coins.push({
        x: 300 + i * 250,
        y: 200 + Math.sin(i) * 40,
        taken: false
    });
}

/********** MONSTERS **********/
for (let i = 0; i < 7; i++) {
    monsters.push({
        x: 600 + i * 350,
        y: 360,
        w: 60,
        h: 60
    });
}

/********** DIALOG DOM **********/
const dialogOverlay = document.getElementById("dialogOverlay");
const dialogChoices = document.getElementById("dialogChoices");
const dialogText = document.getElementById("dialogText");
const dialogClose = document.getElementById("dialogClose");

/********** GAME LOOP **********/
function update() {
    if (gameOver || dialogOverlay.classList.contains("hidden") === false) {
        requestAnimationFrame(update);
        return;
    }

    gameTime -= 0.016;
    document.getElementById("timer").innerText = gameTime.toFixed(1) + "s";
    if (gameTime <= 0) {
        endGame("Time is up!");
        return;
    }

    // Movement
    let speed = cat.speed;
    if (cat.sprint) speed *= 1.6;

    if (keys["a"] || keys["A"]) cat.x -= speed;
    if (keys["d"] || keys["D"]) cat.x += speed;

    // Jump - handle double jump
    if ((keys["w"] || keys["W"]) && cat.jumpCount < 2) {
        if (!keys.jumpPressed) {
            cat.vy = -10;
            cat.jumpCount++;
            keys.jumpPressed = true;
        }
    } else {
        keys.jumpPressed = false;
    }

    cat.vy += gravity;
    cat.y += cat.vy;

    // Ground collision
    if (cat.y >= 400) {
        cat.y = 400;
        cat.vy = 0;
        cat.jumpCount = 0;
        cat.onGround = true;
    }

    // Platform collision
    cat.onGround = false;
    for (let p of platforms) {
        if (cat.x < p.x + p.w && cat.x + cat.w > p.x &&
            cat.y + cat.h < p.y + 20 && cat.y + cat.h > p.y &&
            cat.vy >= 0) {
            cat.y = p.y - cat.h;
            cat.vy = 0;
            cat.jumpCount = 0;
            cat.onGround = true;
        }
    }

    // Coin collection
    for (let c of coins) {
        if (!c.taken &&
            cat.x < c.x + 40 && cat.x + cat.w > c.x &&
            cat.y < c.y + 40 && cat.y + cat.h > c.y) {
            c.taken = true;
            collectedCoins++;
            document.getElementById("coinCount").innerText = collectedCoins;
        }
    }

    // Monster collision - reset game when hit
    for (let m of monsters) {
        if (cat.x < m.x + m.w && cat.x + cat.w > m.x &&
            cat.y < m.y + m.h && cat.y + cat.h > m.y) {
            resetGame();
            return;
        }
    }

    // Dialog triggers
    for (let i = 0; i < dialogTriggers.length; i++) {
        if (cat.x > dialogTriggers[i]) {
            startDialog(i);
            dialogTriggers.splice(i, 1);
            break;
        }
    }

    // Item timer (5-second effect)
    if (itemTimer > 0) {
        itemTimer -= 0.016;
        if (itemTimer <= 0) {
            itemActive = "None";
            cat.sprint = false;
            gravity = 0.6; // Reset gravity
            document.getElementById("itemStatus").innerText = "None";
        }
    }

    // Win condition: reach x > 3000 with at least 7 coins
    if (cat.x > 3000) {
        if (collectedCoins >= 7) {
            endGame("You Win! Thank you for adventuring! 🎉");
        } else {
            endGame("Not enough coins. Need at least 7! Collected: " + collectedCoins);
        }
        return;
    }

    draw();
    requestAnimationFrame(update);
}

/********** DRAW **********/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#98D8C8');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Camera offset to follow cat
    let cameraX = Math.max(0, cat.x - 300);

    ctx.save();
    ctx.translate(-cameraX, 0);

    // Draw platforms
    ctx.fillStyle = "#8B4513";
    ctx.strokeStyle = "#654321";
    ctx.lineWidth = 2;
    for (let p of platforms) {
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeRect(p.x, p.y, p.w, p.h);
    }

    // Draw ground
    ctx.fillStyle = "#228B22";
    ctx.fillRect(0, 460, 4000, 40);

    // Draw coins
    for (let c of coins) {
        if (!c.taken) {
            if (coinImg.complete && coinImg.naturalHeight !== 0) {
                ctx.drawImage(coinImg, c.x, c.y, 40, 40);
            } else {
                // Fallback to drawing a yellow circle if image not loaded
                ctx.fillStyle = "#FFD700";
                ctx.beginPath();
                ctx.arc(c.x + 20, c.y + 20, 15, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#FFA500";
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
    }

    // Draw monsters
    for (let m of monsters) {
        if (monsterImg.complete && monsterImg.naturalHeight !== 0) {
            ctx.drawImage(monsterImg, m.x, m.y, m.w, m.h);
        } else {
            // Fallback to drawing a red rectangle if image not loaded
            ctx.fillStyle = "#FF0000";
            ctx.fillRect(m.x, m.y, m.w, m.h);
            ctx.strokeStyle = "#8B0000";
            ctx.lineWidth = 2;
            ctx.strokeRect(m.x, m.y, m.w, m.h);
        }
    }

    // Draw cat
    if (catImg.complete && catImg.naturalHeight !== 0) {
        ctx.drawImage(catImg, cat.x, cat.y, cat.w, cat.h);
    } else {
        // Fallback to drawing a blue rectangle if image not loaded
        ctx.fillStyle = "#4169E1";
        ctx.fillRect(cat.x, cat.y, cat.w, cat.h);
        ctx.strokeStyle = "#000080";
        ctx.lineWidth = 2;
        ctx.strokeRect(cat.x, cat.y, cat.w, cat.h);
    }

    // Draw finish line
    ctx.fillStyle = "#00FF00";
    ctx.fillRect(3000, 0, 20, 500);
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("FINISH", 2950, 30);

    ctx.restore();
}

/********** DIALOG SYSTEM **********/
function startDialog(triggerIndex) {
    const dialogMessages = [
        "You've discovered a treasure! Choose a magical item to help your journey:",
        "Another mysterious chest appears! Pick an item wisely:",
        "The final treasure! This item could be crucial for reaching the finish!"
    ];

    dialogText.innerText = dialogMessages[triggerIndex] || dialogMessages[0];
    dialogOverlay.classList.remove("hidden");
    dialogChoices.innerHTML = `
        <button onclick="chooseItem('Spring')">🌟 Spring (Super Jump)</button>
        <button onclick="chooseItem('Fish')">🐟 Fish (Sprint Boost)</button>
        <button onclick="chooseItem('Balloon')">🎈 Balloon (Low Gravity)</button>
        <button onclick="chooseItem('Horn')">📯 Horn (Time Bonus)</button>
    `;
}

dialogClose.onclick = () => {
    dialogOverlay.classList.add("hidden");
};

function chooseItem(item) {
    itemActive = item;
    itemTimer = 5.0; // 5-second effect as required
    document.getElementById("itemStatus").innerText = item;

    // Apply item effects
    if (item === "Fish") {
        cat.sprint = true;
    }
    if (item === "Spring") {
        cat.vy = -15;
    }
    if (item === "Balloon") {
        gravity = 0.2;
    }
    if (item === "Horn") {
        gameTime += 10; // Add 10 seconds
    }

    // Reset gravity if not Balloon
    if (item !== "Balloon") {
        gravity = 0.6;
    }

    dialogOverlay.classList.add("hidden");
}

/********** RESTART - Reopen after encountering monsters **********/
function resetGame() {
    cat.x = 100;
    cat.y = 300;
    cat.vy = 0;
    cat.jumpCount = 0;
    cat.sprint = false;
    // Don't reset collected coins or time - game continues
    document.getElementById("message").innerText = "Hit a monster! Respawned at start.";
    setTimeout(() => {
        document.getElementById("message").innerText = "";
    }, 2000);
}

/********** END **********/
function endGame(text) {
    gameOver = true;
    document.getElementById("message").innerText = text;
}

// Start the game
update();
