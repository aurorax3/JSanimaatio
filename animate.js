// Canvas
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 700;

let x4 = 0; // Layer 4 x position
const BG_WIDTH = 2400; // Background width
const BG_HEIGHT = 700; // Background height
const bgSpeedLayer4 = 6; // Speed of layer 4

// Background image
const bgLayer4 = new Image();
bgLayer4.src = "./background/layer-4.png";

// Spritesheet
const spritesheet = new Image();
spritesheet.src = "./spritesheets/shadow_dog.png";
const spriteWidth = 575;
const spriteHeight = 523;

// Animation variables
let x = 0; // sprite sheet x position
let y = 3; // sprite sheet y position (row)
let dx = 0; // canvas x position
let dy = 0; // canvas y position
let dWidth = spriteWidth / 10; // sprite width on canvas
let dHeight = spriteHeight / 10; // sprite height on canvas

// FPS control variables
let fps = 60; // desired frames per second
let frameInterval = 1000 / fps; // milliseconds between frames
let frameTimer = 0;
let lastTime = 0;

function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // Calculate delta time
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;
    
    // Skip frame if not enough time has passed
    if (frameTimer > frameInterval) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        
        // Draw the sprite at current position
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

        // Draw background layer 4
        ctx.drawImage(bgLayer4, x4, 0,); // Draw layer 4 background
        ctx.drawImage(bgLayer4, x4 + BG_WIDTH, 0); // Draw second instance for seamless scrolling
        x4 -= bgSpeedLayer4; // Move layer 4 to the left
        if(x4 < -BG_WIDTH) x4 += BG_WIDTH; // Reset position when it goes off screen
        
        // Select next sprite in the row
        if (x < 8) x++;
        else x = 0;
        
        // Move sprite to the right
        dx += 2;
        
        // If sprite goes off the right side of canvas, reset to left side
        if (dx > CANVAS_WIDTH) {
            dx = -dWidth;
        }
        
        frameTimer = 0;
    } else {
        frameTimer += deltaTime;
    }
}

// Start animation
requestAnimationFrame(animate);