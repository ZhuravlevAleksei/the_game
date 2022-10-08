 const conf = {
    conditions: {
        blastTailCount: 2,
        scoreToWin: 100,
        clickLimit: 30,
        shakeLimit: 3,
    },
    graphics: {
        tilesRowCount: 9,
        canvasWidth: 600, //430,
        canvasHeight: 700, //500,
        backgroundColor: 0xffffff,
        paddingWidthPercent: 3,
        tilePxGap: 1,

        spritesTintSet: [
            0x43c3fc, 0xf17ac5, 0xff617e, 0xf1d074, 0x89e36c, 0x996666,
        ],
    },
};

export {conf};