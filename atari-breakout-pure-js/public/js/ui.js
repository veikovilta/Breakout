import Brain, { Paddle } from "./brain.js";

export default class UI {
    // real screen dimensions
    width = -1;
    height = -1;

    scaleX = 1;
    scaleY = 1;

    constructor(brain, appContainer) {
        this.brain = brain; // Assigning the brain parameter to an instance property
        this.appContainer = appContainer;
        this.setScreenDimensions();
        
        console.log(this);
    }

    setScreenDimensions(width, height) {
        this.width = width || document.documentElement.clientWidth;
        this.height = height || document.documentElement.clientHeight;

        this.scaleX = this.width / this.brain.width;
        this.scaleY = this.height / this.brain.height;
    }

    calculateScaledX(x){
        return x * this.scaleX | 0;
    }

    calculateScaledY(y){
        return y * this.scaleY | 0;
    }

    drawBorderSingle(left, top, width, height, color){
        let border = document.createElement('div');

        border.style.zIndex = "10";
        border.style.position = 'fixed';

        border.style.left = left + 'px';
        border.style.top = top + 'px';

        border.style.width = width + 'px';
        border.style.height = height + 'px';
        border.style.backgroundColor = color;

        this.appContainer.append(border);
    }

    drawBorder(){
        // top border
        this.drawBorderSingle(0, 0, this.width, this.calculateScaledY(this.brain.borderThickness), 'red');
        // left
        this.drawBorderSingle(0, 0, this.calculateScaledX(this.brain.borderThickness), this.height, 'red');
        // right
        this.drawBorderSingle(this.width - this.calculateScaledX(this.brain.borderThickness), 0, this.calculateScaledX(this.brain.borderThickness), this.height, 'red');
        this.drawBorderSingle(0, this.height - this.calculateScaledY(this.brain.borderThickness), this.width, this.calculateScaledY(this.brain.borderThickness), 'red');
    }

    drawPaddle(paddle){
        let div = document.createElement('div');

        div.style.zIndex = "10";
        div.style.position = 'fixed';

        div.style.left = this.calculateScaledX(paddle.left) + 'px';
        div.style.top = this.calculateScaledY(paddle.top) + 'px';

        div.style.width = this.calculateScaledX(paddle.width) + 'px';
        div.style.height = this.calculateScaledY(paddle.height) + 'px';

        div.style.backgroundColor = paddle.color;

        this.appContainer.append(div);
    }

    drawBall(ball){
        let ballUI = document.createElement('div');

        ballUI.style.zIndex = "10";
        ballUI.style.position = 'fixed';
        
        ballUI.style.top = ball.top + 'px';
        ballUI.style.left = ball.left + 'px';
        
        ballUI.style.width = ball.width + 'px';
        ballUI.style.height = ball.height + 'px';
        ballUI.style.backgroundColor = ball.color;
        ballUI.style.borderRadius = 50 + '%';

        this.appContainer.append(ballUI);
    }

    drawSingleBrick(top, left, width, height, color){
    
        let brick = document.createElement('div');

        brick.style.zIndex = "10";
        brick.style.position = 'fixed';

        brick.style.top = top + 'px'; 
        brick.style.left = left + 'px'; 

        brick.style.width = width + 'px';
        brick.style.height = height + 'px'; 

        brick.style.backgroundColor = color; 

        this.appContainer.append(brick);
    } 

    drawBrickField(brickField){

        for(let i = 0; i < brickField.brickColumnCount; i++){
            if(!brickField.array[i]){
                this.drawSingleBrick(brickField.firstBrickTop, brickField.firstBrickLeft + i * brickField.brickOffsetLeft + 
                    i * brickField.brickWidth, brickField.brickWidth, 
                    brickField.brickHeight, brickField.brickColor);   
            }

        }
    }

    draw(){
        // clear previous render
        // TODO: optimize - change elems, do not recreate on every frame!!!!!
        this.appContainer.innerHTML = '';
        this.setScreenDimensions();

        this.drawBorder();
        this.drawPaddle(this.brain.paddle);
        this.drawBall(this.brain.ball);
        this.drawBrickField(this.brain.brickField); 
    }
}