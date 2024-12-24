
import { initGame } from './game/engine.js';
import {levels} from './game/levels.js';


document.addEventListener('DOMContentLoaded', () => {
    const menu = document.getElementById('menu');
    const gameContainer = document.getElementById('game-container');
    const endScreen = document.getElementById('end-screen');
    const playAgainButton = document.getElementById('play-again-button');
    const endMessage = document.getElementById('end-message');
    const gameTime = document.getElementById('game-time');
    const pauseButton = document.getElementById('pause-button');
    const levelButtons = document.querySelectorAll('.level-button');

    let player;
    let availableLevels = [...Array(levels.length).keys()];
    let completedLevels = JSON.parse(localStorage.getItem('completedLevels')) || [];
    let selectedLevel = null;


    function updateAvailableLevels() {
        availableLevels = [...Array(levels.length).keys()].filter(level => !completedLevels.includes(level));
    }


    function getRandomLevel() {
        if (availableLevels.length === 0) {
            return null; // Все уровни пройдены
        }
        const randomIndex = Math.floor(Math.random() * availableLevels.length);
        return availableLevels[randomIndex];
    }


    function markLevelAsCompleted(level) {
        if (!completedLevels.includes(level)) {
            completedLevels.push(level);
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels)); // Сохранение в Local Storage
        }
    }


    function startLevel() {
        if (selectedLevel !== null) {
            player = initGame(gameContainer, endGameCallback, levels[selectedLevel]);
        } else {
            console.error('No level selected. Cannot start game.');
        }
    }


    function initializeGame() {
        updateAvailableLevels();
    }

    // Проверка состояния игры при загрузке
    function checkGameStateOnLoad() {
        initializeGame();
        if (completedLevels.length === 0) {
            menu.style.display = 'flex'; // Первый заход: показываем меню
        } else {
            if (availableLevels.length === 0) {
                localStorage.removeItem('completedLevels'); // Сброс пройденных уровней, если все уровни завершены
                completedLevels = []; // Очищаем локальный массив
                initializeGame(); // Переинициализируем доступные уровни
                menu.style.display = 'flex'; // Показываем меню, если все уровни завершены
            } else {
                selectedLevel = getRandomLevel();
                menu.style.display = 'none';
                gameContainer.style.display = 'block';
                endScreen.style.display = 'none';
                startLevel();
                pauseButton.style.display = 'block';
            }
        }
    }

    // Обработчик для кнопок выбора уровня
    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            initializeGame();
            selectedLevel = getRandomLevel();
            if (selectedLevel !== null) {
                menu.style.display = 'none';
                gameContainer.style.display = 'block';
                endScreen.style.display = 'none';
                startLevel();
                pauseButton.style.display = 'block';
            } else {
                console.error('No available levels to start.');
            }
        });
    });

    // Кнопка "Play Again"
    playAgainButton.addEventListener('click', () => {
        endScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        pauseButton.style.display = 'block';
        startLevel();
    });

    // Callback завершения уровня
    function endGameCallback(message, time) {
        pauseButton.style.display = 'none';

        endMessage.textContent = message;
        gameTime.textContent = `Time: ${time} seconds`;

        const newImageSrc = message === 'You Win!' ? 'public/assets/images/GAME_DONE.png' : 'public/assets/images/GAME_OVER.png';
        const resultImage = new Image();
        resultImage.src = newImageSrc;
        resultImage.alt = message;
        resultImage.style.width = '200px';
        resultImage.style.marginTop = '20px';

        endScreen.innerHTML = '';
        endScreen.appendChild(endMessage);
        endScreen.appendChild(resultImage);
        endScreen.appendChild(gameTime);
        endScreen.appendChild(playAgainButton);

        if (message === 'You Win!') {
            markLevelAsCompleted(selectedLevel);
            updateAvailableLevels();

            if (availableLevels.length > 0) {
                const nextLevelButton = document.createElement('button');
                nextLevelButton.id = 'next-level-button';
                nextLevelButton.textContent = 'Next Level';
                nextLevelButton.style.marginTop = '20px';
                nextLevelButton.addEventListener('click', () => {
                    selectedLevel = getRandomLevel();
                    endScreen.style.display = 'none';
                    gameContainer.style.display = 'block';
                    startLevel();
                });
                endScreen.appendChild(nextLevelButton);
            } else {
                const backToMenuButton = document.createElement('button');
                backToMenuButton.id = 'back-to-menu-button';
                backToMenuButton.textContent = 'Back to Menu';
                backToMenuButton.style.marginTop = '20px';
                backToMenuButton.addEventListener('click', () => {
                    localStorage.removeItem('completedLevels');
                    completedLevels = [];
                    initializeGame();
                    const timeElement = document.getElementById('game-timer');
                    const timerBarContainer = document.getElementById('timer-bar-container');

                    if (timeElement) {
                        timeElement.style.display = 'none'; // ИЗМЕНЕНИЕ: Скрываем таймер
                    }
                    if (timerBarContainer) {
                        timerBarContainer.style.display = 'none'; // ИЗМЕНЕНИЕ: Скрываем полоску таймера
                    }
                    endScreen.style.display = 'none';
                    gameContainer.style.display = 'none';
                    menu.style.display = 'flex';
                });
                endScreen.appendChild(backToMenuButton);
            }
        }

        playAgainButton.style.display = 'block';

        endScreen.style.transform = 'translateY(-100%)';
        endScreen.style.opacity = '0';
        endScreen.style.display = 'flex';

        setTimeout(() => {
            endScreen.style.transform = 'translateY(0)';
            endScreen.style.opacity = '1';
        }, 50);
    }

    // Проверяем состояние игры при загрузке страницы
    checkGameStateOnLoad();

    // Тесты для локального хранилища
    console.log('Initial completed levels:', completedLevels); // Проверка сохранённых уровней

    // Тестовая функция для сброса хранилища
    function resetLocalStorage() {
        console.log('Resetting localStorage.');
        localStorage.removeItem('completedLevels');
        console.log('Completed levels after reset:', localStorage.getItem('completedLevels'));
    }

    // Запустить тесты
    resetLocalStorage(); // Сбросить данные перед тестами
});
