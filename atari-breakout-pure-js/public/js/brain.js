export class Paddle {
    _width = 100;
    _height = 10;

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

        console.log(this.left);
    }

    startMove(step, borderThickness){
        if (this.intervalId !== undefined) return;

        this.intervalId = setInterval(() => {
            this.left += step * 30;
            // 0 - border
            this.validateAndFixPosition(borderThickness);

        }, 40);

    }

    stopMove(borderThickness){
        if (!this.intervalId) return;
        clearInterval(this.intervalId);
        this.intervalId = undefined;
        this.validateAndFixPosition(borderThickness);
    }
}

export class Ball {
    
    _width = 15;
    _height = 15;
    
    leftStep = 1;
    topStep = 1;  

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

    checkBrickCollision(brickField){
        
        for(let i = 0; i < brickField.brickColumnCount; i++){
            if(!this.checkSingleBrickCollision(brickField.firstBrickTop, 
                brickField.firstBrickLeft + i * brickField.brickOffsetLeft + 
                i * brickField.brickWidth, brickField.brickWidth, brickField.brickHeight)){
                   
                brickField.array[i] = 1; 

            }
        }

    }

    checkSingleBrickCollision(brickTop, brickLeft, brickHeight, brickWidth){
        //check brick top
        if(this.top + this._height === brickTop && !((this.left < brickLeft) || this.left > brickLeft + brickWidth)){
            return false; 
        }

        //check brick bottom side
        if((this.top - (brickTop + brickHeight) < 10) && !((this.left < brickLeft) || this.left > brickLeft + brickWidth)){
            return false; 
        }
        
        return true; 
    }

    checkPaddleCollision(paddleTop, paddleLeft, paddleWidth){
        if((this.top + this.height > paddleTop) && !((this.left < paddleLeft) || this.left > paddleLeft + paddleWidth)){
            return false; 
        }
        return true
    }

    checkLeftCollision(winWidth, borderThickness){  
        if (this.left + this._width > winWidth - borderThickness || this.left < borderThickness) {
            return false; 
        }
        return true; 
    }

    checkTopCollision(winHeight, borderThickness){    
        if (this.top + this.height > winHeight - borderThickness || this.top < borderThickness) {
            return false;
        }
        return true; 
    }

    moveBall(stepTop, stepLeft){
        this.top += stepTop;
        this.left += stepLeft; 
    }

}

export class BrickField{

    _brickRowCount = 3;
    _brickColumnCount = 5;
    _brickWidth = 75;
    _brickHeight = 20;
    _brickPadding = 10;
    _brickOffsetTop = 30;
    _brickOffsetLeft = 30;

    array = new Array(this.brickColumnCount).fill(0);

    constructor(top, left, color){
        this.firstBrickTop = top; 
        this.firstBrickLeft = left;
        this._brickColor = color; 
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

    paddle = new Paddle(100, 900, 'green');
    ball = new Ball(300, 100, "blue"); 
    brickField = new BrickField( 50, 100, "black"); 

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
        if(!this.ball.checkTopCollision(ui.height, ui.calculateScaledY(this.borderThickness))){
            this.ball.topStep = -this.ball.topStep;  
        }
       
        if(!this.ball.checkLeftCollision(ui.width, ui.calculateScaledX(this.borderThickness))){
            this.ball.leftStep = -this.ball.leftStep; 
        }
    
        if(!this.ball.checkPaddleCollision(ui.calculateScaledY(this.paddle.top), this.paddle.left, this.paddle.width)){
            this.ball.topStep = -this.ball.topStep;
            this.ball.leftStep = parseFloat((Math.random() * (1 - (-1)) + (-1)).toFixed(2));
            console.log(this.ball.leftStep);   
        }

        this.ball.checkBrickCollision(this.brickField); 
        //console.log(this.ball.top);  
        this.ball.moveBall(this.ball.topStep, this.ball.leftStep); 
    }
}
