import getProperty from './utils'


class GameConditions{
    constructor(config, main){
        this.scoreToWin = getProperty("scoreToWin", config);
        this.clickLimit = getProperty("clickLimit", config);
        this.shakeLimit = getProperty("shakeLimit", config);

        this.blastCount = 0;
        this.clickCount = 0;

        this.shakingEnable = false;

        this.main = main;
    }

    clickCounter(number){
        this.clickCount += 1;
        this.blastCount += number;

        console.log(`clickCount ${this.clickLimit - this.clickCount}`);

        console.log(`blastCount ${this.scoreToWin - this.blastCount}`);

        if(this.blastCount >= this.scoreToWin){
            // winning
            console.log("winning");
        }

        if(this.clickCount >= this.clickLimit){
            // losing
            console.log("losing");
        }
    }

    // Shaking --------------------------------------------
    enableShaking(){
        this.shakingEnable = true;
    }

    disableShaking(){
        this.shakingEnable = false;
    }

    shakeButton(){
        if(this.shakingEnable){
            this.main.shake();
        }
    }
}

export {GameConditions}