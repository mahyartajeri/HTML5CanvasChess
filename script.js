/*
Checklist: 
En passant: done
Pawn promotion: done
Castling: done
Move tracking: Done
Board Flipping: Haven't started
Three fold repetition: Done
50-turn no capture tie: Done
Draw due to insufficient material: Done
Stalemate: Done
Checkmate: Done
*/



const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = canvas.width;
const height = canvas.height;
const squareSize = width / 8;
const gridSize = 8;
const imgSize = 85;
let board, boardHistory, selectedPiece, moving;
let wKing, wQueen, wRook, wKnight, wBishop, wPawn, bKing, bQueen, bRook, bKnight, bBishop, bPawn;
let potentialMove = undefined

let files = "abcdefgh".split("")
let ranks = "12345678".split("").reverse()

let mouse = {
    x: undefined,
    y: undefined,
}

class BoardHistory {
    constructor() {
        this.history = []
        this.notation = ""
        this.curentBoard = board
    }

    addBoard(b) {
        this.history.push(b)
    }

    addNotation(n) {
        if (this.history.length % 2 == 1) {
            this.notation += Math.ceil(this.history.length / 2).toString() + "." + n + " "
        } else {
            this.notation += n + " "
        }
    }
}

class Move {
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.promotionTo = undefined;
    }

    casualty(b) {
        return b.isPieceAt(this.x2, this.y2);
    }

    equals(m2) {
        return this.x1 == m2.x1 && this.x2 == m2.x2 && this.y1 == m2.y1 && this.y2 == m2.y2 && this.promotionTo == m2.promotionTo
    }

    clone() {
        let clonedMove = new Move(this.x1, this.y1, this.x2, this.y2)
        clonedMove.promotionTo = this.promotionTo

        return clonedMove
    }

    toString() {
        let string = ""
        string += this.x1.toString() + "-" + this.y1.toString() + "-" + this.x2.toString() + "-" + this.y2.toString() + "-" + this.promotionTo

        return string
    }
}

function setup() {
    board = new Board();
    board.findLegalMoves();
    console.log(board);
    boardHistory = new BoardHistory();
    boardHistory.addBoard(board.clone())
    selectedPiece = undefined;
    moving = false;
}

window.onload = function () {
    wKing = new Image();
    wKing.src = "./Assets/white_king.png";
    wQueen = new Image();
    wQueen.src = "./Assets/white_queen.png";
    wRook = new Image();
    wRook.src = "./Assets/white_rook.png";
    wKnight = new Image();
    wKnight.src = "./Assets/white_knight.png";
    wBishop = new Image();
    wBishop.src = "./Assets/white_bishop.png";
    wPawn = new Image();
    wPawn.src = "./Assets/white_pawn.png";

    bKing = new Image();
    bKing.src = "./Assets/black_king.png";
    bQueen = new Image();
    bQueen.src = "./Assets/black_queen.png";
    bRook = new Image();
    bRook.src = "./Assets/black_rook.png";
    bKnight = new Image();
    bKnight.src = "./Assets/black_knight.png";
    bBishop = new Image();
    bBishop.src = "./Assets/black_bishop.png";
    bPawn = new Image();
    bPawn.src = "./Assets/black_pawn.png";

    setup();
    animate();
}



canvas.addEventListener("mousedown", function (event) {
    if (!moving && board.promotion.promotingState == 0) {
        let x = Math.floor(event.x / squareSize);
        let y = Math.floor(event.y / squareSize);

        if (board.isPieceAt(x, y)) selectedPiece = board.pieceAt(x, y);
        else return;
        if (selectedPiece.color != board.turn) {
            selectedPiece = undefined;
            return;
        }

        selectedPiece.moving = true;
        moving = true;
        selectedPiece.px = mouse.x - selectedPiece.img.width / 2;
        selectedPiece.py = mouse.y - selectedPiece.img.height / 2;
    }
});

canvas.addEventListener("click", function (event) {
    if (board.promotion.promotingState > 0) {

        if (board.promotionPieceAt(event.x, event.y) != undefined) {
            selectedPiece = board.promotionPieceAt(event.x, event.y);
            // global potential move
            potentialMove.promotionTo = selectedPiece.symbol
        } else return;

        selectedPiece.x = board.promotion.x;
        selectedPiece.y = board.promotion.y;
        if (selectedPiece.color) {
            //remove old pawn 
            board.wp.splice(board.promotion.pawnIndex, 1);
            board.wp.push(selectedPiece);
            board.wp[board.wp.length - 1].movePx();
        } else {
            //remove old pawn
            board.bp.splice(board.promotion.pawnIndex, 1);
            board.bp.push(selectedPiece);
            board.bp[board.bp.length - 1].movePx();
        }
        boardHistory.addNotation(board.generateNotation(potentialMove, selectedPiece.symbol, selectedPiece.color))
        selectedPiece = undefined;
        board.clearPromotions();
        board.nextTurn();
    }
});

canvas.addEventListener("mouseup", function (event) {
    if (moving) {
        let x = Math.floor(event.x / squareSize);
        let y = Math.floor(event.y / squareSize);

        potentialMove = new Move(selectedPiece.x, selectedPiece.y, x, y);

        if (board.hasMove(potentialMove)) {
            selectedPiece.moveTo(board, x, y);
            selectedPiece.movePx();
            selectedPiece.moving = false;
            moving = false;

            if (board.promotion.promotingState == 0) {
                boardHistory.addNotation(board.generateNotation(potentialMove, selectedPiece.symbol, selectedPiece.color))
                board.nextTurn();
                console.log("legal move done!");
                potentialMove = undefined
            } else {
                board.showPromotions();
            }
            selectedPiece = undefined
        }
        //Illegal Move or No Move
        else {
            selectedPiece.movePx();
            selectedPiece.moving = false;
            if (selectedPiece.x != x || selectedPiece.y != y) console.log("illegal move!");
            selectedPiece = undefined;
            moving = false;
        }
    }
});

canvas.addEventListener("mousemove", function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    if (moving) {
        selectedPiece.px = mouse.x - selectedPiece.img.width / 2;
        selectedPiece.py = mouse.y - selectedPiece.img.height / 2;
    }
});

function showPossibleMoves() {
    let pm = selectedPiece.getPossibleMoves(board);

    for (let i = 0; i < pm.length; i++) {
        ctx.fillStyle = "yellow";
        ctx.fillRect(pm[i].x2 * squareSize, pm[i].y2 * squareSize, squareSize, squareSize);
    }
}

function drawSquares() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if ((j + i) % 2 == 0) ctx.fillStyle = "beige";
            else ctx.fillStyle = "grey";
            ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize);

        }
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);
    drawSquares();
    if (selectedPiece != undefined) {
        showPossibleMoves();
    }
    board.show();
    if (board.promotion.promotingState > 0) {
        ctx.fillStyle = "blue";
        ctx.fillRect(1 * squareSize, 3 * squareSize, 6 * squareSize, 2 * squareSize);
        board.showPromotions();
        //console.log(board.promotion);
    }
    //console.log(mouse.x, mouse.y);
    requestAnimationFrame(animate);
}