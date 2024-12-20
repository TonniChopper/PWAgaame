export class Player {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = 0;
        this.speedY = 0;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Замедление и инерция
        this.speedX *= 0.98;
        this.speedY *= 0.98;

        // Проверка границ экрана
        this.checkBounds();
    }

    checkBounds() {
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
        if (this.x + this.size > window.innerWidth) this.x = window.innerWidth - this.size;
        if (this.y + this.size > window.innerHeight) this.y = window.innerHeight - this.size;
    }

    draw(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    collidesWith(object) {
        return (
            this.x < object.x + object.size &&
            this.x + this.size > object.x &&
            this.y < object.y + object.size &&
            this.y + this.size > object.y
        );
    }
}