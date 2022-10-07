import * as PIXI from "pixi.js";
import tileFile from '../static/wt.png';
import fieldFile from '../static/field.png';
import getProperty from './utils'

let spritesTintSet = undefined;
let tileWidth = undefined;
let tileHeight = undefined;
let tileClickHandler = undefined;


export default class GraphicsApp {
    constructor(config, tileHandler) {
        const graphics = getProperty("graphics", config);

        this.width = getProperty("canvasWidth", graphics);
        this.height = getProperty("canvasHeight", graphics);
        this.backgroundColor = getProperty("backgroundColor", graphics);
        this.tilePxGap = getProperty("tilePxGap", graphics);
        spritesTintSet = getProperty("spritesTintSet", graphics);

        this.paddingPx = Math.floor(
            (this.width / 100) * getProperty("paddingWidthPercent", graphics));

        this.tilesRowCount = getProperty("tilesRowCount", config);

        tileClickHandler = tileHandler;

        const gapSpace = (this.tilesRowCount - 1) * this.tilePxGap;

        tileWidth = Math.round(
            ((this.width - (this.paddingPx * 2) - gapSpace) / 
            this.tilesRowCount));

        tileHeight = Math.round((this.height / this.width) * tileWidth);

        this.app = new PIXI.Application({
            width: this.width,
            height: this.height,
            backgroundColor: this.backgroundColor
        });

        document.body.appendChild(this.app.view);
    }

    position(row, col){
        const tx = this.paddingPx + (col * (tileWidth + this.tilePxGap));
        const ty = this.paddingPx + (row * (tileHeight + this.tilePxGap));

        return {tx:tx, ty:ty};
    }

    addTile(row, col, colorIndex){
        const pos = this.position(row, col);

        if(colorIndex === undefined){
            colorIndex = Math.floor(Math.random() * spritesTintSet.length);
        }

        let tile = new Tile(colorIndex, pos.tx, pos.ty, row, col);

        this.app.stage.addChild(tile.tile);

        return tile;
    }

    downloadField(){
        this.field = PIXI.Sprite.from(fieldFile);

        this.field.width = this.width;
        this.field.height = this.height;

        this.app.stage.addChild(this.field);
    }

    moveTile(tile, row, col){
        const pos = this.position(row, col);

        tile.move(pos.tx, pos.ty, row, col);
    }
}

class Tile{
    constructor(colorIndex, x, y, row, col){
        let tile = PIXI.Sprite.from(tileFile);

        tile.x = x;
        tile.y = y;

        tile.width = tileWidth;
        tile.height = tileHeight;

        this.tile = tile;
        this.tile.tint = spritesTintSet[colorIndex];
        this.colorIndex = colorIndex;

        this.tile.interactive = true;
        this.tile.buttonMode = true;
        this.tile.on('pointerdown', tileClickHandler.bind(this));

        this.col = col;
        this.row = row;

        return this;
    }

    delete(){
        this.tile.destroy();
    }

    move(x, y, row, col){
        this.tile.x = x;
        this.tile.y = y;

        this.col = col;
        this.row = row;
    }
}