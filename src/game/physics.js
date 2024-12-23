export function applyGravity(player, gravity) {
    if (player.y + player.size < 600) {
        player.speedY += gravity; // Гравитация вниз
    }
}

export function handleCollisions(player, helmet) {
    if (player.collidesWith(helmet)) {
        return true;
    }
    return false;
}
