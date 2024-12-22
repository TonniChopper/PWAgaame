import { initGame } from './game/engine.js';
import { levels } from './game/levels.js';

document.addEventListener('DOMContentLoaded', () => {
    //const startButton = document.getElementById('start-button');
    const menu = document.getElementById('menu');
    const gameContainer = document.getElementById('game-container');
    const endScreen = document.getElementById('end-screen');
    const playAgainButton = document.getElementById('play-again-button');
    const endMessage = document.getElementById('end-message');
    const gameTime = document.getElementById('game-time');
    const canvas = document.getElementById('game-canvas');
    const pauseButton = document.getElementById('pause-button'); //ИЗМЕНЕНИЕ
    const levelButtons = document.querySelectorAll('.level-button');

    let player;
    let selectedLevel = 0;

    levelButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedLevel = button.getAttribute('data-level');
            if (selectedLevel) {
                menu.style.display = 'none';
                gameContainer.style.display = 'block';
                endScreen.style.display = 'none';
                player = initGame(gameContainer, endGameCallback, levels[selectedLevel-1]);
                pauseButton.style.display = 'block';
            }
        });
    });

    // function startGame() {
    //     if (selectedLevel) {
    //         menu.style.display = 'none';
    //         gameContainer.style.display = 'block';
    //         endScreen.style.display = 'none';
    //         player = initGame(gameContainer, endGameCallback, levels[currentLevel]);
    //         pauseButton.style.display = 'block';
    //     }
    // }
    // startButton.addEventListener('click', () => {
    //     menu.style.display = 'none';
    //     endScreen.style.display = 'none';
    //     gameContainer.style.display = 'block';
    //     player = initGame(gameContainer, endGameCallback, levels[currentLevel]);
    //     pauseButton.style.display = 'block'; // Показать кнопку паузы //ИЗМЕНЕНИЕ
    // });

    playAgainButton.addEventListener('click', () => {
        endScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        pauseButton.style.display = 'block'; // Показать кнопку паузы //ИЗМЕНЕНИЕ
        player = initGame(gameContainer, endGameCallback, levels[selectedLevel-1]);
    });



    function endGameCallback(message, time) {


        pauseButton.style.display = 'none';

        endMessage.textContent = message;
        gameTime.textContent = `Time: ${time} seconds`;

        const newImageSrc = message === 'You Win!' ? 'public/assets/images/GAME_DONE.png' : 'public/assets/images/GAME_OVER.png';
        const resultImage = new Image();
        resultImage.src = newImageSrc;
        resultImage.alt = message;
        resultImage.style.width = '200px'; // Размер изображения
        resultImage.style.marginTop = '20px'; // Отступ сверху

        endScreen.innerHTML = '';
        endScreen.appendChild(endMessage);
        endScreen.appendChild(resultImage);
        endScreen.appendChild(gameTime);
        endScreen.appendChild(playAgainButton);

        if (message === 'You Win!') {
            const nextLevelButton = document.createElement('button');
            nextLevelButton.textContent = 'Next Level';
            nextLevelButton.style.marginTop = '20px'; // Отступ сверху
            nextLevelButton.addEventListener('click', () => {
                selectedLevel = (selectedLevel + 2) % levels.length;
                endScreen.style.display = 'none';
                gameContainer.style.display = 'block';
                player = initGame(gameContainer, endGameCallback, levels[selectedLevel-1]);
            });
            endScreen.appendChild(nextLevelButton);
        }

        playAgainButton.style.display = 'block';


        endScreen.style.transform = 'translateY(-100%)';
        endScreen.style.opacity = '0'; // Начальная прозрачность
        endScreen.style.display = 'flex'; // Делаем элемент видимым

        // Плавное появление endScreen
        setTimeout(() => {
            endScreen.style.transform = 'translateY(0)';
            endScreen.style.opacity = '1';
        }, 50);
    }

});
