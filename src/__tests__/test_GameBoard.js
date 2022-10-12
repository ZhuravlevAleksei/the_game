import { GameBoard } from "../board.js";
import { conf } from "../config";
import {beforeEach, jest} from '@jest/globals'


let board;

beforeEach(() => {
    board = new GameBoard(conf.graphics, conf.conditions.blastTileCount);
});

afterEach(() => {
    board = undefined;
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

        expect(
            (resArr[0].row == 0) && (resArr[0].col == 0) && (resArr.length == 1)
            ).toBe(true);
    });
});

describe("GameBoard _floorEmpty", () => {
    beforeEach(() => {
        board._searchForEmptiesInBoard = jest.fn();
    });

    afterEach(() => {
        board._searchForEmptiesInBoard = undefined;
    });

    test("No empties", () => {
        board._searchForEmptiesInBoard.mockReturnValue([])

        expect(board._floorEmpty()).toEqual([]);
    });

    test("One cell", () => {
        board._searchForEmptiesInBoard.mockReturnValue([{row: 0, col: 0}])

        expect(board._floorEmpty()).toEqual([{row: 0, col: 0}]);
    });

    test("One column", () => {
        board._searchForEmptiesInBoard.mockReturnValue([
            {row: 1, col: 2},
            {row: 2, col: 2},
            {row: 3, col: 2}
        ]);

        expect(board._floorEmpty()).toEqual([
            {row: 3, col: 2}
        ]);
    });

    test("Two columns", () => {
        board._searchForEmptiesInBoard.mockReturnValue([
            {row: 1, col: 2}, {row: 3, col: 4},
            {row: 2, col: 2}, {row: 2, col: 4},
            {row: 3, col: 2}, {row: 1, col: 4}
        ]);

        expect(board._floorEmpty()).toEqual([
            {row: 3, col: 2}, {row: 3, col: 4}
        ]);
    });

    test("One column rev row sort", () => {
        board._searchForEmptiesInBoard.mockReturnValue([
            {row: 3, col: 2},
            {row: 2, col: 2},
            {row: 1, col: 2}
        ]);

        expect(board._floorEmpty()).toEqual([
            {row: 3, col: 2}
        ]);
    });

    test("One row", () => {
        board._searchForEmptiesInBoard.mockReturnValue([
            {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 4}
        ]);

        expect(board._floorEmpty()).toEqual([
            {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 4}
        ]);
    });

    test("Square", () => {
        board._searchForEmptiesInBoard.mockReturnValue([
            {row: 2, col: 1}, {row: 2, col: 2},
            {row: 3, col: 1}, {row: 3, col: 2}
        ]);

        expect(board._floorEmpty()).toEqual([
            {row: 3, col: 1}, {row: 3, col: 2}
        ]);
    });

    test("S-figure", () => {
        board._searchForEmptiesInBoard.mockReturnValue([
            {row: 2, col: 2}, {row: 2, col: 3},
            {row: 3, col: 2},
            {row: 4, col: 1}, {row: 4, col: 2}
        ]);

        expect(board._floorEmpty()).toEqual([
            {row: 4, col: 1}, {row: 4, col: 2}, {row: 2, col: 3}
        ]);
    });

    test("Rev S-figure", () => {
        board._searchForEmptiesInBoard.mockReturnValue([
            {row: 2, col: 1}, {row: 2, col: 2},
            {row: 3, col: 2},
            {row: 4, col: 2}, {row: 4, col: 3}
        ]);

        expect(board._floorEmpty()).toEqual([
            {row: 2, col: 1}, {row: 4, col: 2}, {row: 4, col: 3}
        ]);
    });
});
