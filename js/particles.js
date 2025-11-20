export class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.maxParticles = 200;

        this.resize();
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createBurst(x, y, count = 20) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y));
        }

        // Limit total particles
        if (this.particles.length > this.maxParticles) {
            this.particles = this.particles.slice(-this.maxParticles);
        }
    }

    createContinuous(x, y) {
        if (Math.random() < 0.3) {
            this.particles.push(new Particle(x, y));
        }

        // Limit total particles
        if (this.particles.length > this.maxParticles) {
            this.particles.shift();
        }
    }

    update() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();
            particle.draw(this.ctx);

            // Remove dead particles
            if (particle.isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1.0;
        this.decay = 0.01 + Math.random() * 0.02;
        this.size = 2 + Math.random() * 3;

        // Random cyan/blue colors
        const hue = 180 + Math.random() * 30;
        this.color = `hsl(${hue}, 100%, 50%)`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // Gravity
        this.life -= this.decay;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}
