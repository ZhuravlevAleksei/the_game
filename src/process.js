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
        this.board[tile.row][tile.col] = undefined;
        tile.delete();
    }

    moveCell(coordFrom, coordTo){

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
            })
    
            colSliced.push(f);
        }
    
        const fl = [];
    
        for(let c = 0; c < colSliced.length; c++){
            fl.push(colSliced[c][0]);
        }
    
        return fl;
    }

    fallCol(row, col) {
        const cells = [];

        for (; row > 0; row--) {
            let cell = this.above(row, col);

            if (cell !== undefined){
                cells.push(cell);
            }
        }

        return cells;
    }
}
