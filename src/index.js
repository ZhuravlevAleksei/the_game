const StateMachine = require("javascript-state-machine");
import { GraphicsApp } from "./graphic";
import { GameBoard } from "./board";
import { GameConditions } from "./process";
import { conf } from "./config.js";


const proc = new GameConditions(conf.conditions);
const board = new GameBoard(conf.graphics, conf.conditions.blastTileCount);

const boardHandlerMixin = {
    __proto__: board,

    blast(){return super.blast.bind(board)},

    searchForEmptiesInRows(){return super.searchForEmptiesInRows.bind(board)},

    addCells(){return super.addCells.bind(board)},

    collsToFall(){return super.collsToFall.bind(board)},

    nextTile(){return super.nextTile.bind(board)},

    resetTileCursor(){return super.resetTileCursor.bind(board)},

    shakeBoard(){return super.shakeBoard.bind(board)}
}

Object.assign(GraphicsApp.prototype, boardHandlerMixin);
const g = new GraphicsApp(conf.graphics);

// --------------------------------------------------------
g.fillAll();
g.shake();

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
