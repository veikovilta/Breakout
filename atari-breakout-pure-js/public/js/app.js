import Brain from "./brain.js";
import UI from "./ui.js";

function validateIndexHtml() {
    if (document.querySelectorAll("#app").length != 1) {
        throw Error("More or less than one div with id 'app' found!");
    }
    if (document.querySelectorAll("div").length != 1) {
        throw Error("More or less than one div found in index.html!");
    }
}

function uiDrawRepeater(ui, brain){
    setTimeout(() => {
        ui.draw(); 
        brain.ballMovement(ui); 
        uiDrawRepeater(ui, brain);
    }, 0);
}

function main() {
    validateIndexHtml();
    let appDiv = document.querySelector("#app");
    let brain = new Brain();
    let ui = new UI(brain, appDiv);

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

    // draw ui as fast as possible - on repeat
    uiDrawRepeater(ui, brain);
}


// https://stackoverflow.com/questions/64752006/calculate-a-position-based-on-an-angle-a-speed-and-a-starting-position

// =============== ENTRY POINT ================
console.log("App startup...");
main();
