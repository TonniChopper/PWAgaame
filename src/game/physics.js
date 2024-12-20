export function applyGravity(player) {
    const gravity = 0.01; // Уменьшенная сила гравитации

    if (player.y + player.size < 600) {
        player.speedY += gravity; // Гравитация вниз
    }
}

export function handleCollisions(player, helmet) {
    if (player.collidesWith(helmet)) {
        // Можно добавить эффект столкновения, если надо
        return true;
    }
    return false;
}
