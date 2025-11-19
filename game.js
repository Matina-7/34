// Game State
let gold = 1000;
let energy = 100;
let selectedItem = null;
let placedItems = [];

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const itemCosts = {
    brick: 10,
    wood: 5,
    stone: 15,
    glass: 20
};

const itemColors = {
    brick: '#c44536',
    wood: '#8b4513',
    stone: '#808080',
    glass: '#87ceeb'
};

// Initialize
function init() {
    updateUI();
    drawCanvas();

    canvas.addEventListener('click', placeItem);
}

// Update UI
function updateUI() {
    document.getElementById('goldAmount').textContent = gold;
    document.getElementById('energyAmount').textContent = energy;
}

// Select Item
function selectItem(item) {
    if (gold >= itemCosts[item]) {
        selectedItem = item;
        console.log('Selected:', item);
    } else {
        showDialog('Not Enough Gold!', `You need ${itemCosts[item]} gold to buy ${item}.`);
    }
}

// Place Item on Canvas
function placeItem(e) {
    if (!selectedItem) {
        showDialog('No Item Selected', 'Please select a building material first!');
        return;
    }

    if (gold < itemCosts[selectedItem]) {
        showDialog('Not Enough Gold!', `You need ${itemCosts[selectedItem]} gold.`);
        return;
    }

    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / 40) * 40;
    const y = Math.floor((e.clientY - rect.top) / 40) * 40;

    placedItems.push({
        type: selectedItem,
        x: x,
        y: y
    });

    gold -= itemCosts[selectedItem];
    energy -= 1;

    updateUI();
    drawCanvas();

    if (energy <= 0) {
        showDialog('Out of Energy!', 'You ran out of energy. Click Reset to start over.');
    }
}

// Draw Canvas
function drawCanvas() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw placed items
    placedItems.forEach(item => {
        ctx.fillStyle = itemColors[item.type];
        ctx.fillRect(item.x + 2, item.y + 2, 36, 36);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(item.x + 2, item.y + 2, 36, 36);
    });
}

// Dialog Functions
function showDialog(title = 'Welcome!', text = '') {
    document.getElementById('dialogTitle').textContent = title;
    document.getElementById('dialogText').textContent = text;
    document.getElementById('dialogOverlay').classList.remove('hidden');
}

function closeDialog() {
    document.getElementById('dialogOverlay').classList.add('hidden');
}

// Reset Game
function resetGame() {
    gold = 1000;
    energy = 100;
    selectedItem = null;
    placedItems = [];
    updateUI();
    drawCanvas();
}

// Start game when page loads
window.addEventListener('load', init);
