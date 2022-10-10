import * as PIXI from "pixi.js";
import progressBarFile from '../static/progress-bar.png';
import progressLineLeftFile from '../static/progress-line-left.png';
import progressLineRightFile from '../static/progress-line-right.png';
import progressLineCenterFile from '../static/progress-line-center.png';
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
        this.progressLineStart = getProperty("progressLineStart", config.progressBar);
        this.progressLineW = getProperty("progressLineW", config.progressBar);

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
        this.field.zIndex = 2;

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
        this.shakeButtonOpen.anchor.set(0.5,0.5);
        this.shakeButtonOpen.width = this.shakeButtonWidth;
        this.shakeButtonOpen.height = this.shakeButtonHeight;
        this.shakeButtonOpen.x = this.shakeButtonX;
        this.shakeButtonOpen.y = this.shakeButtonY;
        this.shakeButtonOpen.zIndex = 5;

        this.shakeButtonOpen.interactive = true;
        this.shakeButtonOpen.buttonMode = true;
        this.shakeButtonOpen.on('pointerdown', this._shakeButtonOnClick.bind(this));

        this.app.stage.addChild(this.shakeButtonOpen);

        this.progressLineLeft = PIXI.Sprite.from(progressLineLeftFile);
        this.progressLineLeft.width = 21;
        this.progressLineLeft.height = 38;
        this.progressLineLeft.x = 27;
        this.progressLineLeft.y = 80;
        this.app.stage.addChild(this.progressLineLeft);

        this.progressLineCenter = PIXI.Sprite.from(progressLineCenterFile);
        this.progressLineCenter.width = this.progressLineW;
        this.progressLineCenter.height = 38;
        this.progressLineCenter.x = this.progressLineStart;
        this.progressLineCenter.y = 80;
        this.app.stage.addChild(this.progressLineCenter);

        this.progressLineRight = PIXI.Sprite.from(progressLineRightFile);
        this.progressLineRight.width = 21;
        this.progressLineRight.height = 38;
        this.progressLineRight.x = this.progressLineStart + this.progressLineW;
        this.progressLineRight.y = 80;
        this.app.stage.addChild(this.progressLineRight);
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

        this.winningText = new PIXI.TextStyle(scoreStyle);
        this.textWinning = new PIXI.Text('WIN', this.winningText);
        this.textWinning.style.fontSize = 100;
        this.textWinning.style.fill = 0xff617e;
        this.textWinning.x = 150;
        this.textWinning.y = 255;

        this.losingText = new PIXI.TextStyle(scoreStyle);
        this.textLosing = new PIXI.Text('LOSS', this.losingText);
        this.textLosing.style.fontSize = 100;
        this.textLosing.style.fill = 0xf1d074;
        this.textLosing.x = 140;
        this.textLosing.y = 255;
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

    showProgress(progressPercentage){
        if(progressPercentage > 100){
            progressPercentage = 100;
        }

        const x = (500 / 100) * progressPercentage;
        this.progressLineRight.x = this.progressLineStart + this.progressLineW + x;
        this.progressLineCenter.width = this.progressLineW + x;
    }

    shakeButtonEffect(){
        this.ticker.add(this._shakeButtonEffectHandler, this);
    }

    _shakeButtonEffectHandler(){
        this.shakeButtonOpen.angle += 5;

        if(this.shakeButtonOpen.angle >= 90){
            this.shakeButtonOpen.angle = 0;
            this.ticker.remove(this._shakeButtonEffectHandler, this);
        }
    }

    _hide(){
        if(this.shakeButtonOpen){this.shakeButtonOpen.destroy();}
        if(this.scoreIndicator){this.scoreIndicator.destroy();}
        if(this.textClick){this.textClick.destroy();}
        if(this.textScore){this.textScore.destroy();}
    }

    winningEffect(){
        this._hide();
        this.app.stage.addChild(this.textWinning);
        // this.ticker.add(this._winningEffectHandler, this);
    }

    // _winningEffectHandler(){
    //     if(true){
    //         this.ticker.remove(this._winningEffectHandler, this);
    //     }
    // }

    losingEffect(){
        this._hide();
        this.app.stage.addChild(this.textLosing);
        // this.ticker.add(this._losingEffectHandler, this);
    }

    // _losingEffectHandler(){
    //     if(true){
    //         this.ticker.remove(this._losingEffectHandler, this);
    //     }
    // }
}

export {DashboardApp};