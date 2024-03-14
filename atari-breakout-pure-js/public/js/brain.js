export class Paddle {
    _width = 50;
    _height = 200;

    intervalId = undefined;

    constructor(_left, _top,_color = "blue") {
    }

    get left() {
        return this._left;
    }

    get top() {
        return this._top;
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
        if (this._top < borderThickness) {
            this._top = borderThickness;
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }

        if ((this._top + this._height) > 1000 - borderThickness) {
            this._top = (1000 - borderThickness) - (this._height);
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }

        console.log(this._top);
    }

    startMove(step, borderThickness){
        if (this.intervalId !== undefined) return;

        this.intervalId = setInterval(() => {
            this._top += step * 30;
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

}


export default class Brain {
    width = 1000;
    height = 1000;
    borderThickness = 30;

    leftPaddle = new Paddle(50, 200, 'green');
    rightPaddle = new Paddle(900, 200, 'blue');

    constructor() {
        console.log("Brain ctor");
    }

    startMovePaddle(paddle, step){
        paddle.startMove(step, this.borderThickness);
    }

    stopMovePaddle(paddle) {
        paddle.stopMove(this.borderThickness);
    }

}
