export default class GameSalt {
    constructor(opts = {
        averageTime: 3000,
        numReturn: 8,
        cup: 9999,
        starBall: 9999,
        fireBall: 9999,
        iceBall: 9999,
        typeMap: ['cup', 'star-ball', 'fire-ball', 'ice-ball']
    }) {
        this.averageTime = opts.averageTime;
        this.numReturn = opts.numReturn;
        this.cup = opts.cup;
        this.starBall = opts.starBall;
        this.fireBall = opts.fireBall;
        this.iceBall = opts.iceBall;
        this.typeMap = opts.typeMap;
        this.totalSalt = this.starBall + this.fireBall + this.iceBall + this.cup;

        this.nextTimeLimit = this.averageTime + this.rand(-2000, 2000);
        this.time = 0;
        this.lastTime = 0;

        this.salts = [];
    }

    tick(delta) {
        this.time += 1000/60;
    }

    rand(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    getSalt() {
        // check to return salt;
        if(Math.abs(this.time - this.nextTimeLimit) > 100) {
            return false;
        }

        // check all salt

        if(this.totalSalt > 0){

            let numReturn = this.rand(this.numReturn - 3, this.numReturn + 3);
            if(numReturn > this.totalSalt)
                numReturn = this.totalSalt;
            let salts = [];
            while(numReturn > 0){
                const typeId = this.typeMap[this.rand(1, this.typeMap.length) - 1];
                if(this[typeId] === 0) {
                    // over

                } else {
                    this[typeId]--;
                    this.totalSalt--;
                    numReturn--;
                    salts.push(typeId);
                }
            }

            this.nextTimeLimit = this.time + this.averageTime + this.rand(-2000, 2000);
            this.lastTime = this.time;
            this.salts = this.salts.concat(salts);
            return salts;
        }

        return false;

    }

}
