const {
        Bodies
    } = Matter;

const starBallRadius = 8;

export default class FireBall {
    constructor(x, y) {
        this.body = Bodies.circle(x, y, starBallRadius, {
                label: 'fire-ball',
                score: 2,
                isStatic: true,
                render: {
                    sprite: {
                        texture: './src/img/fire-ball.png',
                    }

                }
            }
        )
    }
}