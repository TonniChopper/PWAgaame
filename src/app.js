
import { initGame } from './game/engine.js';
/*import { renderEndScreen } from './ui/renderer.js';*/

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const menu = document.getElementById('menu');
    const gameContainer = document.getElementById('game-container');
    const endScreen = document.getElementById('end-screen');
    const playAgainButton = document.getElementById('play-again-button');
    const endMessage = document.getElementById('end-message');
    const gameTime = document.getElementById('game-time');
    const canvas = document.getElementById('game-canvas');
   /* const ctx = canvas.getContext('2d');*/
    const pauseButton = document.getElementById('pause-button'); //ИЗМЕНЕНИЕ

    let player;

    startButton.addEventListener('click', () => {
        menu.style.display = 'none';
        endScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        player = initGame(gameContainer, endGameCallback);
        pauseButton.style.display = 'block'; // Показать кнопку паузы //ИЗМЕНЕНИЕ
    });

    playAgainButton.addEventListener('click', () => {
        endScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        pauseButton.style.display = 'block'; // Показать кнопку паузы //ИЗМЕНЕНИЕ
        player = initGame(gameContainer, endGameCallback);
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
