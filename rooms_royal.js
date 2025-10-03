// CHUNK A: Setup & Player
let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');
document.body.appendChild(canvas);
canvas.width = 800;
canvas.height = 600;

let keys = {};
let mode = 'lobby';
let coins = 0;
let wave = 0;
let enemies = [];
let isAdmin = false;
let currentWeapon = 'magic';

let player = {
    x: 400, y: 300, hp: 100, speed: 5
};

window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);


// CHUNK B: Weapons & Shop
let weapons = {
    magic: { damage: 5, cost: 0 },
    pizza: { damage: 150, cost: 3500 },
    flame: { damage: 2000, cost: 30000 },
    william: { damage: 1000000, cost: 1000000 },
    rick: { damage: 1000000000000, cost: 0, adminOnly: true }
};

function openShop() {
    let shopText = "🛒 Weapon Dealer:\n";
    shopText += "1. Golden Pizza (3500 coins)\n";
    shopText += "2. Flame Sword (30,000 coins)\n";
    shopText += "3. William Sword (1,000,000 coins)\n";
    if (isAdmin) shopText += "4. Rick Sword (Admin Only)\n";
    shopText += "\nYour Coins: " + coins + "\nPick a number to buy:";

    let choice = prompt(shopText);

    if (choice === "1" && coins >= weapons.pizza.cost) {
        coins -= weapons.pizza.cost;
        currentWeapon = "pizza";
        alert("🍕 You bought the Golden Pizza!");
    } else if (choice === "2" && coins >= weapons.flame.cost) {
        coins -= weapons.flame.cost;
        currentWeapon = "flame";
        alert("🔥 You bought the Flame Sword!");
    } else if (choice === "3" && coins >= weapons.william.cost) {
        coins -= weapons.william.cost;
        currentWeapon = "william";
        alert("⚔️ You bought the William Sword!");
    } else if (choice === "4" && isAdmin) {
        currentWeapon = "rick";
        alert("🧟 Rick Sword equipped! (Admin Only)");
    } else if (choice !== null) {
        alert("❌ Not enough coins or invalid choice!");
    }
}


// CHUNK C: Enemy System
function spawnWave() {
    let count = 5 + wave;
    for (let i = 0; i < count; i++) {
        enemies.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            hp: 10 + wave * 5,
            damage: 1
        });
    }
}


// CHUNK D: Admin Commands
function adminPanel() {
    if (!isAdmin) return;
    let cmd = prompt("Admin Panel:\n1. Spawn weak monsters\n2. Spawn strong monsters\n3. Spawn boss\n4. Set money\n5. Equip Rick Sword");
    if (cmd === "1") {
        for (let i = 0; i < 5; i++) enemies.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, hp: 50, damage: 5 });
    } else if (cmd === "2") {
        for (let i = 0; i < 5; i++) enemies.push({ x: Math.random()*canvas.width, y: Math.random()*canvas.height, hp: 150, damage: 20 });
    } else if (cmd === "3") {
        enemies.push({ x: 400, y: 200, hp: 5000, damage: 50, boss: true });
    } else if (cmd === "4") {
        coins = parseInt(prompt("Set money:"));
    } else if (cmd === "5") {
        currentWeapon = "rick";
    }
}


// CHUNK E: Drawing
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x - 10, player.y - 10, 20, 20);
    ctx.fillStyle = 'black';
    enemies.forEach(e => {
        ctx.fillRect(e.x - 10, e.y - 10, 20, 20);
    });
    ctx.fillStyle = 'white';
    ctx.fillText("HP: " + player.hp + " Coins: " + coins + " Wave: " + wave, 20, 20);
}


// CHUNK F: Game Loop
function updatePlayer() {
    if (keys['ArrowUp']) player.y -= player.speed;
    if (keys['ArrowDown']) player.y += player.speed;
    if (keys['ArrowLeft']) player.x -= player.speed;
    if (keys['ArrowRight']) player.x += player.speed;
}

function attack() {
    enemies.forEach(enemy => {
        let dx = enemy.x - player.x;
        let dy = enemy.y - player.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60) {
            let w = weapons[currentWeapon];
            enemy.hp -= w.damage;
            if (enemy.hp <= 0) {
                enemies = enemies.filter(e => e !== enemy);
                coins += 100;
            }
        }
    });
}

function gameLoop() {
    if (mode === "normal") {
        updatePlayer();
        attack();
        draw();
        if (enemies.length === 0) { wave++; spawnWave(); }
    }
    requestAnimationFrame(gameLoop);
}

// Start game
spawnWave();
gameLoop();
