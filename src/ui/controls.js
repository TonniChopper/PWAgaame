export function setupControls(player) {
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

    const sensitivity = 0.05;
    const damping = 0.7;
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (!isMobile) return;

    const applyGyroMovement = (event) => {
        if (event.gamma && event.beta) {
            const targetSpeedX = event.gamma * sensitivity;
            const targetSpeedY = event.beta * sensitivity;

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
                    alert("Гироскоп отключён пользователем. Включите доступ в настройках устройства.");
                }
            })
            .catch(() => alert("Не удалось запросить разрешение на доступ к гироскопу."));
    } else {
        window.addEventListener('deviceorientation', applyGyroMovement);
    }
}
