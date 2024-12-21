const backgroundImage = new Image();
backgroundImage.src = 'public/assets/images/space.jpg';

export function renderGame(ctx, player, helmet, comets) {

    let timeElement = document.getElementById('game-timer'); //ИЗМЕНЕНИЕ
    if (!timeElement) { //ИЗМЕНЕНИЕ
        timeElement = document.createElement('div'); //ИЗМЕНЕНИЕ
        timeElement.id = 'game-timer'; //ИЗМЕНЕНИЕ
        document.body.appendChild(timeElement); //ИЗМЕНЕНИЕ
    }


    // Draw background
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Draw player if image is loaded
    if (player.image && player.image.complete) {
        ctx.drawImage(player.image, player.x, player.y, player.size, player.size);
    }

    // Draw helmet if image is loaded
    if (helmet.image && helmet.image.complete) {
        ctx.drawImage(helmet.image, helmet.x, helmet.y, helmet.size, helmet.size);
    }

    // Draw comets if images are loaded
    for (let comet of comets) {
        if (comet.image && comet.image.complete) {
            ctx.drawImage(comet.image, comet.x, comet.y, comet.size, comet.size);
        }
    }
}


/*
export function renderEndScreen(ctx, player, message, timeElapsed) {
    // Draw background
    if (backgroundImage.complete) {
        ctx.drawImage(backgroundImage, 0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    // Display end message
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(message, ctx.canvas.width / 2, ctx.canvas.height / 2 - 50);

    // Display time elapsed
    ctx.font = '24px Arial';
    ctx.fillText(`Time: ${timeElapsed} seconds`, ctx.canvas.width / 2, ctx.canvas.height / 2);

    // Draw player image on the side if loaded
    if (player.image && player.image.complete) {
        const imageSize = 100;
        ctx.drawImage(player.image, ctx.canvas.width - imageSize - 20, 20, imageSize, imageSize);
    }
    const playAgainButton = document.getElementById('play-again-button');
    playAgainButton.style.display = 'block';
}

*/