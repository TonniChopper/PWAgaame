export class Helmet {
    constructor(x, y, size, imageSrc) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = (Math.random() - 0.5) * 0.5; // Медленная скорость по X
        this.speedY = (Math.random() - 0.5) * 0.5; // Медленная скорость по Y
        this.image = new Image();
        this.image.src = imageSrc;

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
    constructor(x, y, size, speed, imageSrc, canvas) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSrc;
        this.direction = Math.random() * 2 * Math.PI;
        this.canvas = canvas;
    }

    update() {
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);

        // Handle boundary conditions (e.g., wrap around or bounce)
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
    }

    collidesWith(player) {
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.size / 2 + player.size / 2);
    }
}
export class ExtraTime {
    constructor(x, y, size, imageSrc) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    collidesWith(player) {
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < this.size / 2 + player.size / 2;
    }
}