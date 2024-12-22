import { Player } from './entities.js';
import { Helmet, Comet, ExtraTime } from './items.js';
import { setupControls } from '../ui/controls.js';
import { renderGame } from '../ui/renderer.js';
import { applyGravity, handleCollisions } from './physics.js';

function getRandomPosition(maxWidth, maxHeight, size) {
    const x = Math.random() * (maxWidth - size);
    const y = Math.random() * (maxHeight - size);
    return { x, y };
}

let elapsedTime = 0;
let isPaused = false;

function updateTimer(startTime, timerDuration) {
    const timeElement = document.getElementById('game-timer');
    const timerBar = document.getElementById('timer-bar');
    if (!isPaused) {
        elapsedTime = ((Date.now() - startTime) / 1000).toFixed(1);
    }
    if (timeElement) {
        timeElement.textContent = `Time: ${elapsedTime} s`;
    }
    if (timerBar) {
        const remainingTime = timerDuration - elapsedTime;
        const progress = Math.max(0, remainingTime / timerDuration) * 100;
        timerBar.style.width = `${progress}%`;
    }
    return timerDuration - elapsedTime;
}

function togglePause() {
    isPaused = !isPaused;
    const pauseMenu = document.getElementById('pause-menu');
    const continueIcon = document.getElementById('continue-icon');
    if (isPaused) {
        pauseMenu.style.transform = 'translateY(0)';
        continueIcon.style.display = 'block';
    } else {
        pauseMenu.style.transform = 'translateY(-100%)';
        continueIcon.style.display = 'none';
    }
}

export function initGame(container, endGameCallback, levelConfig) {
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
    const cometSize = levelConfig.cometSize || 50;
    const cometSpeed = levelConfig.cometSpeed;
    const playerPosition = getRandomPosition(canvas.width, canvas.height, playerSize);
    const helmetPosition = getRandomPosition(canvas.width, canvas.height, helmetSize);

    const player = new Player(playerPosition.x, playerPosition.y, playerSize, 'public/assets/images/IN_GAME.png');
    const helmet = new Helmet(helmetPosition.x, helmetPosition.y, helmetSize, 'public/assets/images/Helmet.png');

    const comets = Array.from({ length: levelConfig.cometCount }, () => {
        const cometPosition = getRandomPosition(canvas.width, canvas.height, cometSize);
        return new Comet(cometPosition.x, cometPosition.y, cometSize, cometSpeed + Math.random() * 0.5, 'public/assets/images/Asteroid.png');
    });

    const extraTimeItems = Array.from({ length: levelConfig.extraTimeC }, () => {
        const position = getRandomPosition(canvas.width, canvas.height, 30);
        return new ExtraTime(position.x, position.y, 30, 'public/assets/images/ExtraTime.png');
    });

    setupControls(player);

    let startTime = Date.now();
    let timer = levelConfig.hasTimer ? levelConfig.timerDuration : null;

    const timerBarContainer = document.getElementById('timer-bar-container');
    if (levelConfig.hasTimer) {
        timerBarContainer.style.display = 'block';
    } else {
        timerBarContainer.style.display = 'none';
    }

    const pauseButton = document.getElementById('pause-button');
    pauseButton.style.display = 'block';
    pauseButton.addEventListener('click', togglePause);

    const continueButton = document.getElementById('continue-button');
    continueButton.addEventListener('click', togglePause);

    function gameLoop() {
        if (isPaused) {
            requestAnimationFrame(gameLoop);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        applyGravity(player, levelConfig.gravity || 0.01);
        player.update();
        helmet.update();

        if (levelConfig.hasTimer) {
            const remainingTime = updateTimer(startTime, levelConfig.timerDuration);
            if (remainingTime <= 0) {
                endGameCallback('Time\'s Up!', elapsedTime);
                return;
            }
        }

        if (handleCollisions(player, helmet)) {
            const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            endGameCallback('You Win!', timeElapsed);
            return;
        }

        for (let i = 0; i < comets.length; i++) {
            comets[i].update();

            if (comets[i].collidesWith(player)) {
                const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
                endGameCallback('Game Over!', timeElapsed);
                return;
            }
        }

        for (let i = 0; i < extraTimeItems.length; i++) {

            if (extraTimeItems[i].collidesWith(player)) {
                startTime += levelConfig.extraTime * 1000; // Добавить время
                extraTimeItems.splice(i, 1); // Удалить элемент
            }
        }

        renderGame(ctx, player, helmet, comets, extraTimeItems);

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
    return player;
}