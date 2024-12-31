export function setupControls(player, currentLevel) {
    // Управление с клавиатуры
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

    // Проверяем поддержку DeviceOrientationEvent
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
                const temp = targetSpeedX;
                targetSpeedX = targetSpeedY;
                targetSpeedY = -temp;
            }

            player.speedX = Math.min(Math.max(player.speedX * damping + targetSpeedX * (1 - damping), -6), 6);
            player.speedY = Math.min(Math.max(player.speedY * damping + targetSpeedY * (1 - damping), -6), 6);
        }
    };

    // Добавляем обработчик на кнопку "start-level-button"
    const startButton = document.getElementById('start-level-button');

    if (!startButton) return;

    startButton.addEventListener('click', () => {
        // Проверяем поддержку и запрашиваем разрешение
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then((permissionState) => {
                    if (permissionState === 'granted') {
                        window.addEventListener('deviceorientation', applyGyroMovement);
                        console.log('Доступ к гироскопу предоставлен.');
                    } else {
                        alert("The gyroscope is disabled by the user. Please enable access in your device settings.");
                    }
                })
                .catch(() => alert("Failed to request permission to access the gyroscope."));
        } else {
            // Если `requestPermission` не требуется
            window.addEventListener('deviceorientation', applyGyroMovement);
            console.log('DeviceOrientationEvent доступен без запроса разрешения.');
        }
    });

}


