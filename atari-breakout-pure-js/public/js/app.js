import Brain from "./brain.js";
import UI, {drawStartPage} from "./ui.js";

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

        if(gameState ===  "game over"){
            ui.appContainer.innerHTML = ""; 
            startPage().then(main);
        }
        else{
            requestAnimationFrame(() => drawFrame());
        }
    }
    drawFrame();
}

const repeater = (brain) => {
    setTimeout(() => {
        console.log("state changed")
        brain.lastState = 0;
        repeater(brain);
    }, 1000)
}

function startPage() {
    return new Promise((resolve) => {
      let startingPage = drawStartPage();
      console.log("hello");  
      // Add event listener to the start button
  
      document.querySelector("#start-button").addEventListener("click", () => {
          // Remove the starting page
          startingPage.remove();
          // Resolve the promise to continue with the game
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
        console.log("pushed");
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

    repeater(brain);
    // draw ui as fast as possible - on repeat
    uiDrawRepeater(ui, brain);
}

// =============== ENTRY POINT ================
console.log("App startup...");

startPage().then(main);


