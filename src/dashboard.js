import * as PIXI from "pixi.js";
import progressBarFile from '../static/progress-bar.png';
import progressLine100File from '../static/progress-line-100.png';
import shakeButtonOpenFile from '../static/shake-button-open.png';
import shakeButtonCloseFile from '../static/shake-button-close.png';
import dashboardFieldFile from '../static/dashboard-field.png';
import scoreIndicatorFile from '../static/score-indicator.png';
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

    _shakeButtonOnClick(){
        this.shakeButton()();
    }
}

export {DashboardApp};