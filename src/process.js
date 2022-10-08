import getProperty from './utils'


class GameConditions{
    constructor(config){
        this.blastTailCount = getProperty("blastTailCount", config);
        this.scoreToWin = getProperty("scoreToWin", config);
        this.clickLimit = getProperty("clickLimit", config);
        this.shakeLimit = getProperty("shakeLimit", config);
    }
}

export {GameConditions}