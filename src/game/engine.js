import { Player } from './entities.js';
import { Helmet, Comet, ExtraTime } from './items.js';
import { setupControls } from '../ui/controls.js';
import { renderGame } from '../ui/renderer.js';
import { applyGravity, handleCollisions } from './physics.js';

async function loadLevels() {
    try {
        const response = await axios.get('./src/game/levels.json');
        return response.data;
    } catch (error) {
        console.error('Error loading levels:', error);
        return [];
    }
}

function getRandomPosition(maxWidth, maxHeight, size) {
    const x = Math.random() * (maxWidth - size);
    const y = Math.random() * (maxHeight - size);
    return { x, y };
}

let elapsedTime = 0;
let isPaused = false;
let isGameWaiting = true;
let startTime = 0;
let pauseTime = 0;

function resetTimer() {
    elapsedTime = 0;
    startTime = 0;
    pauseTime = 0;
    visuallyResetTimer();
}

function visuallyResetTimer(levelConfig) {
    const timeElement = document.getElementById('game-timer');
    const timerBar = document.getElementById('timer-bar');

    if (!levelConfig || !levelConfig.hasTimer) {
        return;
    }

    if (timeElement) {
        timeElement.textContent = `Time: 0.0 s`;
    }
    if (timerBar) {
        timerBar.style.width = '100%';
    }
}

function updateTimer(startTime, timerDuration) {
    const timeElement = document.getElementById('game-timer');
    const timerBar = document.getElementById('timer-bar');

    if (!isPaused && !isGameWaiting) {
        elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
    }
    const remainingTime = Math.max(0, timerDuration - elapsedTime);

    if (timeElement) {
        timeElement.textContent = `Time: ${remainingTime.toFixed(1)} s`;
    }
    if (timerBar) {
        const progress = (remainingTime / timerDuration) * 100;
        timerBar.style.width = `${Math.max(progress, 0)}%`;
    }

    return remainingTime;
}

function togglePause() {
    const pauseMenu = document.getElementById('pause-menu');
    const continueIcon = document.getElementById('continue-icon');

    if (!isPaused) {
        pauseTime = Date.now();
        isPaused = true;
        pauseMenu.style.transform = 'translateY(0)';
        continueIcon.style.display = 'block';
    } else {
        const pausedDuration = Date.now() - pauseTime;
        startTime += pausedDuration;
        isPaused = false;
        pauseMenu.style.transform = 'translateY(-100%)';
        continueIcon.style.display = 'none';
    }
}

function showLevelMenu(levelConfig, startGameCallback) {
    const levelMenu = document.getElementById('level-menu');
    const levelMessage = document.getElementById('level-message');
    const startButton = document.getElementById('start-level-button');

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const deviceMessage = isMobile
        ? "Rotate your phone to control the player!"
        : "Use arrow keys to control the player!";

    if (levelConfig.extraTimeI) {
        levelMessage.innerHTML = `<p>${levelConfig.instructions}</p>
                                 <img src='./public/assets/images/ExtraTime.png' alt='Extra Time Image'/>
                                 <p>${deviceMessage}</p>`;
    } else {
        levelMessage.innerHTML = `${levelConfig.instructions}<br>${deviceMessage}`;
    }

    levelMenu.style.transform = 'translateY(0)';
    visuallyResetTimer(levelConfig);

    startButton.onclick = () => {
        levelMenu.style.transform = 'translateY(-100%)';
        resetTimer();
        isGameWaiting = false;
        startTime = Date.now();
        startGameCallback();
    };
}

function isOverlappingWithComet(character, comets) {
    return comets.some(comet => {
        const dx = character.x - comet.x;
        const dy = character.y - comet.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (character.size / 2 + comet.size / 2);
    });
}

export async function initGame(container, endGameCallback, levelConfig) {
    const levels = await loadLevels();
    const currentLevel = levels.find(level => level.level === levelConfig.level);

    if (!currentLevel) {
        console.error('Level not found');
        return;
    }

    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
        container.removeChild(existingCanvas);
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'game-canvas';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const playerSize = 60;
    const helmetSize = 40;
    const cometSize = currentLevel.cometSize || 50;
    const cometSpeed = currentLevel.cometSpeed;

    const helmetPosition = getRandomPosition(canvas.width, canvas.height, helmetSize);
    const helmet = new Helmet(helmetPosition.x, helmetPosition.y, helmetSize, 'public/assets/images/Helmet.png');

    const comets = Array.from({ length: currentLevel.cometCount }, () => {
        const cometPosition = getRandomPosition(canvas.width, canvas.height, cometSize);
        return new Comet(cometPosition.x, cometPosition.y, cometSize, cometSpeed + Math.random() * 0.5, 'public/assets/images/Asteroid.png', canvas);
    });

    const extraTimeItems = Array.from({ length: currentLevel.extraTimeC }, () => {
        const position = getRandomPosition(canvas.width, canvas.height, 30);
        return new ExtraTime(position.x, position.y, 30, 'public/assets/images/ExtraTime.png');
    });

    let playerPosition;
    let player;
    do {
        playerPosition = getRandomPosition(canvas.width, canvas.height, playerSize);
        player = new Player(playerPosition.x, playerPosition.y, playerSize, 'public/assets/images/IN_GAME.png');
    } while (isOverlappingWithComet(player, comets));

    setupControls(player);

    const timerBarContainer = document.getElementById('timer-bar-container');
    const timeElement = document.getElementById('game-timer');
    if (currentLevel.hasTimer) {
        timerBarContainer.style.display = 'block';
        timeElement.style.display = 'block';
    } else {
        timerBarContainer.style.display = 'none';
        timeElement.style.display = 'none';
    }

    const pauseButton = document.getElementById('pause-button');
    pauseButton.style.display = 'block';
    pauseButton.addEventListener('click', togglePause);

    const continueButton = document.getElementById('continue-button');
    continueButton.addEventListener('click', togglePause);

    showLevelMenu(currentLevel, () => {
        startTime = Date.now();
    });

    function gameLoop() {
        if (isGameWaiting) {
            renderGame(ctx, player, helmet, comets, extraTimeItems);
            requestAnimationFrame(gameLoop);
            return;
        }

        if (isPaused) {
            requestAnimationFrame(gameLoop);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        applyGravity(player, currentLevel.gravity || 0.01);
        player.update();
        helmet.update();

        if (currentLevel.hasTimer) {
            const remainingTime = updateTimer(startTime, currentLevel.timerDuration);
            if (remainingTime <= 0) {
                isGameWaiting = true;
                endGameCallback('Time\'s Up!', elapsedTime);
                return;
            }
        }

        if (handleCollisions(player, helmet)) {
            isGameWaiting = true;
            const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            endGameCallback('You Win!', timeElapsed);
            return;
        }

        for (let i = 0; i < comets.length; i++) {
            comets[i].update();

            if (comets[i].collidesWith(player)) {
                isGameWaiting = true;
                const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
                endGameCallback('Game Over!', timeElapsed);
                return;
            }
        }

        for (let i = 0; i < extraTimeItems.length; i++) {
            if (extraTimeItems[i].collidesWith(player)) {
                startTime += currentLevel.extraTime * 1000;
                extraTimeItems.splice(i, 1);
            }
        }

        renderGame(ctx, player, helmet, comets, extraTimeItems);

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
    return player;
}