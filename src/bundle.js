import generator from 'generate-maze';
import Device from './Device';
import GameSalt from './GameSalt';
import Ball from './Ball';
import StarBall from './StarBall';
import FireBall from './FireBall';
import Player from './Player';
import Pipe from './Pipe';
import Level from './Level';

const {
        Bodies, Body, Constraint, Engine, Events,
        Mouse, MouseConstraint, Runner, World,
        Composite
    } = Matter;

const device = new Device();

class Main {
    constructor(){
        this.bodies = [];

        let scoreBlockText1 = new fabric.Text(
            '...', 
            { 
                left: 2,
                top: 2,
                fontFamily: 'digital',
                fontSize: 18,
                fill: '#fff'
            }
        );

        this.level = new Level();

        this.state = {
            status: 'welcome', // welcome, playing, pause
            boardText: scoreBlockText1,
            player: {
                level: 0,
                radius: 8,
                color: '#fff',
                score: 2
            },
            levelData: {
                mazeWidth: 8,
                mazeHeight: 13,
                mazeWallWidth: 4, 
                wordGravity: 0,
                ...this.level.levelData,
            },
            gameCanvas: {
                width: window.innerWidth,
                height: window.innerHeight - 24,
            },
            welcomeText: [
                'Welcome to Satan Maze...',
                'You will die!'
                ]
        };


        // setup board and show welcome text
        this.boardCanvasSetup();

        const _this = this;
        const pipe = new Pipe();

        pipe.add(() => {
            // render welcome text
            _this.showCoverText(_this.state.welcomeText);
        }, 1500);
        pipe.add(() => {
            // render welcome text
            _this.showCoverText(["Turn your phone to run..."]);
        }, 2000);

        pipe.add(() => {

            // collapse board welcome and show maze
            _this.initGame();

            // init level 1
            _this.initGamePlay(this.state.levelData);
        }, 2220);

        // pipe.add(() => {
        //     _this.nextLevel();
        // }, 2000);
        // pipe.add(() => {
        //     _this.nextLevel();
        // }, 2000);
        // pipe.add(() => {
        //     _this.nextLevel();
        // }, 2000);

        pipe.run();

    }

    nextLevel() {
        let newLevel = {
            ...this.state.levelData,
            ...this.level.next()

        };
        this.state.levelData = newLevel;
        this.initGamePlay(newLevel);
    }

    setState (newState) {
        this.state = {
            ...this.state,
            ...newState
        }
    }

    showCoverText(text) {
        this.boardCanvas.clear();
        this.boardCanvas.setBackgroundColor('#000');
        this.boardCanvas.setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        let texts = text;
        if(!Array.isArray(texts)){
            texts = [text];
        }

        let lastOffset = {
            top: 0,
            height: 0
        };
        texts.map((text) => {

            const fabricText = new fabric.Text(
                text, 
                { 
                    left: 2,
                    top: 2,
                    fontFamily: 'Courier New',
                    fontSize: 20,
                    fill: '#fff'
                }
            );
            this.boardCanvas.add(fabricText);
            fabricText.setTop(lastOffset.top + lastOffset.height + 5);
            if(lastOffset.top === 0){
                fabricText.center();
                fabricText.setTop(fabricText.top - 30);
            }
            else
                fabricText.centerH();
            lastOffset = {
                top: fabricText.top,
                height: fabricText.height
            };

        });
    }

    boardCanvasSetup() {
        let canvas = new fabric.Canvas('board');
        canvas.backgroundColor = '#000';
        canvas.setDimensions({
            width: window.innerWidth,
            height: window.innerHeight,
        });
        this.boardCanvas = canvas;
    }


    addCircle({ x = 0, y = 0, r = 10, options = {} } = {}) {
        let body = Bodies.circle(x, y, r, options)
        this.addBody(body);
        return body;
    }

    addBody(...bodies) {
        this.bodies = this.bodies.concat(...bodies);
        World.add(this.engine.world, ...bodies);
    }

    removeBody(body) {
        World.remove(this.world, body);
    }

    createMazeWall(x, y, w, h) {
        return Bodies.rectangle(x + w / 2, y + h / 2, w, h, {
            isStatic: true,
            label: 'wall',
            render: {
                fillStyle: '#9c593e',
                sprite: {
                    // texture: './src/img/brick.jpg',
                    // xScale: 8 / 64,
                    // yScale: 8 / 64
                    
                }
            }
        });
    }

    addMazeNode(node, w, h) {
        const wallWidth = this.state.levelData.mazeWallWidth;
        const x = node.x * w;
        const y = node.y * h;
        if(node.top){
            this.addBody(this.createMazeWall(x, y, w, wallWidth));
        }
        if(node.right){
            this.addBody(this.createMazeWall(x + w - wallWidth / 2, y, wallWidth, h));
        }
        if(node.bottom){
            this.addBody(this.createMazeWall(x, y + h - wallWidth / 2, w, wallWidth));
        }
        if(node.left){
            this.addBody(this.createMazeWall(x, y, wallWidth, h));
        }
    }

    createMaze() {
        const maze = generator(this.state.levelData.mazeWidth, this.state.levelData.mazeHeight);
        maze.map( ( row ) => {
            row.map( (node ) => {
                this.addMazeNode(node, this.state.gameCanvas.width / this.state.levelData.mazeWidth, this.state.gameCanvas.height / this.state.levelData.mazeHeight);
            })
        })
        return maze;
    }
    rand(min, max) {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
    getRandPositionInMaze () {
        let loop = 0;

        while(loop < 100){
            loop++;
            const min = 1;
            const mazeBlockWidth = this.state.gameCanvas.width / this.state.levelData.mazeWidth;
            const mazeBlockHeight = this.state.gameCanvas.height / this.state.levelData.mazeHeight;
            const xBlock = this.rand(this.state.levelData.mazeWidth, min);
            const yBlock = this.rand(this.state.levelData.mazeHeight, min);
            // check player have in a block
            const player = this.player;
            if((xBlock * mazeBlockWidth  > player.body.position.x 
                || player.body.position.x < (xBlock + 1) * mazeBlockWidth)
                && (yBlock * mazeBlockHeight  > player.body.position.y
                || player.body.position.y < (yBlock + 1) * mazeBlockHeight)
                ){
                return {
                    x: xBlock * mazeBlockWidth - mazeBlockWidth / 2,
                    y: yBlock * mazeBlockHeight - mazeBlockHeight / 2
                }
            }
        }
        console.log('overloop');
        return {
            x: this.rand(0, this.state.gameCanvas.width),
            ys: this.rand(0, this.state.gameCanvas.height)
        }
        
    }

    addSalt() {
        const salts = this.saltFactory.getSalt();
        if(salts) {
            salts.map((salt) => {
                const saltPosition = this.getRandPositionInMaze();
                switch (salt){
                    // case 'cup':{

                    //     }
                    //     break;
                    case 'star-ball':{
                            this.addBody(new StarBall(saltPosition.x, saltPosition.y).body);
                        }
                        break;
                    case 'fire-ball':{
                            this.addBody(new FireBall(saltPosition.x, saltPosition.y).body);
                        }
                        break;
                    // case 'iceBall':{

                    //     }
                    //     break;
                    default:{
                    }
                }
                
            })
        }
        
    }

    initGame(){
        let _this = this;

        Matter.use('matter-attractors');

        this.gameCanvas = document.getElementById('gameplace');
        this.gameCanvas.width = this.state.gameCanvas.width;
        this.gameCanvas.height = this.state.gameCanvas.height;

        this.engine = Engine.create({
            render: {
                element: document.body,
                canvas: this.gameCanvas,
                options: {
                    width: this.state.gameCanvas.width,
                    height: this.state.gameCanvas.height,
                    background: '#000',
                    wireframes: false
                }
            }
        });

        Events.on(this.engine, 'beforeUpdate', () => {
            if(_this.state.status === 'playing'){
                // update gravity
                let xDeg = device.getXDeg();
                let yDeg = device.getYDeg();
                if(xDeg && yDeg){
                    _this.world.gravity.x = _this.wordGravity - 2 * (Math.abs(90 + yDeg) / 90);
                    _this.world.gravity.y = _this.wordGravity - 2 * (Math.abs(90 - xDeg) / 90);
                    
                }

                _this.player.onUpdate(_this.world);

                // update score
                _this.updateScore();

                // // update salt
                _this.saltFactory.tick(0);
                _this.addSalt();
            }
        });   

        Events.on(this.engine, 'collisionActive', function(event) {
            if(_this.state.status === 'playing'){
                let i, pair,
                length = event.pairs.length;

                for (i = 0; i < length; i++) {
                    pair = event.pairs[i];
                    const labelA = pair.bodyA.label;
                    const labelB = pair.bodyB.label;

                    if (labelA === 'Player' || labelB === 'Player') {
                        // if (labelA === 'wall' || labelB === 'wall') {
                        //     pair.isActive = false;
                        //     pair.bodyA.velocity.x = pair.bodyA.velocity.x * -1;
                        //     pair.bodyA.velocity.y = pair.bodyA.velocity.y * -1;
                        //     pair.bodyB.velocity.x = pair.bodyB.velocity.x * -1;
                        //     pair.bodyB.velocity.y = pair.bodyB.velocity.y * -1;
                        //     continue;
                        // }
                    } else {
                        continue;
                    }
                    _this.onCollision(pair.bodyA, pair.bodyB);
                }
            }
        });

        this.world = this.engine.world;
        this.world.gravity.x = 0;
        this.world.gravity.y = 0;
        
        // run the engine
        Engine.run(this.engine);

        let mouseConstraint = MouseConstraint.create(this.engine, {
            element: document.body,
            constraint: {
                stiffness: 0.2,
                angularStiffness: 0.2
            }
        });
        World.add(this.engine.world, mouseConstraint);

        const player = this.state.player;

        this.player = new Player({
            x: 100,//Math.round(levelData.mazeWidth / 2) * levelData.mazeWidth - levelData.mazeWallWidth / 2,
            y: 100,//Math.round(levelData.mazeHeight / 2) * levelData.mazeWidth - levelData.mazeWallWidth / 2,
            r: player.radius,
            options: {
                label: 'Player',
                render: {
                    fillStyle: 'red'
                },
            }
        });
    }

    updateScore() {
        const score = this.state.player.score;
        const level = this.state.player.level;

        let scoreStr = String(10000 + score);
        scoreStr = scoreStr.substring(1, scoreStr.length);

        this.state.boardText.setText(`${scoreStr} - lv ${level}`);
        // this.boardCanvas.add(this.state.boardText);
        this.boardCanvas.renderAll();
        if(score >= this.state.levelData.targetScore) {
            this.nextLevel();
        }
    }

    onCollision(bodyA, bodyB) {
        if(bodyA.label === 'Player')
            this.swallow(bodyB);
        else
            this.swallow(bodyA);
            
    }

    swallow(body) {
        if(body.label !== 'wall'){
            this.removeBody(body);
            this.state.player.score = this.state.player.score + body.score;
        }
        switch (body.label) {
            case 'wall': {
                // dont do any thing
                break;
            }
            case 'star-ball': {
                break;
            }
            case 'fire-ball': {
                this.player.updateState({fireForm: true});
                break;
            }
            default: {
                return;
            }
        }
    }

    initGamePlay(level) {
        // clear all
        this.bodies.map((body) => {
            if(body.label === 'wall' 
            || body.label === 'Player'
            || body.label === 'star-ball'
            || body.label === 'ice-ball'
            || body.label === 'fire-ball') {
                this.removeBody(body)
            }
        });
        this.bodies = [];

        this.player.onUpdate(this.world);

        const pipe = new Pipe();

        // show level welcome
        pipe.add(()=>{
            this.showCoverText(`Level ${level.id}`);
        }, 2000);

        pipe.add(()=>{

            this.state.status = 'playing';

            const levelData = this.state.levelData;

            this.boardCanvas.clear();
            this.boardCanvas.setBackgroundColor('#000');
            this.boardCanvas.setDimensions({
                width: window.innerWidth,
                height: 24,
            });
            this.boardCanvas.add(this.state.boardText);

            this.wordGravity = levelData.wordGravity;

            this.saltFactory = new GameSalt();

            // init maze
            this.maze = this.createMaze();
            const player = this.state.player;

            this.player.resetBody();
            this.addBody(this.player.body);
            window.w = this.world;
        }, 0);

        pipe.run();
    }

}

const main = new Main();
