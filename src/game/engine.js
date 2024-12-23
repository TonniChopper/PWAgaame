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

    // Таймер работает только если игра идет (не на паузе и не в ожидании)
    if (!isPaused && !isGameWaiting) {
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

/*
    if (levelConfig.extraTimeI) {
        const img = document.createElement('img');
        img.src = './public/assets/images/ExtraTime.png';
        img.alt = 'Extra Time Image';
        img.style.width = '20px';
        img.style.height = '20px'; 
        levelMessage.appendChild(img);
    }*/

    if (levelConfig.extraTimeI) {

        levelMessage.innerHTML = `<p>${levelConfig.instructions}</p>
                                 <img src='./public/assets/images/ExtraTime.png' alt='Extra Time Image'/>
                                 <p>${deviceMessage}</p>`;
            } else {

            levelMessage.innerHTML = `${levelConfig.instructions}<br>${deviceMessage}`;
        }


            /* levelMessage.innerHTML = `${levelConfig.instructions}<br/>${deviceMessage}`;*/
            /* levelMessage.innerHTML += `<br/>${levelConfig.instructions}<br/>${deviceMessage}`;*/
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

            const comets = Array.from({length: levelConfig.cometCount}, () => {
            const cometPosition = getRandomPosition(canvas.width, canvas.height, cometSize);
            return new Comet(cometPosition.x, cometPosition.y, cometSize, cometSpeed + Math.random() * 0.5, 'public/assets/images/Asteroid.png');
        });

            const extraTimeItems = Array.from({length: levelConfig.extraTimeC}, () => {
            const position = getRandomPosition(canvas.width, canvas.height, 30);
            return new ExtraTime(position.x, position.y, 30, 'public/assets/images/ExtraTime.png');
        });

            setupControls(player);

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

            // Показываем меню уровня перед запуском игры
            showLevelMenu(levelConfig, () => {
            startTime = Date.now(); // Устанавливаем начальное время
        });

            function gameLoop() {
            if (isGameWaiting) {
            renderGame(ctx, player, helmet, comets, extraTimeItems); // Отрисовываем статичную картинку
            requestAnimationFrame(gameLoop); // Продолжаем ожидание
            return;
        }

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
            isGameWaiting = true; // Переводим игру в состояние ожидания
            endGameCallback('Time\'s Up!', elapsedTime);
            return;
        }
        }

            if (handleCollisions(player, helmet)) {
            isGameWaiting = true; // Переводим игру в состояние ожидания
            const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            endGameCallback('You Win!', timeElapsed);
            return;
        }

            /*

                    if (handleCollisions(player, helmet)) {
                        if (!tasksCompleted.includes(levelConfig.level)) {
                            tasksCompleted.push(levelConfig.level); // Добавить текущий уровень в список завершенных
                        }
                        isGameWaiting = true;
                        const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
                        endGameCallback('You Win!', timeElapsed);
                        return;
                    }
            */
            for (let i = 0; i < comets.length; i++) {
            comets[i].update();

            if (comets[i].collidesWith(player)) {
            isGameWaiting = true; // Переводим игру в состояние ожидания
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
