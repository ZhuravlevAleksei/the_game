import * as PIXI from "pixi.js";
import tileFile from '../static/wt.png';
import fieldFile from '../static/field.png';
import getProperty from './utils'

let spritesTintSet = undefined;
let tileWidth = undefined;
let tileHeight = undefined;
let tileClickHandler = undefined;


class GraphicsApp {
    constructor(config) {
        this.width = getProperty("canvasWidth", config);
        this.height = getProperty("canvasHeight", config);
        this.backgroundColor = getProperty("backgroundColor", config);
        this.tilePxGap = getProperty("tilePxGap", config);
        spritesTintSet = getProperty("spritesTintSet", config);

        this.paddingPx = Math.floor(
            (this.width / 100) * getProperty("paddingWidthPercent", config));

        this.tilesRowCount = getProperty("tilesRowCount", config);

        tileClickHandler = this._onClick.bind(this);

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

        this._downloadField();
    }

    _onClick(tile){
        if(this.blast()(tile) == false){
            return;
        }

        let emptyTopCells = this.searchForEmptiesInRows()(0);

        let tiles = this.addTiles(emptyTopCells);
        this.addCells()(tiles);

        // Fill all cells -------------------
        let limitCounter = this.tilesRowCount + 1;
    
        while (limitCounter--) {
            // The fall on floor ------------------
            let colls = this.collsToFall()();

            if (colls.length == 0) {
                break;
            }

            for (let c = 0; c < colls.length; c++) {
                this._moveTiles(colls[c]);
            }
    
            // Fill top row ----------------------
            emptyTopCells = this.searchForEmptiesInRows()(0);

            tiles = this.addTiles(emptyTopCells);
            this.addCells()(tiles);
        }
    }

    fillAll(){
        for(let r = 0; r < this.tilesRowCount; r++){
            let emptyRowCells = this.searchForEmptiesInRows()(r);
            let tiles = this.addTiles(emptyRowCells);
            this.addCells()(tiles);
        }
    }

    _position(pos){
        const tx = this.paddingPx + (pos.col * (tileWidth + this.tilePxGap));
        const ty = this.paddingPx + (pos.row * (tileHeight + this.tilePxGap));

        return {tx:tx, ty:ty, row:pos.row, col:pos.col};
    }

    _downloadField(){
        this.field = PIXI.Sprite.from(fieldFile);

        this.field.width = this.width;
        this.field.height = this.height;

        this.app.stage.addChild(this.field);
    }

    _addTile(position, colorIndex){
        const coordinate = this._position(position);

        if(colorIndex === undefined){
            colorIndex = Math.floor(Math.random() * spritesTintSet.length);
        }

        let tile = new Tile(
            colorIndex, coordinate.tx, coordinate.ty, position.row, position.col);

        this.app.stage.addChild(tile.tile);

        tile.show(this.ticker);

        return tile;
    }

    addTiles(emptyCells){
        const tiles = [];

        for (let c = 0; c < emptyCells.length; c++) {
            let t = this._addTile(emptyCells[c]);
            tiles.push(t);
        }

        return tiles;
    }

    _moveTile(tile, position){
        const coordinate = this._position(position);

        tile.move(coordinate, this.ticker)
    }

    _moveTiles(tilesArr){
        for (let c = 0; c < tilesArr.length; c++) {
            this._moveTile(tilesArr[c].tile, tilesArr[c].to);
        }
    }
}

class Tile{
    constructor(colorIndex, x, y, row, col){
        let tile = PIXI.Sprite.from(tileFile);

        tile.x = x;
        tile.y = y;

        tile.width = 0;
        tile.height = 0;

        this.tile = tile;
        this.tile.tint = spritesTintSet[colorIndex];
        this.colorIndex = colorIndex;

        this.tile.interactive = true;
        this.tile.buttonMode = true;
        this.tile.on('pointerdown', this._tileOnClick.bind(this));

        this.col = col;
        this.row = row;

        return this;
    }

    _tileOnClick(){
        tileClickHandler(this)
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

        this.ticker.add(this._moveHandler, this);
    }

    _moveHandler(){
        let diffX = this.tile.x - this.tx;
        let diffY = this.tile.y - this.ty;

        if((diffX == 0) && (diffY == 0)){
            this.ticker.remove(this._moveHandler, this);
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

    show(ticker){
        this.ticker = ticker;
        this.ticker.add(this._showHandler, this);
    }

    _showHandler(){
        let diffWidth = tileWidth - this.tile.width;
        let diffHeight = tileHeight - this.tile.height;

        if((diffWidth == 0) && (diffHeight == 0)){
            this.ticker.remove(this._showHandler, this);
        }

        if(diffWidth != 0){
            let stepWidth = Math.ceil((tileWidth - this.tile.width) / 2);
            this.tile.width = this.tile.width + stepWidth;
        }

        if(diffHeight != 0){
            let stepHeight = Math.ceil((tileHeight - this.tile.height) / 8);
            this.tile.height = this.tile.height + stepHeight;
        }
    }
}

export {GraphicsApp}