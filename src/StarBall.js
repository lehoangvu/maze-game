const {
        Bodies
    } = Matter;

const starBallRadius = 8;

export default class StarBall {
    constructor(x, y) {
        this.body = Bodies.circle(x, y, starBallRadius, {
                score: 1,
                label: 'star-ball',
                isStatic: true,
                render: {
                    sprite: {
                        texture: './src/img/star-ball.png',
                    }

                }
            }
        )
    }
}