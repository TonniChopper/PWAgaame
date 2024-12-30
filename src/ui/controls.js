

export function setupControls(player, currentLevel) {
    document.addEventListener('keydown', (event) => {
        const speedChange = 0.5;
        switch (event.key) {
            case 'ArrowUp':
                player.speedY -= speedChange;
                break;
            case 'ArrowDown':
                player.speedY += speedChange;
                break;
            case 'ArrowLeft':
                player.speedX -= speedChange;
                break;
            case 'ArrowRight':
                player.speedX += speedChange;
                break;
        }
    });

    if (!window.DeviceOrientationEvent) return;

    let sensitivity = 0.05;
    let damping = 0.7;

    if (currentLevel === 4 || currentLevel === 5) {
        sensitivity = 0.2; // Увеличиваем чувствительность
        damping = 0.9;     // Уменьшаем плавность
    }

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (!isMobile) return;

    const applyGyroMovement = (event) => {
        if (event.gamma && event.beta) {
            let targetSpeedX = event.gamma * sensitivity;
            let targetSpeedY = event.beta * sensitivity;

            // Проверка ориентации экрана
            const orientation = screen.orientation || screen.mozOrientation || screen.msOrientation;
            if (orientation && orientation.type.startsWith('landscape')) {
                // Если горизонтальная ориентация
                const temp = targetSpeedX;
                targetSpeedX = targetSpeedY; // Поменять местами
                targetSpeedY = -temp;       // Инверсия оси
            }

            player.speedX = Math.min(Math.max(player.speedX * damping + targetSpeedX * (1 - damping), -6), 6);
            player.speedY = Math.min(Math.max(player.speedY * damping + targetSpeedY * (1 - damping), -6), 6);
        }
    };

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
            .then((permissionState) => {
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', applyGyroMovement);
                } else {
                    alert("Gyroscope is disabled by the user. Please enable access in the device settings.");
                }
            })
            .catch(() => alert("Failed to request permission for gyroscope access"));
    } else {
        window.addEventListener('deviceorientation', applyGyroMovement);
    }
}
