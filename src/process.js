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

    init(){
        this.main.shake();
        this.main.showScore(this.scoreToWin - this.blastCount);
        this.main.showClick(this.clickLimit - this.clickCount);
    }

    clickCounter(number){
        this.clickCount += 1;
        this.blastCount += number;

        this.main.showScore(this.scoreToWin - this.blastCount);
        this.main.showClick(this.clickLimit - this.clickCount);
        this.main.showProgress(Math.round((this.blastCount / this.scoreToWin) * 100));

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