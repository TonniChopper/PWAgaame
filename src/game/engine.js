import { Player } from './entities.js';
import { Helmet, Comet } from './items.js';
import { setupControls } from '../ui/controls.js';
import { renderGame, renderEndScreen } from '../ui/renderer.js';
import { applyGravity, handleCollisions } from './physics.js';

function getRandomPosition(maxWidth, maxHeight, size) {
    const x = Math.random() * (maxWidth - size);
    const y = Math.random() * (maxHeight - size);
    return { x, y };
}

export function initGame(container, endGameCallback) {
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
    const cometSize = 50;
    const playerPosition = getRandomPosition(canvas.width, canvas.height, playerSize);
    const helmetPosition = getRandomPosition(canvas.width, canvas.height, helmetSize);

    const player = new Player(playerPosition.x, playerPosition.y, playerSize, 'public/assets/images/IN_GAME.png');
    const helmet = new Helmet(helmetPosition.x, helmetPosition.y, helmetSize, 'public/assets/images/Helmet.png');

    const comets = Array.from({ length: 3 }, () => {
        const cometPosition = getRandomPosition(canvas.width, canvas.height, cometSize);
        return new Comet(cometPosition.x, cometPosition.y, cometSize, Math.random() * 0.5, 'public/assets/images/Asteroid.png');
    });

    setupControls(player);

    let startTime = Date.now();

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        applyGravity(player);
        player.update();
        helmet.update();

        if (handleCollisions(player, helmet)) {
            const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            renderEndScreen(ctx, player, 'You Win!', timeElapsed);
            return;
        }

        for (let i = 0; i < comets.length; i++) {
            comets[i].update();

            if (comets[i].collidesWith(player)) {
                const timeElapsed = ((Date.now() - startTime) / 1000).toFixed(2);
                renderEndScreen(ctx, player, 'Game Over', timeElapsed);
                return;
            }
        }

        renderGame(ctx, player, helmet, comets);

        requestAnimationFrame(gameLoop);
    }

    gameLoop();
    return player;
}