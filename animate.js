// Canvas
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 700;

// Parallax background layers
const layers = [
    { img: new Image(), x: 0, speed: 1, path: "./background/layer-1.png" },
    { img: new Image(), x: 0, speed: 2, path: "./background/layer-2.png" },
    { img: new Image(), x: 0, speed: 3, path: "./background/layer-3.png" },
    { img: new Image(), x: 0, speed: 6, path: "./background/layer-4.png" },
    { img: new Image(), x: 0, speed: 7, path: "./background/layer-5.png" }
];

const BG_WIDTH = 2400;
const BG_HEIGHT = 700;

// Load all background images
let imagesLoaded = 0;
layers.forEach(layer => {
    layer.img.src = layer.path;
    layer.img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === layers.length) {
            requestAnimationFrame(animate);
        }
    };
});

// Spritesheet
const spritesheet = new Image();
spritesheet.src = "./spritesheets/shadow_dog.png";
const spriteWidth = 575;
const spriteHeight = 523;
let velocityY = 0;
const gravity = 1;
const jumpStrength = -18;
const groundY = 600;

// Animation variables
const spriteStates = {
    idle: { row: 0, frameCount: 7, speed: 0 },
    run: { row: 3, frameCount: 9, speed: 5 },
    sit: { row: 5, frameCount: 5, speed: 0 },
    jump: { row: 1, frameCount: 7, speed: 0 }
};

// Blocks
let bWidth;
let bHeight;
let bSpeed;
let bx;
let by;
newBlock(); // Initialize the first block

let currentState = 'idle';
let gameFrame = 0;
let staggerFrames = 5;
let x = 0; // sprite sheet x position
let y = spriteStates.idle.row; // start with idle row
let dWidth = spriteWidth / 6;
let dHeight = spriteHeight / 6;
let dx = 100; // canvas x position
let dy = groundY - dHeight; // canvas y position

// Keyboard controls
let keys = {};
document.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});
document.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});
// FPS control variables
let fps = 60;
let frameInterval = 1000 / fps;
let frameTimer = 0;
let lastTime = 0;

// Block variables
function newBlock() {
    bWidth = randomNumber(10, 50);
    bHeight = randomNumber(50, 100);
    bSpeed = randomNumber(4, 6);
    bx = CANVAS_WIDTH + randomNumber(0, 100);

    // 50% chance to spawn in the air
    const airBlock = Math.random() < 0.5;
    if (airBlock) {
        const minGap = dHeight + 10;
        const maxY = groundY - minGap - bHeight;
        // Prevent negative values
        by = Math.max(0, randomNumber(0, maxY));
    } else {
        by = groundY - bHeight;
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Collision detection
function isColliding(ax, ay, aw, ah, bx, by, bw, bh) {
    return (
        ax < bx + bw &&
        ax + aw > bx &&
        ay < by + bh &&
        ay + ah > by
    );
}
// Game reset
function resetGame() {
    // Reset sprite position and state
    dx = 100;
    dy = groundY - dHeight;
    velocityY = 0;
    currentState = 'idle';
    gameFrame = 0;
    x = 0;
    y = spriteStates.idle.row;

    // Reset block
    newBlock();

    // Optionally reset other game state variables if needed
}

function animate(currentTime) {
    requestAnimationFrame(animate);

    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    if (frameTimer > frameInterval) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw parallax background layers
        layers.forEach(layer => {
            ctx.drawImage(layer.img, layer.x, 0, CANVAS_WIDTH, BG_HEIGHT, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.drawImage(layer.img, layer.x - BG_WIDTH, 0, CANVAS_WIDTH, BG_HEIGHT, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            layer.x += layer.speed;
            if (layer.x >= BG_WIDTH) layer.x -= BG_WIDTH;
        });

        // Draw blocks
        ctx.fillStyle = 'red';
        ctx.fillRect(bx, by, bWidth, bHeight);

        // Block position update
        bx -= bSpeed;
        if (bx<0) newBlock();
        
        // Sprite movement logic
        let speed = 5;
        let onGround = dy >= groundY - dHeight; // Check if sprite is on the ground

        if (keys['ArrowRight']) {
            dx += speed;
            currentState = 'run';
        } else if (keys['ArrowLeft']) {
            dx -= speed;
            currentState = 'run';
        } else if (keys[' ']) { // Spacebar for jump
            if (onGround) {
                velocityY = jumpStrength;
                currentState = 'jump';
            }
        } else if (keys['ArrowDown']) {
            dy += speed;
            currentState = 'sit';
        } else if (onGround) {
            currentState = 'idle';
        }

        // Apply gravity
        if (!onGround || velocityY < 0) {
            dy += velocityY;
            velocityY += gravity;
            currentState = 'jump';
        }

        // Prevent sprite from going out of bounds and land on ground
        dx = Math.max(0, Math.min(CANVAS_WIDTH - dWidth, dx));
        if (dy >= groundY - dHeight) {
            dy = groundY - dHeight;
            velocityY = 0;
        }
        dy = Math.max(0, Math.min(CANVAS_HEIGHT - dHeight, dy));

        // Update sprite animation
        y = spriteStates[currentState].row;
        gameFrame++;
        if (gameFrame % staggerFrames == 0) {
            if (x < spriteStates[currentState].frameCount - 1) x++;
            else x = 0;
        }

        if (isColliding(dx, dy, dWidth, dHeight, bx, by, bWidth, bHeight)) {
        resetGame();
        return;
        }

        // Draw the sprite
        ctx.drawImage(
            spritesheet,
            x * spriteWidth,
            y * spriteHeight,
            spriteWidth,
            spriteHeight,
            dx,
            dy,
            dWidth,
            dHeight
        );

        frameTimer = 0;
    } else {
        frameTimer += deltaTime;
    }
}
