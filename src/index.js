const StateMachine = require("javascript-state-machine");
import GraphicsApp from "./graphic";
import GameBoard from "./process";

const conf = {
    tilesRowCount: 5,
    blastTailCount: 2,

    graphics: {
        canvasWidth: 430,
        canvasHeight: 500,
        backgroundColor: 0xffffff,
        paddingWidthPercent: 3,
        tilePxGap: 1,

        spritesTintSet: [0x43c3fc, 0xf17ac5, 0xff617e, 0xf1d074, 0x89e36c],
    },
};

function onClick() {
    let cells = [this];
    cells = cells.concat(board.search(this));

    if (cells.length < conf.blastTailCount) {
        return;
    }

    const fl = board.floor(cells);

    for (let i = 0; i < cells.length; i++) {
        board.cleanCell(cells[i]);
    }

    for(let f = 0; f < fl.length; f++){
        let cells = board.fallCol(fl[f].row, fl[f].col);
        console.log(cells);

        for (let c = 0; c < cells.length; c++){
            console.log(cells[c]);
            g.moveTile(cells[c], fl[f].row--, fl[f].col)
        }
    }
}

const board = new GameBoard(conf);
const g = new GraphicsApp(conf, onClick);
g.downloadField();

for (let c = 0; c < conf.tilesRowCount; c++) {
    for (let r = 0; r < conf.tilesRowCount; r++) {
        let t = g.addTile(r, c);

        board.addCell(t);
    }
}
// let t;
// t = g.addTile(0, 0, 0);
// board.addCell(t);
// t = g.addTile(0, 1, 0);
// board.addCell(t);
// t = g.addTile(0, 2, 0);
// board.addCell(t);
// t = g.addTile(1, 0, 0);
// board.addCell(t);
// t = g.addTile(1, 2, 0);
// board.addCell(t);
// t = g.addTile(2, 0, 0);
// board.addCell(t);
// t = g.addTile(2, 1, 0);
// board.addCell(t);
// t = g.addTile(2, 2, 0);
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
