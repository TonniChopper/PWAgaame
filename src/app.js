import { initGame } from './game/engine.js';

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const menu = document.getElementById('menu');
    const gameContainer = document.getElementById('game-container');
    const endScreen = document.getElementById('end-screen');
    const playAgainButton = document.getElementById('play-again-button');
    const endMessage = document.getElementById('end-message');
    const gameTime = document.getElementById('game-time');

    startButton.addEventListener('click', () => {
        menu.style.display = 'none';
        endScreen.style.display = 'none'; // Скрыть end-screen при старте игры
        gameContainer.style.display = 'block';
        initGame(gameContainer, endGameCallback);
    });

    playAgainButton.addEventListener('click', () => {
        endScreen.style.display = 'none';
        gameContainer.style.display = 'block';
        initGame(gameContainer, endGameCallback);
    });

    function endGameCallback(message, time) {
        gameContainer.style.display = 'none';
        endScreen.style.display = 'flex';
        endMessage.textContent = message;
        gameTime.textContent = `Time: ${time} seconds`;
    }
});