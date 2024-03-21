export function drawStartPage(bestScores){
    let mainDiv = document.querySelector("#app");
    mainDiv.classList.add('app-container'); 

    let startingPage = document.createElement("div");
    startingPage.id = "starting-page";
    startingPage.classList.add('start-page');

    let breakOutText = document.createElement('div');
    breakOutText.classList.add('breakout-text'); 
    breakOutText.innerHTML = `BREAKOUT`;
    
    let buttons = document.createElement('div'); 
    buttons.classList.add('button-container-start');
    
    let startButton = document.createElement("button");
    startButton.classList.add('button-start'); 
    startButton.id = 'start-button';
    startButton.textContent = 'Start';

    buttons.appendChild(startButton); 

    startingPage.appendChild(breakOutText);
    startingPage.appendChild(buttons);

    mainDiv.appendChild(startingPage);

    drawHighscores(mainDiv, bestScores); 

    return startingPage;
}

function drawHighscores(appDiv, bestScores){
    
    let highScores = document.createElement('div'); 
    highScores.classList.add('highscores-container'); 

    let highScoresText = document.createElement('div');
    highScores.classList.add('highscore-text'); 
    highScores.innerHTML = `Best 5 scores`;

    highScores.appendChild(highScoresText);

    bestScores = bestScores.filter((number, index) => {
        return bestScores.indexOf(number) === index;
    });

    bestScores = bestScores.sort((a, b) => b - a);

    let i = 1; 

    bestScores.forEach(element => {

        if(i > 5){
            return; 
        }
        else{
            let highScore = document.createElement('div');
            highScore.classList.add('highscore'); 
            highScore.innerHTML = i + `) ` + element + ' points';
            highScores.appendChild(highScore); 
            i++; 
        }

    });

    appDiv.appendChild(highScores); 
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
        this.drawBorderSingle(0, 0, this.width, 2 * this.calculateScaledY(this.brain.borderThickness), 'black');
        // left
        this.drawBorderSingle(0, 0, this.calculateScaledX(this.brain.borderThickness), this.height, 'black');
        // right
        this.drawBorderSingle(this.width - this.calculateScaledX(this.brain.borderThickness), 0, this.calculateScaledX(this.brain.borderThickness), this.height, 'black');
        this.drawBorderSingle(0, this.height - this.calculateScaledY(this.brain.borderThickness), this.width, this.calculateScaledY(this.brain.borderThickness), 'red');
    }

    drawPaddle(paddle){
        let div = document.createElement('div');

        div.classList.add('paddle'); 

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
        this.drawLiveScore();
        this.drawPauseButton(); 
    }

    drawBallActive() {
        this.setScreenDimensions();
        let ballDivs = document.querySelectorAll('div[style*="blue"]');
      
        if (ballDivs.length > 0) {
            let ballDiv = ballDivs[0];
            ballDiv.style.left = this.calculateScaledX(this.brain.ball.left) + 'px';
            ballDiv.style.top = this.calculateScaledY(this.brain.ball.top) + 'px';
        } else {
            this.drawBall(this.brain.ball);
        }
      
        let paddleDivs = document.querySelectorAll('.paddle');
      
        if (paddleDivs.length > 0) {
            let paddleDiv = paddleDivs[0];
            paddleDiv.style.left = this.calculateScaledX(this.brain.paddle.left) + 'px';
            paddleDiv.style.top = this.calculateScaledY(this.brain.paddle.top) + 'px';
        } else {
            this.drawPaddle(this.brain.paddle);
        }
    }

    drawActiveBrickField(pos) {
        this.setScreenDimensions();
        
        let brickDivs = document.querySelectorAll('.single-brick');

        if (brickDivs.length > 0) {
            brickDivs.forEach(brickDiv => {
                brickDiv.parentNode.removeChild(brickDiv);
            });
        }

        this.drawBrickField(this.brain.brickField); 

        let scoreDivs = document.querySelectorAll('.live-score');

        if (scoreDivs.length > 0) {
            scoreDivs.forEach(scoreDiv => {
                scoreDiv.parentNode.removeChild(scoreDiv);
            });
        }

        this.drawLiveScore(); 
    }

    drawLiveScore(){

        let score = document.createElement('div');
        score.classList.add('live-score'); 
        score.innerHTML = `SCORE: ` + this.brain.score;

        this.appContainer.appendChild(score); 
    }

    drawPauseButton(){

        let pauseButtonCont = document.createElement('div'); 
        pauseButtonCont.classList.add('button-container-pause');
        
        let pauseButton = document.createElement("button");
        pauseButton.classList.add('button-pause'); 
        pauseButton.id = 'pause-button';
        pauseButton.textContent = 'Pause';

        pauseButtonCont.appendChild(pauseButton); 

        this.appContainer.appendChild(pauseButtonCont); 
    }

    drawPausePage(){

        let continueButtonCont = document.createElement('div'); 
        continueButtonCont.classList.add('button-container-continue');
        
        let continueButton = document.createElement("button");
        continueButton.classList.add('button-continue'); 
        continueButton.id = 'continue-button';
        continueButton.textContent = 'continue';

        continueButtonCont.appendChild(continueButton);

        this.appContainer.appendChild(continueButtonCont); 

        return continueButtonCont;
    }
}
