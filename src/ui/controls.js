export function setupControls(player) {
    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                player.speedY -= 0.5; // Это уменьшит вертикальную скорость (вверх)
                break;
            case 'ArrowDown':
                player.speedY += 0.5; // Это увеличит вертикальную скорость (вниз)
                break;
            case 'ArrowLeft':
                player.speedX -= 0.5; // Влево
                break;
            case 'ArrowRight':
                player.speedX += 0.5; // Вправо
                break;
        }
    });
}
