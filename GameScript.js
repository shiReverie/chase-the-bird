function getQueryParam(param) { 
    let urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const urlParams = new URLSearchParams(window.location.search);
const chosenCharacter = urlParams.get('character');
let charSpeed = parseInt(urlParams.get('speed'), 10); 
let health = parseInt(urlParams.get('health'), 10) || 3; 
let obstacles = parseInt(urlParams.get('obstacles'), 10) || 0; 
const restoreInterval = parseInt(urlParams.get('restoreInterval'), 10); 

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d'); 


const frameCount = 4; 
let frames = []; 
let currentFrame = 0; 
let frameInterval = 100; 
let lastFrameTime = 0;

if (chosenCharacter === 'Chase') {  
for (let i = 1; i <= frameCount; i++) {
    let img = new Image();
    img.src = `chase${i}.png`;
    frames.push(img); 
    }
}
if (chosenCharacter === 'Sylvie') {
    for (let i = 1; i <= frameCount; i++) {
        let img = new Image();
        img.src = `sylvie${i}.png`;
        frames.push(img);
    }
}

if (chosenCharacter === 'Smokey') {
    for (let i = 1; i <= frameCount; i++) {
        let img = new Image();
        img.src = `smokey${i}.png`;
        frames.push(img);
    }
}
if (chosenCharacter === 'Dozy') {
    for (let i = 1; i <= frameCount; i++) {
        let img = new Image();
        img.src = `dozy${i}.png`;
        frames.push(img);
    }
}

const appleTypes = 5;
const appleSprites = []; 
for (let i = 1; i <= appleTypes; i++) { 
    let appleImg = new Image();
    appleImg.src = `apple${i}.png`;
    appleSprites.push(appleImg);
}


let apples = []; 


function createApple(type = null) { 
    const appleType = type !== null ? type : Math.floor(Math.random() * appleTypes); 
    const x = canvas.width;
    const y = Math.random() * (canvas.height - 32);  
    const speed = 2 + Math.random() * 3; 
    apples.push({ type: appleType, img: appleSprites[appleType], x: x, y: y, speed: speed }); 
}


let charX = 100; 
let charY = 100;
const scaleFactor = 0.1; 

let score = 0;
let speedBoost = false;
let speedBoostEndTime = 0;
let destroyObstacles = false;

if (chosenCharacter === 'Sylvie') 
{ health = 4; }
document.getElementById('health').textContent = health;


let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;


window.addEventListener('keydown', function (event) { 
    switch (event.key) {
        case 'ArrowUp': 
            moveUp = true;
            break;
        case 'ArrowDown': 
            moveDown = true;
            break;
        case 'ArrowLeft': 
            moveLeft = true;
            break;
        case 'ArrowRight':
            moveRight = true;
            break;
    }
});

window.addEventListener('keyup', function (event) { 
    switch (event.key) {
        case 'ArrowUp':
            moveUp = false;
            break;
        case 'ArrowDown':
            moveDown = false;
            break;
        case 'ArrowLeft':
            moveLeft = false;
            break;
        case 'ArrowRight':
            moveRight = false;
            break;
    }
});

function drawCurrentFrame(timestamp) { 
    if (timestamp - lastFrameTime > frameInterval) { 
        currentFrame = (currentFrame + 1) % frameCount; 
        lastFrameTime = timestamp; 
    }

    const img = frames[currentFrame]; 
    const width = img.width * scaleFactor;
    const height = img.height * scaleFactor;
    ctx.drawImage(img, charX, charY, width, height);
}

function drawAndMoveApples() {
    for (let i = apples.length - 1; i >= 0; i--) { 
        const apple = apples[i];
        ctx.drawImage(apple.img, apple.x, apple.y, 75, 75); 
        apple.x -= apple.speed;  

        
        if (charX < apple.x + 32 && charX + frames[0].width * scaleFactor > apple.x &&
            charY < apple.y + 32 && charY + frames[0].height * scaleFactor > apple.y) {
            applyAppleEffect(apple.type);
            apples.splice(i, 1); 
        } 

        
        if (apple.x + 32 < 0) { 
            apples.splice(i, 1);
        }
    }
}

function applyAppleEffect(type) {
    switch (type) {
        case 0:  
            score += 10;
            break;
        case 1: 
            score += 20; 
            if (chosenCharacter === 'Smokey' && obstacles > 0) {
                obstacles -= 1;
            } else {
                destroyObstacles = true; 
            }
            break;
        case 2: 
            score += 20; 
            health = Math.min(health + 1, 3); 
            break;
        case 3: 
            score += 20; 
            speedBoost = true;
            speedBoostEndTime = performance.now() + 10000; 
            charSpeed += 1;
            break;
        case 4: 
            score -= 5; 
            health -= 1;
            break;
    }

    
    document.getElementById('score').textContent = score;
    document.getElementById('health').textContent = health;
}


function drawBackgrounds() { 
    bgImages.forEach((bg, index) => {
        
        ctx.drawImage(bg.img, offsets[index], 0, canvas.width, canvas.height);
        ctx.drawImage(bg.img, offsets[index] + canvas.width, 0, canvas.width, canvas.height);

        
        offsets[index] -= bg.speed;
        if (offsets[index] <= -canvas.width) {
            offsets[index] = 0;
        }
    });
}


function updateCharacterPosition() {
    const width = frames[0].width * scaleFactor;
    const height = frames[0].height * scaleFactor;

    if (moveUp && charY > 0) charY -= charSpeed;
    if (moveDown && charY < canvas.height - height) charY += charSpeed;
    if (moveLeft && charX > 0) charX -= charSpeed;
    if (moveRight && charX < canvas.width - width) charX += charSpeed;
}

function endGame(message) {
    
    cancelAnimationFrame(gameLoop);

    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.fillStyle = 'black';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    createApple(5);
}


function resetGame() {
    score = 0;
    health = parseInt(urlParams.get('health'), 10) || 3; 
    speedBoost = false;
    destroyObstacles = false;
    apples = [];
    ghosts = [];
    offsets = [0, 0, 0];
    lastFrameTime = 0;
    charX = 100;
    charY = 100;
    document.getElementById('score').textContent = score;
    document.getElementById('health').textContent = health;
    obstacles = parseInt(urlParams.get('obstacles'), 10) || 0; 
    requestAnimationFrame(gameLoop);
}


const ghostTypes = 2;
const ghostSprites = [];
for (let i = 1; i <= ghostTypes; i++) {
    let ghostImg = new Image();
    ghostImg.src = `ghost${i}.png`;
    ghostSprites.push(ghostImg);
}

let ghosts = [];


function createGhost() {
    const ghostType = Math.floor(Math.random() * ghostTypes);
    const x = canvas.width;
    const y = Math.random() * (canvas.height - 32);
    const speed = 2 + Math.random() * 3; 
    ghosts.push({ type: ghostType, img: ghostSprites[ghostType], x: x, y: y, speed: speed });
}


function drawAndMoveGhosts() {
    for (let i = ghosts.length - 1; i >= 0; i--) {
        const ghost = ghosts[i];
        ctx.drawImage(ghost.img, ghost.x, ghost.y, 75, 75); 
        ghost.x -= ghost.speed; 

       
        if (charX < ghost.x + 32 && charX + frames[0].width * scaleFactor > ghost.x &&
            charY < ghost.y + 32 && charY + frames[0].height * scaleFactor > ghost.y) {

            if (destroyObstacles || (chosenCharacter === 'Smokey' && obstacles > 0)) {
               
                ghosts.splice(i, 1);
                destroyObstacles = false; 
                if (chosenCharacter === 'Smokey') obstacles -= 1;
            } else {
                applyGhostEffect(ghost.type);
                ghosts.splice(i, 1); 
            }
        }

        if (ghost.x + 32 < 0) {
            ghosts.splice(i, 1);
        }
    }
}


function applyGhostEffect(type) {
    switch (type) {
        case 0:
            health -= 1;
            break;
        case 1: 
            health -= 2;
            break;
    }

    
    document.getElementById('health').textContent = health;
}


function generateApples() {
    createApple();
    const interval = 5000 + Math.random() * 5000; 
    setTimeout(generateApples, interval);
}

function generateGhosts() {
    createGhost();
    const interval = 3000 + Math.random() * 9000; 
    setTimeout(generateGhosts, interval);
}

function drawBackgrounds() {
    bgImages.forEach((bg, index) => {
       
        ctx.drawImage(bg.img, offsets[index], 0, canvas.width, canvas.height);
        ctx.drawImage(bg.img, offsets[index] + canvas.width, 0, canvas.width, canvas.height);

        offsets[index] -= bg.speed;
        if (offsets[index] <= -canvas.width) {
            offsets[index] = 0;
        }
    });
}

function updateCharacterPosition() {
    const width = frames[0].width * scaleFactor;
    const height = frames[0].height * scaleFactor;

    if (moveUp && charY > 0) charY -= charSpeed;
    if (moveDown && charY < canvas.height - height) charY += charSpeed;
    if (moveLeft && charX > 0) charX -= charSpeed;
    if (moveRight && charX < canvas.width - width) charX += charSpeed;
}

function endGame(message) {
    
    cancelAnimationFrame(gameLoop);

    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    ctx.fillStyle = 'black';
    ctx.font = '48px Calibri';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    createApple(5);
}

function gameLoop(timestamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    drawBackgrounds(); 
    updateCharacterPosition(); 
    drawAndMoveApples(); 
    drawAndMoveGhosts(); 
    drawCurrentFrame(timestamp); 

    if (speedBoost && timestamp > speedBoostEndTime) {
        speedBoost = false;
        charSpeed -= 1;
    }

   
    if (score >= 1000) {
        window.location.href = 'finish.html';
    } else if (health <= 0) {
        endGame('Game Over!');
    } else {
        requestAnimationFrame(gameLoop); 
    }
}
const bgLayers = [
    { src: 'bg_game1.jpg', speed: 1 },
    { src: 'bg_game2.png', speed: 1.25 },
    { src: 'bg_game3.png', speed: 1.5 },
];

const bgImages = bgLayers.map(layer => {
    const img = new Image();
    img.src = layer.src;
    img.onload = () => console.log(`Loaded: ${layer.src}`);
    img.onerror = () => console.error(`Error loading: ${layer.src}`);
    return { img, ...layer };
});

let offsets = [0, 0, 0];

let loadedImages = 0;
bgImages.forEach(bg => {
    bg.img.onload = function () {
        loadedImages++;
        if (loadedImages === bgImages.length && frames.length === frameCount) {
            requestAnimationFrame(gameLoop);
        }
    };
});

generateApples();
generateGhosts();

if (chosenCharacter === 'Dozy' && restoreInterval) {
    setInterval(() => {
        health = Math.min(health + 1, 3); 
        document.getElementById('health').textContent = health;
    }, restoreInterval);
}

