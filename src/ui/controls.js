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



    if (window.DeviceOrientationEvent) {
        const sensitivity = 0.05; // Увеличенная чувствительность для резкого движения
        const damping = 0.7; // Ещё меньшее сглаживание для быстрого отклика
        let isMobile = /Mobi|Android/i.test(navigator.userAgent); // Проверяем, мобильное ли устройство

        if (isMobile) {
            window.addEventListener('deviceorientation', (event) => {
                if (event.gamma && event.beta) {
                    // Рассчитываем целевые скорости с учетом чувствительности
                    const targetSpeedX = event.gamma * sensitivity;
                    const targetSpeedY = event.beta * sensitivity;

                    // Постепенно приближаемся к целевым скоростям для более резкого движения
                    player.speedX = player.speedX * damping + targetSpeedX * (1 - damping);
                    player.speedY = player.speedY * damping + targetSpeedY * (1 - damping);

                    // Ограничиваем скорость, чтобы движения оставались управляемыми
                    player.speedX = Math.min(Math.max(player.speedX, -6), 6);
                    player.speedY = Math.min(Math.max(player.speedY, -6), 6);
                }
            });
        }
    }


}


