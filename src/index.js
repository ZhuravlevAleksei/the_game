import { GraphicsApp } from "./graphic";
import { GameBoard } from "./board";
import { GameConditions } from "./process";
import { conf } from "./config.js";
import { DashboardApp } from "./dashboard";

const mainMethods = {
    shake: undefined,
    showScore: undefined,
    showClick: undefined,
    showProgress: undefined,
    shakeButtonEffect: undefined,
    winningEffect: undefined,
    losingEffect: undefined,
    lockTiles: undefined,
};

const proc = new GameConditions(conf.conditions, mainMethods);

const procHandlerMixin = {
    __proto__: proc,

    enableShaking() {
        return super.enableShaking.bind(proc);
    },

    disableShaking() {
        return super.disableShaking.bind(proc);
    },

    clickCounter() {
        return super.clickCounter.bind(proc);
    },

    checkSuperTileMode() {
        return super.checkSuperTileMode.bind(proc);
    },
};

Object.assign(GameBoard.prototype, procHandlerMixin);

const board = new GameBoard(conf.graphics, conf.conditions.blastTileCount);

const boardHandlerMixin = {
    __proto__: board,

    blast() {
        return super.blast.bind(board);
    },

    searchForEmptiesInRows() {
        return super.searchForEmptiesInRows.bind(board);
    },

    addCells() {
        return super.addCells.bind(board);
    },

    collsToFall() {
        return super.collsToFall.bind(board);
    },

    nextTile() {
        return super.nextTile.bind(board);
    },

    resetTileCursor() {
        return super.resetTileCursor.bind(board);
    },

    shakeBoard() {
        return super.shakeBoard.bind(board);
    },

    checkBlastUnablity() {
        return super.checkBlastUnablity.bind(board);
    },
};

Object.assign(GraphicsApp.prototype, boardHandlerMixin);
const g = new GraphicsApp(conf.graphics);

const procDashboardHandlerMixin = {
    __proto__: proc,

    shakeButton() {
        return super.shakeButton.bind(proc);
    },
};

Object.assign(DashboardApp.prototype, procDashboardHandlerMixin);

const d = new DashboardApp(conf.dashboard);
mainMethods.shake = g.shake.bind(g);
mainMethods.showScore = d.showScore.bind(d);
mainMethods.showClick = d.showClick.bind(d);
mainMethods.showProgress = d.showProgress.bind(d);
mainMethods.shakeButtonEffect = d.shakeButtonEffect.bind(d);
mainMethods.winningEffect = d.winningEffect.bind(d);
mainMethods.losingEffect = d.losingEffect.bind(d);
mainMethods.lockTiles = g.lockTiles.bind(g);
// --------------------------------------------------------
g.fillAll();

proc.init();
