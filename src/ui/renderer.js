export function renderGame(ctx, player, helmet, comets) {
    // Рисуем фон
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 800, 600);

    // Рисуем игрока
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.size, player.size);

    // Рисуем шлем
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(helmet.x + helmet.size / 2, helmet.y + helmet.size / 2, helmet.size / 2, 0, Math.PI * 2);
    ctx.fill();

    for (let comet of comets) {
        ctx.beginPath();
        ctx.arc(comet.x, comet.y, comet.size, 0, Math.PI * 2);
        ctx.fillStyle = 'gray'; // Цвет кометы
        ctx.fill();
        ctx.closePath();
    }
}
