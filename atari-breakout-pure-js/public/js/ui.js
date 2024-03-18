import Brain, { Paddle } from "./brain.js";

export function drawStartPage(){
    let mainDiv = document.querySelector("#app");

    let startingPage = document.createElement("div");
    startingPage.id = "starting-page";
    startingPage.classList.add('start-page');
    startingPage.innerHTML = `<h1>Welcome to the Game!</h1>`;

    let startButton = document.createElement("button");
    startButton.id = 'start-button';
    startButton.textContent = 'Start'; // Add text content to the button

    startingPage.appendChild(startButton); // Append the button to the startingPage div

    mainDiv.appendChild(startingPage);

    return startingPage;
}

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
        div.style.borderRadius = 10 + "%"; 

        this.appContainer.append(div);
    }

    drawBall(ball){
        let ballUI = document.createElement('div');

        ballUI.style.zIndex = "10";
        ballUI.style.position = 'fixed';
        ballUI.id = "ballid";
        
        ballUI.style.top = this.calculateScaledY(ball.top) + 'px';
        ballUI.style.left = this.calculateScaledX(ball.left) + 'px';
        
        ballUI.style.width = this.calculateScaledX(ball.width) + 'px';
        ballUI.style.height = this.calculateScaledY(ball.height) + 'px';
        ballUI.style.backgroundColor = ball.color;  
        //ballUI.style.borderRadius = 50 + '%';

        this.appContainer.append(ballUI);
    }

    drawSingleBrick(top, left, width, height, color, count){
    
        let brick = document.createElement('div');

        brick.classList.add('single-brick'); 

        brick.style.top = top + 'px'; 
        brick.style.left = left + 'px'; 

        brick.style.width = width + 'px';
        brick.style.height = height + 'px'; 

        brick.style.backgroundColor = color; 
        brick.innerHTML = "" + count;

        this.appContainer.append(brick);
    } 

    drawBrickField(brickField){

        for(let i = 0; i < brickField.brickRowCount; i++){
            for(let j = 0; j < brickField.brickColumnCount; j++)
            if(brickField.matrix[i][j]){
                this.drawSingleBrick(this.calculateScaledY(brickField.firstBrickTop) + 
                    i * this.calculateScaledY(brickField.brickOffsetTop) + 
                    i * this.calculateScaledY(brickField.brickHeight), 
                    this.calculateScaledX(brickField.firstBrickLeft) + 
                    j * this.calculateScaledX(brickField.brickOffsetLeft) + 
                    j * this.calculateScaledX(brickField.brickWidth), 
                    this.calculateScaledX(brickField.brickWidth), 
                    this.calculateScaledY(brickField.brickHeight), 
                    brickField.brickColor, brickField.matrix[i][j]);   
            }
        }
    }

    drawAllEle(){
        // clear previous render
        // TODO: optimize - change elems, do not recreate on every frame!!!!!
        this.appContainer.innerHTML = '';
        this.setScreenDimensions();

        this.drawBorder();
        this.drawPaddle(this.brain.paddle);
        this.drawBall(this.brain.ball);
        this.drawBrickField(this.brain.brickField); 
        //console.log(this.appContainer.innerHTML); 
    }

    drawBallActive() {
        this.setScreenDimensions();
        const ballDivs = document.querySelectorAll('div[style*="blue"]');
      
        if (ballDivs.length > 0) {
            const ballDiv = ballDivs[0];
            ballDiv.style.left = this.calculateScaledX(this.brain.ball.left) + 'px';
            ballDiv.style.top = this.calculateScaledY(this.brain.ball.top) + 'px';
        } else {
            this.drawBall(this.brain.ball);
        }
      
        const paddleDivs = document.querySelectorAll('div[style*="green"]');
      
        if (paddleDivs.length > 0) {
            const paddleDiv = paddleDivs[0];
            paddleDiv.style.left = this.calculateScaledX(this.brain.paddle.left) + 'px';
            paddleDiv.style.top = this.calculateScaledY(this.brain.paddle.top) + 'px';
        } else {
            this.drawPaddle(this.brain.paddle);
        }
    }

    drawActiveBrickField(pos) {
        this.setScreenDimensions();
        
        const brickDivs = document.querySelectorAll('div[style*="black"]');

        if (brickDivs.length > 0) {
            brickDivs.forEach(brickDiv => {
                brickDiv.parentNode.removeChild(brickDiv);
            });
        }

        this.drawBrickField(this.brain.brickField); 

    }
}
