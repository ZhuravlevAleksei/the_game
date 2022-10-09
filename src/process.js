import getProperty from './utils'


class GameConditions{
    constructor(config){
        this.scoreToWin = getProperty("scoreToWin", config);
        this.clickLimit = getProperty("clickLimit", config);
        this.shakeLimit = getProperty("shakeLimit", config);

        this.blastCount = 0;
        this.clickCount = 0;
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

    enableShaking(){
        console.log("enableShaking");
    }

    disableShaking(){
        console.log("disableShaking");
    }
}

export {GameConditions}