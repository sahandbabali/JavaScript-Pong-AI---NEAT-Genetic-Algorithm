let canvas;
let ball, displayfont;
let go = true;

let playing = false
let TOTAL = 500
let paddles = []
let generation = 1

let lastsavedpaddle
let score = 0

let popcountui = document.getElementById("popcountui")
let gencountui = document.getElementById("gencountui")
let scoreui = document.getElementById("scoreui")

let playbtn = document.getElementById("playbtn")

playbtn.addEventListener("click", e => {
    playing = true
    loop()
})

let pausebtn = document.getElementById("pausebtn")
pausebtn.addEventListener("click", e => {
    playing = false
})


let forcerebtn = document.getElementById("forcerebtn")
forcerebtn.addEventListener("click", e => {


    score = 0
    scoreui.innerText = score

    const highestScoreObject = paddles.reduce((prev, current) => {
        return (prev.score > current.score) ? prev : current;
    });

    // console.log(highestScoreObject)
    lastsavedpaddle = highestScoreObject


    nextGeneration()

})





function preload() {
    displayfont = loadFont('PixelifySans.TTF');
}
function setup() {
    // Create a canvas inside the "canvasbox" div
    let canvasDiv = select('#canvasbox');
    let canvasSize = canvasDiv.width
    canvas = createCanvas(canvasSize, canvasSize / 2);
    canvas.parent('canvasbox');
    frameRate(30)


    ball = new Ball(width / 2, height / 2, 30, 10);


    for (let index = 0; index < TOTAL; index++) {
        paddles.push(new Paddle())
    }
    popcountui.innerText = paddles.length





}

function draw() {
    background("#B2C8BA");
    backdrop();



    for (let index = 0; index < paddles.length; index++) {
        paddles[index].think()
    }


    // remove the paddles that touch walls
    for (let index = 0; index < paddles.length; index++) {

        if (paddles[index].pos.y == 0 || paddles[index].pos.y == height - paddles[index].h) {
            // remove the paddle
            paddles.splice(index, 1)
            console.log("removed because of touching walls")

            // update ui
            popcountui.innerText = paddles.length



            if (paddles.length === 1) {
                score = 0
                scoreui.innerText = score

                //     lastsavedpaddle = paddles[0]
                // const highestScoreObject = paddles.reduce((prev, current) => {
                //     return (prev.score > current.score) ? prev : current;
                // });

                // console.log(highestScoreObject)
                //  lastsavedpaddle = highestScoreObject
                lastsavedpaddle = paddles[0]

                nextGeneration()
            }
        }

    }


    movePaddles();


    for (let index = 0; index < paddles.length; index++) {
        paddles[index].show()
    }




    let oob = ball.outOfBounds();
    if (oob) {


        score = 0
        scoreui.innerText = score
        // the ball stays at spawn till go = true
        //  go = false;


        // remove 10 agents with the least scores
        // if paddles array length == 0  => repopulate
        // if array length == 1 or any size => choose a paddle with highest score and mutate and repopulate
        const highestScoreObject = paddles.reduce((prev, current) => {
            return (prev.score > current.score) ? prev : current;
        });


        if (highestScoreObject.score > 0) {
            lastsavedpaddle = highestScoreObject

        }



        // console.log(highestScoreObject)



        nextGeneration()


    }

    if (go) ball.update();


    let temp = false
    for (let index = 0; index < paddles.length; index++) {

        if (ball.hit(paddles[index])) {
            temp = true
        }
    }


    if (temp == true) {
        score += 1
        scoreui.innerText = score

    }

    ball.show()










    if (playing == false) {
        noLoop()
    }
}




function movePaddles() {
    // up arrow 38
    if (keyIsDown(38)) {
        paddles[0].move(-15);
    }

    // down arrow 40
    if (keyIsDown(40)) {
        paddles[0].move(15);
    }

}

function keyTyped() {
    if (key == ' ') {
        go = true;
    }

    if (key == 'r') {
        //   p1.score = 0;
        //  p2.score = 0;
        ball.resetball();
        go = false;
    }

    // for safety
    return false;
}

function normalizeValue(value, minValue, maxValue) {
    // Ensure the value is within the specified range
    value = Math.max(minValue, Math.min(value, maxValue));

    // Calculate the normalized value between 0 and 1
    return (value - minValue) / (maxValue - minValue);
}





// Create the next generation
function nextGeneration() {

    generation += 1

    paddles = []

    // resetGame();
    ball.resetball();

    // repopulate
    for (let index = 0; index < TOTAL; index++) {

        let child = new Paddle(lastsavedpaddle.brain);
        child.mutate();

        paddles.push(child)

    }


    gencountui.innerText = generation

}