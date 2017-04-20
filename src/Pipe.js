export default class Pipe {
    constructor() {
        this.stash = [];
        this.timeout = false;
    }

    add(func, timeout) {
        this.stash.push({
            func,
            timeout
        });
    }

    run() {
        if(this.stash.length > 0) {
            let _this = this;
            // run first
            const node = this.stash.shift();
            node.func();
            setTimeout(()=>{_this.run()}, node.timeout);

        }
    }
}

// pipe = new Pipe();
// pipe.run(a, 1000).run()