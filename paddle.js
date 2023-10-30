class Paddle {

    constructor(brain) {

        this.pos = createVector(20, height / 2 - 50);
        this.w = 20;
        this.h = 100;
        this.score = 0;
        this.fitness = 0

        //NN inputs
        // ball.position.x
        // ball.position.y
        // ball velocity x
        // ball velocity y

        // paddle.position.x ??
        // paddle.position.y

        //NN outputs go up? do nothing? go dowwn  3 or 2

        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(5, 5, 1)
        }



    }

    think() {


        // ###############
        // normalize inputs
        // ################

        let normalvelx = normalizeValue(ball.vel.x, -20, 20);
        let normalvely = normalizeValue(ball.vel.y, -20, 20);

        let input = [this.pos.y / height, ball.pos.x / width, ball.pos.y / height, normalvelx, normalvely]
        //  console.log(input)
        let output = this.brain.predict(input)
        //  console.log(output)

        // if (output[0] > 0.5) {
        //     // go up
        //     this.move(+15);

        // }
        // if (output[1] > 0.5) {
        //     // go down
        //     this.move(-15);
        // }
        if (output[0] < 0.5) {
            // go up
            this.move(+15);

        }
        if (output[0] > 0.5) {
            // go down
            this.move(-15);
        }

    }

    move(amt) {
        this.pos.y += amt;
        this.pos.y = constrain(this.pos.y, 0, height - this.h);
    }

    show() {
        noStroke();
        fill(color(255, 50));
        rect(this.pos.x, this.pos.y, this.w, this.h);
    }
    mutate() {
        this.brain.mutate(0.1);
    }

}