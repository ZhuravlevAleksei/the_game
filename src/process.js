import getProperty from './utils'


class GameConditions{
    constructor(config){
        this.blastTileCount = getProperty("blastTileCount", config);
        this.scoreToWin = getProperty("scoreToWin", config);
        this.clickLimit = getProperty("clickLimit", config);
        this.shakeLimit = getProperty("shakeLimit", config);
    }
}

export {GameConditions}