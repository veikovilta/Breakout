import Brain, { BrickField } from "./brain.js";
import UI, {drawStartPage} from "./ui.js";

let animationNumber = 0; 
let bestScores = []; 

function validateIndexHtml() {
    if (document.querySelectorAll("#app").length != 1) {
        throw Error("More or less than one div with id 'app' found!");
    }
    /*
    if (document.querySelectorAll("div").length != 1) {
        throw Error("More or less than one div found in index.html!");
    }
    */
}

function uiDrawRepeater(ui, brain) {
    function drawFrame() {
        ui.drawBallActive();  
        let gameState = brain.ballMovement(ui); 

        if(typeof gameState === 'object'){
            ui.drawActiveBrickField(gameState); 
        }

        if(gameState === "game over"){
            bestScores.push(brain.score); 
            ui.appContainer.innerHTML = ""; 
            startPage(bestScores).then(main);
        }
        else{
            animationNumber = requestAnimationFrame(drawFrame);
        }
    }
    animationNumber = requestAnimationFrame(drawFrame);
}

const repeater = (brain) => {
    setTimeout(() => {
        console.log("state changed")
        brain.lastState = 0;
        repeater(brain);
    }, 1000)
}

function startPage(bestScores) {
    return new Promise((resolve) => {
      let startingPage = drawStartPage(bestScores);
      console.log("best scores: " + bestScores);  
  
      document.querySelector("#start-button").addEventListener("click", () => {
          startingPage.remove();
          resolve(); 
      });
    });
}

function pausePage(ui){
    return new Promise((resolve) => {
        let pausePage = ui.drawPausePage(); 
    
        document.querySelector("#continue-button").addEventListener("click", () => {
            pausePage.remove();
            resolve(); 
        });
    });
}

function main() {
    validateIndexHtml();
    let appDiv = document.querySelector("#app");
    let brain = new Brain();
    let ui = new UI(brain, appDiv);

    window.addEventListener('resize', (e) => {
        console.log("screensize changed");
        ui.drawAllEle();  
    });

    document.addEventListener('keydown', (e) => {
        //console.log("pushed");
        switch (e.key) {
            case 'ArrowLeft':
                brain.startMovePaddle(brain.paddle, -1);
                break;
            case 'ArrowRight':
                brain.startMovePaddle(brain.paddle, 1);
                break;
        } 
    });

    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'ArrowLeft':
                brain.stopMovePaddle(brain.paddle);
                break;
            case 'ArrowRight':
                brain.stopMovePaddle(brain.paddle);
                break;
        } 
    });

    ui.drawAllEle(); 

    document.querySelector("#pause-button").addEventListener("click", () => {
        cancelAnimationFrame(animationNumber); 
        pausePage(ui).then(() => uiDrawRepeater(ui, brain)); 
    });

    repeater(brain);
    // draw ui as fast as possible - on repeat
    uiDrawRepeater(ui, brain);
}

// =============== ENTRY POINT ================
console.log("App startup...");

startPage(bestScores).then(main);


