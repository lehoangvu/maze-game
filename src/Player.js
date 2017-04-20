const {
        Bodies, Body, Constraint, Engine, Events,
        Mouse, MouseConstraint, Runner, World,
        Composite
    } = Matter;

export default class Player {
    constructor({x, y, r, options}) {
        this.state = {
            fireForm: false,
            x,
            y,
            r,
            options
        };
        this.body = Bodies.circle( x, y, r, options );
        this.position = {
            x, y
        };
        this.fireBalls = [];
        let fireComposite = Composite.create();
        this.fireComposite = fireComposite;

        this.updateState({});
        
    }

    resetBody() {
        const {x, y, r, options} = this.state;
        this.body = Bodies.circle( x, y, r, options );
    }

    updateState(state) {
        this.state = {
            ...this.state,
            ...state
        };
        if(this.state.fireForm)
            this.createFire();
    }

    setPosition({x, y}) {
        this.position = {
            x, y
        };
    }

    onUpdate(world) {
        if(this.state.fireForm){
            this.fireBalls.map((ball)=>{
                World.remove(world, ball);
            });

            this.fireBalls = [];
            this.fire.particles.map((particle) => {
                const ball = Bodies.circle(particle.location.x + this.body.position.x, particle.location.y + this.body.position.y, particle.radius, {
                        collisionFilter: {
                            mask: false
                        },
                        label: 'fire',
                        isStatic: true,
                        render: {
                            fillStyle: 'red',
                            zIndex: 1
                        }
                    }
                );
                this.fireBalls.push(ball);
            })

            World.add(world, this.fireBalls);
            this.fire.update({gravity: world.gravity});
        }
        
    }

    createFire() {
        let random = Math.random();
        let color = '#f00'
        let graphics, state;
        graphics = new PIXI.Graphics;
        graphics.position.x = this.position.x;
        graphics.position.y = this.position.y;
        state = {
            color,
            graphics: graphics,
            random: Math.random(),
            x: this.position.x,
            y: this.position.y,
            particles: this.createParticlesFire(10, random, color),
            update: (options) => {
                return this.updateFire(state, options);
            },
            position: graphics.position
        };
        this.fire = state;
    }


    rand(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    updateFire(state, options) {
        // console.log('update fire');
        let color, deltaX, deltaY, graphics, i, index, len, particle, position, random, ref;
        if (options == null) {
            options = {};
        }
        graphics = state.graphics, random = state.random, position = state.position, color = state.color;
        if (options.mouse) {
            state.position.x = options.mouse.x;
            state.position.y = options.mouse.y;
        }
        graphics.clear();
        deltaX = state.position.x - state.x;
        deltaY = state.position.y - state.y;
        graphics.position.x = state.x = state.position.x;
        graphics.position.y = state.y = state.position.y;
        graphics.blendMode = PIXI.BLEND_MODES.SCREEN;
        ref = state.particles;
        for (index = i = 0, len = ref.length; i < len; index = ++i) {
            particle = ref[index];
            graphics.beginFill(particle.color);
            graphics.fillAlpha = Math.round(particle.remainingLife / particle.life * 100) * 0.01;
            graphics.drawCircle(particle.location.x, particle.location.y, particle.radius);
            particle.remainingLife--;
            particle.radius -= 0.5;
            // particle.speed.x = particle.speed.x * ((options.gravity.x + 0.0001) / (Math.abs(options.gravity.x + 0.0001)));
            // particle.speed.y = particle.speed.y * ((options.gravity.y + 0.0001) / (Math.abs(options.gravity.y + 0.0001)));
            particle.speed.x = -((options.gravity.x === 0 ? this.rand(-1, 1) : options.gravity.x) * 1.2);
            particle.speed.y = -((options.gravity.y === 0 ? this.rand(-1, 1) : options.gravity.y) * 1.2);
            particle.location.x += particle.speed.x - deltaX;
            particle.location.y += particle.speed.y - deltaY;
            if (particle.remainingLife < 0 || particle.radius < 1) {
                this.initParticleFire(state.particles[index], random, color);
            }
        }
        graphics.beginFill(color);
        return graphics.drawCircle(0, 0, 6);
    }

    initParticleFire (particle, random, color) {
        particle.speed = {
            x: (Math.random() * 1) - 0.5,
            y: -(Math.random() * 2)
        };
        particle.location = {
            x: 0,
            y: 0
        };
        particle.radius = 3 + Math.random() + 4;
        particle.life = 20 + Math.random() + 12;
        particle.remainingLife = particle.life;
        particle.color = color;
        return particle;
    }

    createParticlesFire(count, random, color) {
        var i, results;
        let _this = this;
        return (function() {
            results = [];
            for (var i = 0; 0 <= count ? i < count : i > count; 0 <= count ? i++ : i--) {
                results.push(i);
            }
            return results;
        }).apply(this).map(function() {
            return _this.initParticleFire({}, random, color);
        });
    }

    renderYourself() {

    }
}