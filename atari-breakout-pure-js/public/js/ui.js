import Brain, { Paddle } from "./brain";

export default class UI {
    // real screen dimensions
    width = -1;
    height = -1;


    scaleX = 1;
    scaleY = 1;

    constructor(brain, appContainer) {
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

    draw(){
        // clear previous render
        // TODO: optimize - change elems, do not recreate on every frame!!!!!
        this.appContainer.innerHTML = '';
        this.setScreenDimensions();

        this.drawBorder();
        this.drawPaddle(this.brain.leftPaddle);
        this.drawPaddle(this.brain.rightPaddle);
    }
}