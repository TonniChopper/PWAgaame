import { initGame } from './game/engine.js';
import { renderEndScreen } from './ui/renderer.js';

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const menu = document.getElementById('menu');
    const gameContainer = document.getElementById('game-container');
    const endScreen = document.getElementById('end-screen');
    const playAgainButton = document.getElementById('play-again-button');
    const endMessage = document.getElementById('end-message');
    const gameTime = document.getElementById('game-time');
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    let player;

    startButton.addEventListener('click', () => {
        menu.style.display = 'none';
        endScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        player = initGame(gameContainer, endGameCallback);
    });

    playAgainButton.addEventListener('click', () => {
        endScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        player = initGame(gameContainer, endGameCallback);
    });

    function endGameCallback(message, time) {
        gameContainer.style.display = 'none';
        endScreen.style.display = 'flex';
        endMessage.textContent = message;
        gameTime.textContent = `Time: ${time} seconds`;

        const newImageSrc = message === 'You Win!' ? 'public/assets/images/GAME_DONE.png' : 'public/assets/images/GAME_OVER.png';
        const newImage = new Image();
        newImage.src = newImageSrc;

        newImage.onload = () => {
            player.setImage(newImageSrc);
            renderEndScreen(ctx, player, message, time);
        };
    }
});