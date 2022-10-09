 const conf = {
    conditions: {
        blastTileCount: 3,
        scoreToWin: 50,
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
    dashboard: {
        canvasWidth: 600,
        canvasHeight: 700,
        backgroundColor: 0xffffff,

        progressBar: {
            Width: 578,
            Height: 109,
            X: 10,
            Y: 30
        },
        scoreIndicator: {
            Width: 360,
            Height: 350,
            X: 200,
            Y: 180
        },
        shakeButton: {
            Width: 70,
            Height: 70,
            X: 70,
            Y: 260
        }
    }
};

export {conf};