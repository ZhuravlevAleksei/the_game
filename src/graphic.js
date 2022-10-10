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

        // this.ticker = PIXI.Ticker.shared;

        document.body.appendChild(this.app.view);

        this._downloadField();
    }

    _onClick(tile){
        const blast = this.blast()(tile);

        if(blast.counter == false){
            return;
        }

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
            const emptyTopCells = this.searchForEmptiesInRows()(0);

            const tiles = this.addTiles(emptyTopCells, blast.super);
            blast.super = false;

            this.addCells()(tiles);
        }

        this.checkBlastUnablity()();
    }

    fillAll(){
        for(let r = 0; r < this.tilesRowCount; r++){
            let emptyRowCells = this.searchForEmptiesInRows()(r);
            let tiles = this.addTiles(emptyRowCells);
            this.addCells()(tiles);
        }
    }

    _position(pos){
        const tx = this.paddingPx + (pos.col * (tileWidth + this.tilePxGap)) + (tileWidth / 2);
        const ty = this.paddingPx + (pos.row * (tileHeight + this.tilePxGap)) + (tileHeight / 2);

        return {tx:tx, ty:ty, row:pos.row, col:pos.col};
    }

    _downloadField(){
        this.field = PIXI.Sprite.from(fieldFile);

        this.field.width = this.width;
        this.field.height = this.height;

        this.app.stage.addChild(this.field);
    }

    _addTile(position, colorIndex, superTile){
        const coordinate = this._position(position);

        if(colorIndex === undefined){
            colorIndex = Math.floor(Math.random() * spritesTintSet.length);
        }

        let tile = new Tile(
            colorIndex,
            coordinate.tx,
            coordinate.ty,
            position.row,
            position.col,
            superTile);

        this.app.stage.addChild(tile.tile);

        if(superTile){
            tile.superT();
        }else{
            tile.show();
        }

        return tile;
    }

    addTiles(emptyCells, blast){
        const tiles = [];
        let superTileIndex = -1;

        if(blast){
            if(emptyCells.length == 1){
                superTileIndex = 0;
            }else{
                superTileIndex = Math.floor(Math.random() * emptyCells.length);
            }
        }

        for (let c = 0; c < emptyCells.length; c++) {
            const t = this._addTile(emptyCells[c], undefined, (c === superTileIndex));

            tiles.push(t);
        }

        return tiles;
    }

    _moveTile(tile, position){
        const coordinate = this._position(position);

        tile.move(coordinate)
    }

    _moveTiles(tilesArr){
        for (let c = 0; c < tilesArr.length; c++) {
            this._moveTile(tilesArr[c].tile, tilesArr[c].to);
        }
    }

    shake(){
        this.shakeBoard()();
        let tile = this.resetTileCursor()();

        while (tile !== null) {
            if (tile === undefined) {
                tile = this.nextTile()();
                continue;
            }

            if(tile.toMove){
                let positionTo = {row: tile.row, col: tile.col};
                this._moveTile(tile, positionTo);
            }

            tile = this.nextTile()();
        }
    }

    lockTiles(){
        let tile = this.resetTileCursor()();

        while (tile !== null) {
            if (tile === undefined) {
                tile = this.nextTile()();
                continue;
            }

            tile.lock();

            tile = this.nextTile()();
        }
    }
}

class Tile{
    constructor(colorIndex, x, y, row, col, superTile){
        let tile = PIXI.Sprite.from(tileFile);

        tile.anchor.set(0.5,0.5);

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

        this.toMove = false;
        this.superTile = superTile;

        return this;
    }

    superT(){
        this.timeElapsed = 0;

        if(this.tile.width < tileWidth){
            this.tile.width = tileWidth;
        }

        if(this.tile.height < tileHeight){
            this.tile.height = tileHeight;
        }

        this.ticker = PIXI.Ticker.shared;
        this.ticker.add(this._superTHandler, this);
    }

    _superTHandler(){
        if(this.timeElapsed < 2){
            this.timeElapsed += this.ticker.deltaTime;
            return;
        }else{
            this.timeElapsed = 0;
        }

        if(this.tile.width < tileWidth){
            this.tile.width += 1;
        }else{
            this.tile.width = tileWidth - 6;
        }
        
        if(this.tile.height < tileHeight){
            this.tile.height += 1;
        }else{
            this.tile.height = tileHeight - 6;
        }
    }

    _tileOnClick(){
        tileClickHandler(this)
    }

    delete(){
        if(this.ticker){
            this.ticker.remove(this._superTHandler, this);
            this.ticker.destroy();
        }

        if(this.tile){
            if(this.tile._texture){
                this.tile.destroy();
            }
        }
    }

    lock(){
        if(this.ticker){
            this.ticker.destroy();
        }

        this.tile.interactive = false;
        this.tile.buttonMode = false;
    }

    move(coordinate){
        this.tx = coordinate.tx;
        this.ty = coordinate.ty;
        this.row = coordinate.row;
        this.col = coordinate.col;
        this.toMove = false;

        if(this.superTile){
            if(this.ticker){
                this.ticker.remove(this._superTHandler, this);
            }

            this.tile.width = tileWidth;
            this.tile.height = tileHeight;
        }

        this.ticker = PIXI.Ticker.shared;
        this.ticker.add(this._moveHandler, this);
    }

    _moveHandler(){
        let diffX = this.tile.x - this.tx;
        let diffY = this.tile.y - this.ty;

        if((diffX == 0) && (diffY == 0)){
            this.ticker.remove(this._moveHandler, this);

            if(this.superTile){
                this.superT();
            }
        }

        if(diffX != 0){
            let xDiff = this.tx - this.tile.x
            let stepX = 1;

            if(Math.abs(xDiff) < 5){
                stepX = Math.ceil((this.tx - this.tile.x) / 1);
            }else{
                stepX = Math.ceil((this.tx - this.tile.x) / 5);
            }
            
            this.tile.x = this.tile.x + stepX;
        }

        if(diffY != 0){
            let yDiff = this.ty - this.tile.y
            let stepY = 1;

            if(Math.abs(yDiff) < 5){
                stepY = Math.ceil((this.ty - this.tile.y) / 1);
            }else{
                stepY = Math.ceil((this.ty - this.tile.y) / 5);
            }

            this.tile.y = this.tile.y + stepY;
        }
    }

    show(){
        this.ticker = PIXI.Ticker.shared;
        this.ticker.add(this._showHandler, this);
    }

    _showHandler(){
        let diffWidth = tileWidth - this.tile.width;
        let diffHeight = tileHeight - this.tile.height;

        if((diffWidth == 0) && (diffHeight == 0)){
            this.ticker.remove(this._showHandler, this);
            this.ticker.destroy()

            if(this.superTile){
                this.superT();
            }
        }

        if(diffWidth != 0){
            let stepWidth;

            if(Math.abs(diffWidth) < 2){
                stepWidth = Math.ceil((tileWidth - this.tile.width) / 1);
            }else{
                stepWidth = Math.ceil((tileWidth - this.tile.width) / 2);
            }

            this.tile.width = this.tile.width + stepWidth;
        }

        if(diffHeight != 0){
            let stepHeight;

            if(Math.abs(diffHeight) < 5){
                stepHeight = Math.ceil((tileHeight - this.tile.height) / 1);
            }else{
                stepHeight = Math.ceil((tileHeight- this.tile.height) / 5);
            }

            this.tile.height = this.tile.height + stepHeight;
        }
    }
}

export {GraphicsApp}