import * as PIXI from "pixi.js";
import progressBarFile from '../static/progress-bar.png';
import progressLine100File from '../static/progress-line-100.png';
import shakeButtonOpenFile from '../static/shake-button-open.png';
import shakeButtonCloseFile from '../static/shake-button-close.png';
import dashboardFieldFile from '../static/dashboard-field.png';
import scoreIndicatorFile from '../static/score-indicator.png';
import textStyle from '../static/text.json';
import scoreStyle from '../static/score.json';
import getProperty from './utils'


class DashboardApp{
    constructor(config){
        this.width = getProperty("canvasWidth", config);
        this.height = getProperty("canvasHeight", config);
        this.backgroundColor = getProperty("backgroundColor", config);

        this.progressBarWidth = getProperty("Width", config.progressBar);
        this.progressBarHeight = getProperty("Height", config.progressBar);
        this.progressBarX = getProperty("X", config.progressBar);
        this.progressBarY = getProperty("Y", config.progressBar);

        this.scoreIndicatorWidth = getProperty("Width", config.scoreIndicator);
        this.scoreIndicatorHeight = getProperty("Height", config.scoreIndicator);
        this.scoreIndicatorX = getProperty("X", config.scoreIndicator);
        this.scoreIndicatorY = getProperty("Y", config.scoreIndicator);

        this.shakeButtonWidth = getProperty("Width", config.shakeButton);
        this.shakeButtonHeight = getProperty("Height", config.shakeButton);
        this.shakeButtonX = getProperty("X", config.shakeButton);
        this.shakeButtonY = getProperty("Y", config.shakeButton);

        this.app = new PIXI.Application({
            width: this.width,
            height: this.height,
            backgroundColor: this.backgroundColor
        });

        this.ticker = PIXI.Ticker.shared;

        document.body.appendChild(this.app.view);

        this._downloadField();

        this._downloadText();
    }

    _downloadField(){
        this.field = PIXI.Sprite.from(dashboardFieldFile);

        this.field.width = this.width;
        this.field.height = this.height;
        this.field.zIndex = 0;

        this.app.stage.addChild(this.field);

        this.progressBar = PIXI.Sprite.from(progressBarFile);
        this.progressBar.width = this.progressBarWidth;
        this.progressBar.height = this.progressBarHeight;
        this.progressBar.x = this.progressBarX;
        this.progressBar.y = this.progressBarY;
        this.progressBar.zIndex = 5;

        this.app.stage.addChild(this.progressBar);

        this.scoreIndicator = PIXI.Sprite.from(scoreIndicatorFile);
        this.scoreIndicator.width = this.scoreIndicatorWidth;
        this.scoreIndicator.height = this.scoreIndicatorHeight;
        this.scoreIndicator.x = this.scoreIndicatorX;
        this.scoreIndicator.y = this.scoreIndicatorY;
        this.scoreIndicator.zIndex = 5;

        this.app.stage.addChild(this.scoreIndicator);

        this.shakeButtonOpen = PIXI.Sprite.from(shakeButtonCloseFile);
        this.shakeButtonOpen.width = this.shakeButtonWidth;
        this.shakeButtonOpen.height = this.shakeButtonHeight;
        this.shakeButtonOpen.x = this.shakeButtonX;
        this.shakeButtonOpen.y = this.shakeButtonY;
        this.shakeButtonOpen.zIndex = 5;

        this.shakeButtonOpen.interactive = true;
        this.shakeButtonOpen.buttonMode = true;
        this.shakeButtonOpen.on('pointerdown', this._shakeButtonOnClick.bind(this));

        this.app.stage.addChild(this.shakeButtonOpen);
    }

    _downloadText(){
        this.styleText = new PIXI.TextStyle(textStyle);
        this.textText = new PIXI.Text('Progress', this.styleText);
        this.textText.x = 240;
        this.textText.y = 30;
        this.app.stage.addChild(this.textText);

        this.scoreText = new PIXI.TextStyle(scoreStyle);
        this.textScore = new PIXI.Text('0000', this.scoreText);
        this.textScore.x = 285;
        this.textScore.y = 410;
        this.app.stage.addChild(this.textScore);

        this.clickText = new PIXI.TextStyle(scoreStyle);
        this.textClick = new PIXI.Text('0', this.clickText);
        this.textClick.x = 357;
        this.textClick.y = 255;
        this.app.stage.addChild(this.textClick);
    }

    _shakeButtonOnClick(){
        this.shakeButton()();
    }

    _textCoordinate(value){
        let x;

        if(value < 10){
            x = 357;
        }else if(value < 100){
            x = 335;
        }else if(value < 1000){
            x = 305;
        }

        return x;
    }

    showScore(score){
        this.textScore.x = this._textCoordinate(score);
        
        if(score < 0){
            score = 0;
        }

        this.textScore.text = `${score}`;
    }

    showClick(click){
        this.textClick.x = this._textCoordinate(click);
        
        if(click < 0){
            click = 0;
        }

        this.textClick.text = `${click}`;
    }
}

export {DashboardApp};