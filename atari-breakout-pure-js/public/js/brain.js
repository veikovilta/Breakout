export class Paddle {
    _width = 100;
    _height = 30;

    intervalId = undefined;

    constructor(left, top, color) {
        this.left = left; 
        this.top = top; 
        this._color = color; 
    }

    get width() {
        return this._width;
    }
    
    get height() {
        return this._height;
    }

    get color() {
        return this._color;
    }

    validateAndFixPosition(borderThickness){
        if (this.left < borderThickness) {
            this.left = borderThickness;
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }

        if ((this.left + this.width) > 1000 - borderThickness) {
            this.left = (1000 - borderThickness) - (this._width);
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }

    startMove(step, borderThickness, ui){
        if (this.intervalId !== undefined) return;
        this.intervalId = setInterval(() => {
            this.left += step * 10;
            // 0 - border
            this.validateAndFixPosition(borderThickness);
        }, 10);

    }

    stopMove(borderThickness){
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
        this.validateAndFixPosition(borderThickness);
    }

}

export function randomValue(min, max){
    return (Math.random() * (max - min) + (min)).toFixed(0); 
}

export class Ball {
    
    _width = 15;
    _height = 30;

    constructor(left, top, color, leftStep, topStep) {
        this.left = left; 
        this.top = top;
        this.leftStep = leftStep;
        this.topStep = topStep;  
        this._color = color; 
    }

    get width() {
        return this._width;
    }
    
    get height() {
        return this._height;
    }

    get color() {
        return this._color;
    }

    checkBrickCollision(brickField, ui){
        
        for(let i = 0; i < brickField.brickRowCount; i++){
            for(let j = 0; j < brickField.brickColumnCount; j++){
                if(brickField.matrix[i][j]){
                    if(!this.checkSingleBrickCollision(ui.calculateScaledY(brickField.firstBrickTop)+
                        i * ui.calculateScaledY(brickField.brickOffsetTop) + 
                        i * ui.calculateScaledY(brickField.brickHeight), 
                        ui.calculateScaledX(brickField.firstBrickLeft) + 
                        j * ui.calculateScaledX(brickField.brickOffsetLeft) + 
                        j * ui.calculateScaledX(brickField.brickWidth), 
                        ui.calculateScaledY(brickField.brickHeight), 
                        ui.calculateScaledX(brickField.brickWidth),
                        ui.calculateScaledY(this.top),
                        ui.calculateScaledX(this.left),
                        ui.calculateScaledX(this.width),
                        ui.calculateScaledY(this.height), ui)){ 

                        brickField.matrix[i][j] -= 1;
                        return {i, j}; 

                    }
                }
            }

        }

        return {}; 
    }

    checkSingleBrickCollision(brickTop, brickLeft, brickHeight, brickWidth, ballTop, ballLeft, ballWidth, ballHeight, ui){

        if (brickLeft < ballLeft && ballLeft < brickLeft + brickWidth) {
            // Check for top and bottom collisions first
            // Top
            if (ballTop < brickTop && ballTop + ballHeight >= brickTop) {
                console.log("top");
                this.topStep = -this.topStep;
                //this.leftStep = -this.leftStep;
                return false;
            }
            // Bottom
            else if (ballTop > brickTop && ballTop < brickTop + brickHeight) {
                console.log("bottom");
                this.topStep = -this.topStep;
                //this.leftStep = -this.leftStep;
                return false;
            }
        }
        
        if (ballTop > brickTop - ballHeight && ballTop < brickTop + brickHeight) {
            // Check for left and right collisions
            // Left
            if (ballLeft + ballWidth > brickLeft - 3 && ballLeft + ballWidth < brickLeft + brickWidth) {//little offset to detect earlier
                console.log("left");
                this.topStep = -this.topStep;
                this.leftStep = -this.leftStep;
                return false;
            }
            // Right
            else if (ballLeft < brickLeft + brickWidth + 5 && ballLeft > brickLeft) {//little offset to detect earlier 
                console.log("right");
                this.topStep = -this.topStep;
                this.leftStep = -this.leftStep;
                return false;
            }
        }

        return true; 
    }

    checkPaddleCollision(paddleTop, paddleLeft, paddleWidth, paddleHeight, ballLeft, ballWidth, ballTop, ballHeight){
        if(ballTop + ballHeight > paddleTop){
            if (!((ballLeft + ballWidth < paddleLeft) || ballLeft > paddleLeft + paddleWidth)){
                this.lastState = 1;
                console.log("paddle width: " + paddleWidth);
                
                if(paddleLeft + 0.2 * paddleWidth > ballLeft){
                    console.log("1");
                    this.leftStep = -8;
                }
                else if(paddleLeft + 0.4 * paddleWidth > ballLeft){
                    console.log("2");
                    this.leftStep = -4;
                }
                else if(paddleLeft + 0.6 * paddleWidth > ballLeft){
                    console.log("3");
                    this.leftStep = 0;
                }
                else if(paddleLeft + 0.8 * paddleWidth > ballLeft){
                    console.log("4");
                    this.leftStep = 4;
                }
                else if(paddleLeft + 1 * paddleWidth > ballLeft){
                    console.log("5");
                    this.leftStep = 8;
                }

                return false; 
            }  
        }
        return true; 
    }

    checkLeftCollision(winWidth, borderThickness, ballLeft, ballWidth){  
        if (ballLeft + ballWidth > winWidth - borderThickness || ballLeft < borderThickness) {
            return false; 
        }
        return true; 
    }

    checkTopCollision(winHeight, borderThickness, ballTop, ballHeight){    
        if (ballTop < borderThickness * 2) {
            return 1;
        }
        else if(ballTop + ballHeight > winHeight - borderThickness){
            return 2
        }
        return 0; 
    }

    moveBall(stepTop, stepLeft){
        this.top += stepTop;
        this.left += stepLeft; 
    }

}

export class BrickField{

    _brickRowCount = 5;
    _brickColumnCount = 10;
    _brickWidth = 75;
    _brickHeight = 40;
    _brickPadding = 10;
    _brickOffsetTop = 30;
    _brickOffsetLeft = 10;

    matrix = this.fillMatrix(this._brickRowCount, this._brickColumnCount); 

    constructor(top, left, color){
        this.firstBrickTop = top; 
        this.firstBrickLeft = left;
        this._brickColor = color; 
    }

    fillMatrix(rows , cols){

        let newMatrix = Array.from({ length: rows }, () => 
            Array.from({ length: cols }, () =>
                randomValue(1, 5)
            )
        );

        return newMatrix; 
    }

    checkIfBricksAreGone(){

        if(this.matrix.every(row => row.every(element => element === 0))){
            this.matrix = this.fillMatrix(this.brickRowCount, this.brickColumnCount); 
        }
    }

    get brickColor(){
        return this._brickColor; 
    }

    get brickRowCount() {
        return this._brickRowCount;
    }

    get brickColumnCount() {
        return this._brickColumnCount;
    }

    get brickWidth() {
        return this._brickWidth;
    }

    get brickHeight() {
        return this._brickHeight;
    }

    get brickPadding() {
        return this._brickPadding;
    }

    get brickOffsetTop() {
        return this._brickOffsetTop;
    }

    get brickOffsetLeft() {
        return this._brickOffsetLeft;
    }
}

export default class Brain {
    width = 1000;
    height = 1000;
    borderThickness = 30;

    score = 0; 

    lastState = 0; 

    ballLeft = 400; 
    ballTop = 450;
    ballLeftStep = 0; 
    ballTopStep = -8;  

    paddle = new Paddle(100, 900, 'green');
    ball = new Ball(this.ballLeft, this.ballTop, "blue", this.ballLeftStep, this.ballTopStep); 
    brickField = new BrickField( 100, 80, "grey"); 

    constructor() {
        console.log("Brain ctor");
    }

    startMovePaddle(paddle, step){
        paddle.startMove(step, this.borderThickness);
    }

    stopMovePaddle(paddle) {
        paddle.stopMove(this.borderThickness);
    }

    ballMovement(ui){
        
        let topCollision = this.ball.checkTopCollision(ui.height, ui.calculateScaledY(this.borderThickness),
                                ui.calculateScaledY(this.ball.top), ui.calculateScaledY(this.ball.height)); 

        if(topCollision == 1){
            this.ball.topStep = -this.ball.topStep;  
        }
        else if(topCollision == 2){ 
            return "game over"; 
        }
       
        if(!this.ball.checkLeftCollision(ui.width, ui.calculateScaledX(this.borderThickness), 
            ui.calculateScaledX(this.ball.left), ui.calculateScaledX(this.ball.width))){
            this.ball.leftStep = -this.ball.leftStep; 
        }
        
        let paddleCollision = this.ball.checkPaddleCollision(ui.calculateScaledY(this.paddle.top), 
                                ui.calculateScaledX(this.paddle.left), ui.calculateScaledX(this.paddle.width),
                                ui.calculateScaledY(this.paddle.height), 
                                ui.calculateScaledX(this.ball.left), ui.calculateScaledX(this.ball.width),
                                ui.calculateScaledY(this.ball.top), ui.calculateScaledY(this.ball.height));   
        if(!paddleCollision){

            if(paddleCollision === false && this.lastState === 0){
                this.ball.topStep = -this.ball.topStep;
                //this.ball.leftStep = parseFloat((Math.random() * (8 - (-8))
                                                     //+ (-8)).toFixed(2));
                this.lastState = paddleCollision;
            }
            
        }

        let result = this.ball.checkBrickCollision(this.brickField, ui); 

        if(Object.keys(result).length !== 0){
            this.ball.moveBall(this.ball.topStep, this.ball.leftStep);
            this.score++; 
            console.log("score: " + this.score); 
            return result; 
        } 
          
        this.ball.moveBall(this.ball.topStep, this.ball.leftStep); 

        return "game on"; 
    }
}


