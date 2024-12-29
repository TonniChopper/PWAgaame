
const backgroundImage = new Image();
backgroundImage.src = 'public/assets/images/space.jpg';

export function renderGame(ctx, player, helmet, comets, extraTimeItems) {


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

    if(extraTimeItems){
        for (let extraTimeItem of extraTimeItems) {
            if (extraTimeItem.image && extraTimeItem.image.complete) {
                ctx.drawImage(extraTimeItem.image, extraTimeItem.x, extraTimeItem.y, extraTimeItem.size, extraTimeItem.size);
            }
        }
    }
}

