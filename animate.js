// Canvas
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const canvaswidth = canvas.width = 300;
const canvasheight = canvas.height = 300;

// Spritesheet

const spritesheet = new Image();
spritesheet.src = "./spritesheets/shadow_dog.png";
const spriteWidth = 575;
const spriteHeight = 523;

// Animation
function animate() {
    ctx.clearRect(0, 0, canvaswidth, canvasheight);
    ctx.drawimage(spritesheet, 0, 0, spriteWidth, spriteHeight, 0, 0, 200, 200);
    ctx.drawimage(spritesheet, 4*spriteWidth, 0, spriteWidth, spriteHeight, 0, 0, 200, 200);
    requestAnimationFrame(animate);
}   
animate();
