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

        this.ticker = PIXI.Ticker.shared;

        document.body.appendChild(this.app.view);
    }

    position(pos){
        const tx = this.paddingPx + (pos.col * (tileWidth + this.tilePxGap));
        const ty = this.paddingPx + (pos.row * (tileHeight + this.tilePxGap));

        return {tx:tx, ty:ty, row:pos.row, col:pos.col};
    }

    addTile(position, colorIndex){
        const coordinate = this.position(position);

        if(colorIndex === undefined){
            colorIndex = Math.floor(Math.random() * spritesTintSet.length);
        }

        let tile = new Tile(
            colorIndex, coordinate.tx, coordinate.ty, position.row, position.col);

        this.app.stage.addChild(tile.tile);

        return tile;
    }

    downloadField(){
        this.field = PIXI.Sprite.from(fieldFile);

        this.field.width = this.width;
        this.field.height = this.height;

        this.app.stage.addChild(this.field);
    }

    moveTile(tile, position){
        const coordinate = this.position(position);

        tile.move(coordinate, this.ticker)
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

    move(coordinate, ticker){
        this.tx = coordinate.tx;
        this.ty = coordinate.ty;
        this.row = coordinate.row;
        this.col = coordinate.col;
        this.ticker = ticker;

        this.ticker.add(this.moveHandler, this);
    }

    moveHandler(){
        let diffX = this.tile.x - this.tx;
        let diffY = this.tile.y - this.ty;

        if((diffX == 0) && (diffY == 0)){
            this.ticker.remove(this.moveHandler, this);
        }

        if(diffX != 0){
            let stepX = Math.ceil((this.tx - this.tile.x) / 10);
            this.tile.x = this.tile.x + stepX;
        }

        if(diffY != 0){
            let stepY = Math.ceil((this.ty - this.tile.y) / 10);
            this.tile.y = this.tile.y + stepY;
        }
    }
}