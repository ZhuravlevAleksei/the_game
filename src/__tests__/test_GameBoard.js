import { GameBoard } from "../board.js";
import { conf } from "../config";

let board;

beforeEach(() => {
    board = new GameBoard(conf.graphics, conf.conditions.blastTileCount);
});

describe("GameBoard constructor", () => {
    test("object", () => {
        expect(board && typeof board === 'object').toBe(true);
    });
});

describe("GameBoard _predicateForExclude", () => {
    test("Filter board cells", () => {
        const testArray = [
            {row:0, col: 0},
            {row:1, col: 0},
            {row:0, col: 1}
        ];

        board.excludeSet = [
                    {row:1, col: 0},
                    {row:0, col: 1}
                ];

        const resArr = testArray.filter(board._predicateForExclude.bind(board));

        expect(resArr[0].row).toEqual(0);
        expect(resArr[0].col).toEqual(0);
        expect(resArr.length).toEqual(1);
    });
});
