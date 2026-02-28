"use strict";// 迷路データ（0：通路、1：目的地、2：荷物、6：壁、3：荷物が置かれた目的地）

let data;
let px;
let py;
let bsize;
let gc;
let isCleared = false;

let imgWall, imgGoal, imgWorker, imgLuggage;

window.onload = function () {
    init(stageConfig);
};

function init(config) {
    data = config.map;
    px = config.startX;
    py = config.startY;
    bsize = config.blockSize;

    gc = document.getElementById("soko").getContext("2d");

    imgWall = document.getElementById("imgWall");
    imgGoal = document.getElementById("imgGoal");
    imgWorker = document.getElementById("imgWorker");
    imgLuggage = document.getElementById("imgLuggage");

    window.onkeydown = mykeydown;

    repaint();
}

function mykeydown(e) { //キーを押された時の動き
    let dx0 = px
    let dy0 = py
    let dx1 = px
    let dy1 = py
    switch (e.keyCode) {
        case 40:
            dx0--
            dx1 -= 2
            break
        case 37:
            dy0--
            dy1 -= 2
            break
        case 38:
            dx0++
            dx1 += 2
            break
        case 39:
            dy0++
            dy1 += 2
            break
    }

    if ((data[dy0][dx0] & 0x2) == 0) {
        px = dx0
        py = dy0
    } else if ((data[dy0][dx0] & 0x6) == 2) {
        if ((data[dy1][dx1] & 0x2) == 0) {
            data[dy0][dx0] ^= 2
            data[dy1][dx1] |= 2
            px = dx0
            py = dy0
        }
    }

    repaint()

    if (checkClear()) {
        setTimeout(() => {
            onStageClear();
        }, 100);
    }
}

function mybtndown(e) { //ボタンを押された時の動き
    let dx0 = px
    let dy0 = py
    let dx1 = px
    let dy1 = py
    switch (e.keyCode) {
        case 40:
            dx0--
            dx1 -= 2
            break
        case 37:
            dy0--
            dy1 -= 2
            break
        case 38:
            dx0++
            dx1 += 2
            break
        case 39:
            dy0++
            dy1 += 2
            break
    }

    if ((data[dy0][dx0] & 0x2) == 0) {
        px = dx0
        py = dy0
    } else if ((data[dy0][dx0] & 0x6) == 2) {
        if ((data[dy1][dx1] & 0x2) == 0) {
            data[dy0][dx0] ^= 2
            data[dy1][dx1] |= 2
            px = dx0
            py = dy0
        }
    }

    repaint()

    if (checkClear()) {
        setTimeout(() => {
            onStageClear();
        }, 100);
    }

    // if (true) {
    //     setTimeout(() => {
    //         onStageClear();
    //     }, 100);
    // }
}

function repaint() {
    gc.fillStyle = "black";
    gc.fillRect(0, 0, 440, 800);
    for (let y=0; y<data.length; y++) {
        for (let x=0; x<data[y].length; x++) {
            if (data[y][x] & 0x1) {
                gc.drawImage(imgGoal, x * bsize, y * bsize, bsize, bsize);
            }
            if (data[y][x] & 0x2) {
                gc.drawImage(imgLuggage, x * bsize, y * bsize, bsize, bsize);
            }
            if (data[y][x] == 6) {
                gc.drawImage(imgWall, x * bsize, y * bsize, bsize, bsize);
            }
        }
    }
    gc.drawImage(imgWorker, px * bsize, py * bsize, bsize, bsize);
    console.log(data)
}


// クリアしたときの処理
function showClear() {
    document.getElementById("clearOverlay").classList.add("active");
}

function closeClear() {
    document.getElementById("clearOverlay").classList.remove("active");
}

function onStageClear() {
    isCleared = true;
    window.onkeydown = null; // 入力停止
    showClear();
}

function getCurrentStageNumber() {
    const bodyClass = document.body.className;
    const match = bodyClass.match(/stage(\d+)/);
    return match ? parseInt(match[1]) : 1;
}

function goNextStage() {
    const current = getCurrentStageNumber();
    const next = current + 1;

    window.location.href = `stage${next}.html`;
}

function checkClear() {
    for (let y = 0; y < data.length; y++) {
        for (let x = 0; x < data[y].length; x++) {
            if (data[y][x] === 1) {
                return false; // まだクリアしてない
            }
        }
    }
    return true; // クリアした
}