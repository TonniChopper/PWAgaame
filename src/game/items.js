export class Helmet {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = (Math.random() - 0.5) * 0.5; // Медленная скорость по X
        this.speedY = (Math.random() - 0.5) * 0.5; // Медленная скорость по Y
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Проверка границ экрана
        this.checkBounds();
    }

    checkBounds() {
        if (this.x < 0) {
            this.x = 0;
            this.speedX = -this.speedX; // Меняем направление при столкновении с границей
        }
        if (this.y < 0) {
            this.y = 0;
            this.speedY = -this.speedY; // Меняем направление при столкновении с границей
        }
        if (this.x + this.size > window.innerWidth) {
            this.x = window.innerWidth - this.size;
            this.speedX = -this.speedX; // Меняем направление при столкновении с границей
        }
        if (this.y + this.size > window.innerHeight) {
            this.y = window.innerHeight - this.size;
            this.speedY = -this.speedY; // Меняем направление при столкновении с границей
        }
    }

    draw(ctx) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}

export class Comet {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }

    update() {
        this.x += this.speed;
        this.y += this.speed;

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
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
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