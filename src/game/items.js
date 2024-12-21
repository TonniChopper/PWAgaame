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
    constructor(x, y, size, speed, imageSrc) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    update() {
        this.y += this.speed;
        if (this.y > window.innerHeight) {
            this.y = -this.size;
            this.x = Math.random() * (window.innerWidth - this.size);
        }
    }

    // draw(ctx) {
    //     if (this.image.complete) {
    //         ctx.drawImage(this.image, this.x, this.y, this.size, this.size);
    //     }
    // }

    collidesWith(player) {
        return (
            this.x < player.x + player.size &&
            this.x + this.size > player.x &&
            this.y < player.y + player.size &&
            this.y + this.size > player.y
        );
    }
}