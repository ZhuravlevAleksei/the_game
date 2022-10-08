import getProperty from "./utils";

function boardInit(count, value) {
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

export default class GameBoard {
    constructor(config) {
        this.tilesRowCount = getProperty("tilesRowCount", config);

        this.board = boardInit(this.tilesRowCount, undefined);

        return this;
    }

    addCell(tile) {
        this.board[tile.row][tile.col] = tile;
    }

    cleanCell(tile) {
        const row = tile.row;
        const col = tile.col;

        tile.delete();
        this.board[row][col] = undefined;
    }

    moveCell(coordFrom, coordTo) {
        this.board[coordTo.row][coordTo.col] = this.board[coordFrom.row][coordFrom.col];
        this.board[coordFrom.row][coordFrom.col] = undefined;
    }

    right(row, col) {
        let nCol = col + 1;

        if (nCol >= this.tilesRowCount) {
            return undefined;
        }

        if (this.board[row][nCol] === undefined) {
            return undefined;
        }

        return this.board[row][nCol];
    }

    under(row, col) {
        let nRow = row + 1;

        if (nRow >= this.tilesRowCount) {
            return undefined;
        }

        if (this.board[nRow][col] === undefined) {
            return undefined;
        }

        return this.board[nRow][col];
    }

    left(row, col) {
        let nCol = col - 1;

        if (nCol < 0) {
            return undefined;
        }

        if (this.board[row][nCol] === undefined) {
            return undefined;
        }

        return this.board[row][nCol];
    }

    above(row, col) {
        let nRow = row - 1;

        if (nRow < 0) {
            return undefined;
        }

        if (this.board[nRow][col] === undefined) {
            return undefined;
        }

        return this.board[nRow][col];
    }

    directions = [
        this.right.bind(this),
        this.under.bind(this),
        this.left.bind(this),
        this.above.bind(this),
    ];

    neighbours(row, col, colorIndex) {
        const cells = [];

        for (let d = 0; d < this.directions.length; d++) {
            let cell = this.directions[d](row, col);

            if (cell === undefined) {
                continue;
            }

            if (cell.colorIndex == colorIndex) {
                cells.push(cell);
            }
        }

        return cells;
    }

    predicateForExclude(n) {
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

    search(currCell, prevCells) {
        const nbs = this.neighbours(
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
            toSearch = nbs.filter(this.predicateForExclude.bind(this));
        }

        let nCells = toSearch;

        for (let n = 0; n < toSearch.length; n++) {
            let res = this.search(toSearch[n], prevCells);

            // closure handling
            this.excludeSet = nCells;
            let fRes = res.filter(this.predicateForExclude.bind(this));

            nCells = nCells.concat(fRes);
        }

        return nCells;
    }

    floor(cells) {
        cells.sort((a, b) => {
            return a.col > b.col;
        });

        const colSliced = [];

        for (let c = cells[0].col; c <= cells[cells.length - 1].col; c++) {
            let f = cells.filter((n) => {
                return n.col == c;
            });

            f.sort((a, b) => {
                return a.row < b.row;
            });

            colSliced.push(f);
        }

        const fl = [];

        for (let c = 0; c < colSliced.length; c++) {
            fl.push({ row: colSliced[c][0].row, col: colSliced[c][0].col });
        }

        return fl;
    }

    floorEmpty(cellsPosition) {
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

    fallCol(coordinate) {
        const cells = [];
        let displacement;
        let dispCellCount = 0;
        let row = coordinate.row;

        for (; row > 0; row--) {
            let cell = this.above(row, coordinate.col);

            if (cell !== undefined) {
                displacement = coordinate.row - row + 1 - dispCellCount++;

                let from = { row: cell.row, col: cell.col };
                let to = { row: cell.row + displacement, col: cell.col };

                cells.push({ tile: cell, to: to });

                this.moveCell(from, to);
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

    searchForEmptiesInBoard(topRow){
        let emptyAll = [];

        for(let r = topRow; r < this.tilesRowCount; r++){
            let empty = this.searchForEmptiesInRows(r);
            emptyAll = emptyAll.concat(empty);
        }

        return emptyAll;
    }
}
