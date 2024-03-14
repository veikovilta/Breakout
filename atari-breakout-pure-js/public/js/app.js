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

function uiDrawRepeater(ui){
    setTimeout(() => {
        ui.draw(); 
        uiDrawRepeater(ui);
    }, 0);
}

function main() {
    console.log("hello wrold"); 
    validateIndexHtml();
    let appDiv = document.querySelector<HTMLDivElement>("#app");
    let brain = new Brain();
    let ui = new UI(brain, appDiv);

    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case 'q':
                brain.startMovePaddle(brain.leftPaddle, -1);
                break;
            case 'a':
                brain.startMovePaddle(brain.leftPaddle, 1);
                break;
            case 'o':
                brain.startMovePaddle(brain.rightPaddle, -1);
                break;
            case 'l':
                brain.startMovePaddle(brain.rightPaddle, 1);
                break;
        }
    });

    document.addEventListener('keyup', (e) => {
        switch (e.key) {
            case 'q':
                brain.stopMovePaddle(brain.leftPaddle);
                break;
            case 'a':
                brain.stopMovePaddle(brain.leftPaddle);
                break;
            case 'o':
                brain.stopMovePaddle(brain.rightPaddle);
                break;
            case 'l':
                brain.stopMovePaddle(brain.rightPaddle);
                break;
        }

    });

    // draw ui as fast as possible - on repeat
    uiDrawRepeater(ui);
}


// https://stackoverflow.com/questions/64752006/calculate-a-position-based-on-an-angle-a-speed-and-a-starting-position

// =============== ENTRY POINT ================
console.log("App startup...");
main();
