import getProperty from './utils'


class GameConditions{
    constructor(config, main){
        this.scoreToWin = getProperty("scoreToWin", config);
        this.clickLimit = getProperty("clickLimit", config);
        this.shakeLimit = getProperty("shakeLimit", config);
        this.supetTileLimit = config["supetTileLimit"];

        this.blastCount = 0;
        this.clickCount = 0;

        this.shakingEnable = false;
        this.shakeCounter = 0;

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

        if(this.blastCount >= this.scoreToWin){
            // winning
            this.main.lockTiles();
            this.main.winningEffect();
            return
        }

        if(this.clickCount >= this.clickLimit){
            // losing
            this.main.lockTiles();
            this.main.losingEffect();
            return;
        }

        this.main.showScore(this.scoreToWin - this.blastCount);
        this.main.showClick(this.clickLimit - this.clickCount);
        this.main.showProgress(Math.round((this.blastCount / this.scoreToWin) * 100));
    }

    // Shaking --------------------------------------------
    enableShaking(){
        if(this.shakeCounter >= this.shakeLimit){
            this.main.lockTiles();
            this.main.losingEffect();
            return;
        }

        this.shakingEnable = true;
        this.main.shakeButtonEffect();
    }

    disableShaking(){
        this.shakingEnable = false;
    }

    shakeButton(){
        if(this.shakingEnable){
            this.main.shake();
            this.shakeCounter += 1;
        }
    }

    checkSuperTileMode(counter){
        if (counter >= this.supetTileLimit){
            return true;
        }

        return false;
    }
}

export {GameConditions}