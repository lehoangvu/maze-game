const {
        Bodies
    } = Matter;

export default class Ball {
    constructor(x, y, r) {
        this.body = Bodies.circle(x, y, r, {
                label: 'ball',
                isStatic: true,
                render: {
                    fillStyle: 'blue',

                }
            }
        )
    }
}