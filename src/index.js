const StateMachine = require("javascript-state-machine");
import GraphicsApp from "./graphic";
import GameBoard from "./process";

const conf = {
    tilesRowCount: 9,
    blastTailCount: 2,

    graphics: {
        canvasWidth: 500, //430,
        canvasHeight: 550, //500,
        backgroundColor: 0xffffff,
        paddingWidthPercent: 3,
        tilePxGap: 1,

        spritesTintSet: [
            0x43c3fc, 0xf17ac5, 0xff617e, 0xf1d074, 0x89e36c, 0x996666,
        ],
    },
};

function theFall(fl) {
    for (let f = 0; f < fl.length; f++) {
        const colCells = board.fallCol(fl[f]);

        for (let c = 0; c < colCells.length; c++) {
            g.moveTile(colCells[c].tile, colCells[c].to);
        }
    }
}

function fillTopRow(){
    const emptyTopCells = board.searchForEmptiesInRows(0);

    for (let c = 0; c < emptyTopCells.length; c++) {
        let t = g.addTile(emptyTopCells[c]);
    
        board.addCell(t);
    }
}

function onClick() {
    let cells = [this];
    cells = cells.concat(board.search(this));

    if (cells.length < conf.blastTailCount) {
        return;
    }

    for (let i = 0; i < cells.length; i++) {
        board.cleanCell(cells[i]);
    }

    const fl = board.floor(cells);

    theFall(fl);

    let emptyTopCells = board.searchForEmptiesInRows(0);

    for (let c = 0; c < emptyTopCells.length; c++) {
        let t = g.addTile(emptyTopCells[c]);

        board.addCell(t);
    }

    let limitCounter = conf.tilesRowCount + 1;

    while(limitCounter--) {
        let emptyAll = board.searchForEmptiesInBoard(1);

        if(emptyAll.length == 0){
            break;
        }

        let flE = board.floorEmpty(emptyAll);
        console.log(flE);
        theFall(flE);

        fillTopRow();
    };
}

const board = new GameBoard(conf);
const g = new GraphicsApp(conf, onClick);
g.downloadField();

for (let c = 0; c < conf.tilesRowCount; c++) {
    for (let r = 0; r < conf.tilesRowCount; r++) {
        let t = g.addTile({ row: r, col: c });

        board.addCell(t);
    }
}
// let t;
// t = g.addTile({row:0, col:0}, 3);
// board.addCell(t);
// t = g.addTile({row:0, col:1}, 3);
// board.addCell(t);
// t = g.addTile({row:0, col:2}, 3);

// board.addCell(t);
// t = g.addTile({row:1, col:0}, 1);
// board.addCell(t);
// t = g.addTile({row:1, col:1}, 1);
// board.addCell(t);
// t = g.addTile({row:1, col:2}, 0);

// board.addCell(t);
// t = g.addTile({row:2, col:0}, 1);
// board.addCell(t);
// t = g.addTile({row:2, col:1}, 0);
// board.addCell(t);
// t = g.addTile({row:2, col:2}, 0);

// board.addCell(t);
// t = g.addTile({row:3, col:0}, 1);
// board.addCell(t);
// t = g.addTile({row:3, col:1}, 1);
// board.addCell(t);
// t = g.addTile({row:3, col:2}, 0);
// board.addCell(t);

const mainProc = new StateMachine({
    init: "init",
    transitions: [
        { name: "prep", from: "init", to: "start" },
        { name: "go", from: "start", to: "play" },
        { name: "shakelimit", from: "play", to: "end" },
        { name: "again", from: "end", to: "start" },
    ],
    methods: {
        onStart: function () {
            console.log("I started");
        },
        onPlay: function () {
            console.log("I play");
        },
        onEnd: function () {
            console.log("I ended");
        },
    },
});

// console.log(mainProc.state);
// mainProc.prep();
// console.log(mainProc.state);
// mainProc.go();
// console.log(mainProc.state);
// mainProc.shakelimit();
// console.log(mainProc.state);
// mainProc.again();
// console.log(mainProc.state);
