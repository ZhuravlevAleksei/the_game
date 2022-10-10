import getProperty from "./utils";


class GameBoard {
    constructor(config, blastTileCount) {
        this.tilesRowCount = getProperty("tilesRowCount", config);

        if(blastTileCount === undefined){
            throw new Error(`Property "blastTileCount" is not defined`);
        }

        this.blastTileCount = blastTileCount;

        this.board = this._boardInit(this.tilesRowCount, undefined);

        return this;
    }

    _boardInit(count, value) {
        let board = [];

        for (let c = 0; c < count; c++) {
            board.push([]);
        }

        for (let r = 0; r < count; r++) {
            for (let c = 0; c < count; c++) {
                board[r].push(value);
            }
        }

        return board;
    }

    addCells(tileArray){
        for(let t = 0; t < tileArray.length; t++){
            let tile = tileArray[t];
            this.board[tile.row][tile.col] = tile;
        }
    }

    _cleanCell(tile) {
        const row = tile.row;
        const col = tile.col;

        this.board[row][col] = undefined;
    }

    _moveCell(coordFrom, coordTo) {
        this.board[coordTo.row][coordTo.col] = this.board[coordFrom.row][coordFrom.col];
        this.board[coordFrom.row][coordFrom.col] = undefined;
    }

    changeCells(coordFrom, coordTo){
        const tmp = this.board[coordTo.row][coordTo.col];
        this.board[coordTo.row][coordTo.col] = this.board[coordFrom.row][coordFrom.col];
        
        this.board[coordFrom.row][coordFrom.col] = tmp;
    }

    _right(row, col) {
        let nCol = col + 1;

        if (nCol >= this.tilesRowCount) {
            return undefined;
        }

        if (this.board[row][nCol] === undefined) {
            return undefined;
        }

        return this.board[row][nCol];
    }

    _under(row, col) {
        let nRow = row + 1;

        if (nRow >= this.tilesRowCount) {
            return undefined;
        }

        if (this.board[nRow][col] === undefined) {
            return undefined;
        }

        return this.board[nRow][col];
    }

    _left(row, col) {
        let nCol = col - 1;

        if (nCol < 0) {
            return undefined;
        }

        if (this.board[row][nCol] === undefined) {
            return undefined;
        }

        return this.board[row][nCol];
    }

    _above(row, col) {
        let nRow = row - 1;

        if (nRow < 0) {
            return undefined;
        }

        if (this.board[nRow][col] === undefined) {
            return undefined;
        }

        return this.board[nRow][col];
    }

    _directions = [
        this._right.bind(this),
        this._under.bind(this),
        this._left.bind(this),
        this._above.bind(this),
    ];

    _neighbours(row, col, colorIndex) {
        const cells = [];

        for (let d = 0; d < this._directions.length; d++) {
            let cell = this._directions[d](row, col);

            if (cell === undefined) {
                continue;
            }

            if (cell.colorIndex == colorIndex) {
                cells.push(cell);
            }
        }

        return cells;
    }

    _predicateForExclude(n) {
        for (let p = 0; p < this.excludeSet.length; p++) {
            if (
                n.row == this.excludeSet[p].row &&
                n.col == this.excludeSet[p].col
            ) {
                return false;
            }
        }
        return true;
    }

    _search(currCell, prevCells) {
        const nbs = this._neighbours(
            currCell.row,
            currCell.col,
            currCell.colorIndex
        );

        let toSearch;

        if (prevCells === undefined) {
            prevCells = [currCell];
            toSearch = nbs;
        } else {
            prevCells.push(currCell);

            this.excludeSet = prevCells;
            toSearch = nbs.filter(this._predicateForExclude.bind(this));
        }

        let nCells = toSearch;

        for (let n = 0; n < toSearch.length; n++) {
            let res = this._search(toSearch[n], prevCells);

            // closure handling
            this.excludeSet = nCells;
            let fRes = res.filter(this._predicateForExclude.bind(this));

            nCells = nCells.concat(fRes);
        }

        return nCells;
    }

    _floorEmpty() {
        const cellsPosition = this._searchForEmptiesInBoard(0);

        if(cellsPosition.length == 0){
            return cellsPosition;
        }

        cellsPosition.sort((a, b) => {
            return a.col > b.col;
        });

        const colSliced = [];

        for (let c = cellsPosition[0].col; c <= cellsPosition[cellsPosition.length - 1].col; c++) {
            let f = cellsPosition.filter((n) => {
                return n.col == c;
            });

            f.sort((a, b) => {
                return a.row < b.row;
            });

            colSliced.push(f);
        }

        const fl = [];

        for (let c = 0; c < colSliced.length; c++) {
            if(colSliced[c].length == 0){
                continue;
            }

            fl.push({ row: colSliced[c][0].row, col: colSliced[c][0].col });
        }

        return fl;
    }

    _fallCol(coordinate) {
        const cells = [];
        let displacement;
        let dispCellCount = 0;
        let row = coordinate.row;

        for (; row > 0; row--) {
            let cell = this._above(row, coordinate.col);

            if (cell !== undefined) {
                displacement = coordinate.row - row + 1 - dispCellCount++;

                let from = { row: cell.row, col: cell.col };
                let to = { row: cell.row + displacement, col: cell.col };

                cells.push({ tile: cell, to: to });

                this._moveCell(from, to);
            }
        }

        return cells;
    }

    searchForEmptiesInRows(row){
        const topCells = [];

        for(let c = 0; c < this.board[row].length; c++){
            if(this.board[row][c] === undefined){
                topCells.push({row:row, col:c});
            }
        }

        return topCells;
    }

    _searchForEmptiesInBoard(topRow){
        let emptyAll = [];

        for(let r = topRow; r < this.tilesRowCount; r++){
            let empty = this.searchForEmptiesInRows(r);
            emptyAll = emptyAll.concat(empty);
        }

        return emptyAll;
    }

    collsToFall() {
        const fl = this._floorEmpty();

        const colls = [];

        for (let f = 0; f < fl.length; f++) {
            colls.push(this._fallCol(fl[f]));
        }

        return colls;
    }

    superTileBlast(superCell){
        let blastCount = 0;
        const row = superCell.row;

        for(let c = 0; c < this.tilesRowCount; c++){
            let cell = this.board[row][c];

            if(cell === undefined){
                continue;
            }

            cell.delete();
            this._cleanCell(cell);
            blastCount += 1;
        }

        return blastCount;
    }

    blast(tile){
        let blastCount = 0;

        // search --------------------------
        let cells = [tile];
        cells = cells.concat(this._search(tile));

        if (cells.length < this.blastTileCount) {
            return {counter: false, super: false};
        }

        // blast ---------------------------
        for (let i = 0; i < cells.length; i++) {
            if(cells[i] === undefined){
                continue;
            }

            if(cells[i].superTile){
                blastCount += this.superTileBlast(cells[i]);
                continue;
            }
            
            cells[i].delete();
            this._cleanCell(cells[i]);
            blastCount += 1;
        }

        this.clickCounter()(blastCount);

        let result = {counter: true, super: false};

        result.super = this.checkSuperTileMode()(cells.length);

        return result;
    }

    nextCell() {
        if (
            this.cursor.row >= this.tilesRowCount &&
            this.cursor.col >= this.tilesRowCount
        ) {
            return undefined;
        }

        if (this.cursor.col < this.tilesRowCount - 1) {
            this.cursor.col++;
        } else {
            if (this.cursor.row < this.tilesRowCount - 1) {
                this.cursor.col = 0;
                this.cursor.row++;
            } else {
                return undefined;
            }
        }

        return this.cursor;
    }

    nextTile(){
        const cell = this.nextCell();

        if(cell === undefined){
            return null;
        }

        return this.board[cell.row][cell.col];
    }

    resetCursor(){
        this.cursor = { row: 0, col: 0 };
        return this.cursor;
    }

    resetTileCursor(){
        const cell = this.resetCursor();
        return this.board[cell.row][cell.col];
    }

    getCell(position){
        return this.board[position.row][position.col];
    }

    checkBlastUnablity() {
        let tile = this.resetTileCursor();

        while (tile !== null) {
            if (tile === undefined) {
                tile = this.nextTile();
            }

            let cells = this._search(tile);

            if ((cells.length + 1) >= this.blastTileCount) {
                this.disableShaking()();
                return;
            }

            tile = this.nextTile();
        }

        this.enableShaking()();
    }

    shakeBoard(){
        let cell = this.resetCursor();

        while(cell){
            let positionTo = {
                row: Math.floor(Math.random() * this.tilesRowCount),
                col: Math.floor(Math.random() * this.tilesRowCount)
            };

            let tileTo = this.getCell(positionTo);
            let tile = this.getCell(cell);

            tileTo.row = tile.row;
            tileTo.col = tile.col;

            tile.row = positionTo.row;
            tile.col = positionTo.col;

            tile.toMove = true;
            tileTo.toMove = true;

            this.changeCells(cell, positionTo);

            cell = this.nextCell();
        }
    }
}

export { GameBoard };
