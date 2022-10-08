const StateMachine = require("javascript-state-machine");
import GraphicsApp from "./graphic";
import GameBoard from "./board";
import {GameConditions} from "./process"
import {conf} from "./config.js"


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

    if (cells.length < conf.conditions.blastTailCount) {
        return;
    }

    for (let i = 0; i < cells.length; i++) {
        board.cleanCell(cells[i]);
        cells[i].delete();
    }

    const fl = board.floor(cells);

    theFall(fl);

    let emptyTopCells = board.searchForEmptiesInRows(0);

    for (let c = 0; c < emptyTopCells.length; c++) {
        let t = g.addTile(emptyTopCells[c]);

        board.addCell(t);
    }

    let limitCounter = conf.graphics.tilesRowCount + 1;

    while(limitCounter--) {
        let emptyAll = board.searchForEmptiesInBoard(1);

        if(emptyAll.length == 0){
            break;
        }

        let flE = board.floorEmpty(emptyAll);
        theFall(flE);

        fillTopRow();
    };
}

const proc = new GameConditions(conf.conditions);
const board = new GameBoard(conf.graphics);
const g = new GraphicsApp(conf.graphics, onClick);

// --------------------------------------------------------
for (let c = 0; c < conf.graphics.tilesRowCount; c++) {
    for (let r = 0; r < conf.graphics.tilesRowCount; r++) {
        let t = g.addTile({ row: r, col: c });

        board.addCell(t);
    }
}

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
