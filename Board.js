class Board {
    constructor() {
        //White and black pieces
        this.wp = [];
        this.bp = [];
        this.promotions = [];
        this.legalMoves = [];
        this.turn = true;
        this.checkmate = false
        this.stalemate = false
        this.repetition = false
        this.fifty = false
        this.insufficientMaterial = false
        this.initializePieces();
        this.promotion = {
            promotingState: false,
            x: -1,
            y: -1,
            pawnIndex: -1,
        }
        this.id = 0
        this.noCaptureCounter = 0
    }

    initializePieces() {
        //White
        this.wp.push(new King(4, 7, true));
        this.wp.push(new Queen(3, 7, true));
        this.wp.push(new Rook(0, 7, true));
        this.wp.push(new Rook(7, 7, true));
        this.wp.push(new Bishop(2, 7, true));
        this.wp.push(new Bishop(5, 7, true));
        this.wp.push(new Knight(1, 7, true));
        this.wp.push(new Knight(6, 7, true));

        //Black
        this.bp.push(new King(4, 0, false));
        this.bp.push(new Queen(3, 0, false));
        this.bp.push(new Rook(0, 0, false));
        this.bp.push(new Rook(7, 0, false));
        this.bp.push(new Bishop(2, 0, false));
        this.bp.push(new Bishop(5, 0, false));
        this.bp.push(new Knight(1, 0, false));
        this.bp.push(new Knight(6, 0, false));


        for (let i = 0; i < 8; i++) {
            //White and black pawns
            this.wp.push(new Pawn(i, 6, true));
            this.bp.push(new Pawn(i, 1, false));
        }
    }

    generateID() {
        let idString = ""

        idString += "white"
        for (let i = 0; i < this.wp.length; i++) {
            idString += this.wp[i].symbol
            idString += this.wp[i].x.toString() + this.wp[i].y.toString()
        }

        idString += "black"
        for (let i = 0; i < this.bp.length; i++) {
            idString += this.bp[i].symbol
            idString += this.bp[i].x.toString() + this.bp[i].y.toString()
        }

        idString += "moves"
        for (let i = 0; i < this.legalMoves.length; i++) {
            idString += this.legalMoves.toString()
        }

        return idString
    }

    clone() {
        let b2 = new Board()
        b2.wp = []
        b2.bp = []
        b2.legalMoves = []
        b2.id = this.id
        b2.turn = this.turn
        b2.noCaptureCounter = this.noCaptureCounter
        for (let i = 0; i < this.wp.length; i++) {
            b2.wp[i] = this.wp[i].clone()
        }
        for (let i = 0; i < this.bp.length; i++) {
            b2.bp[i] = this.bp[i].clone()
        }

        for (let i = 0; i < this.legalMoves.length; i++) {
            b2.legalMoves[i] = this.legalMoves[i].clone()
        }

        return b2
    }

    show() {
        for (let i = 0; i < this.wp.length; i++) {
            this.wp[i].show(this.turn);
        }
        for (let i = 0; i < this.bp.length; i++) {
            this.bp[i].show(this.turn);
        }
    }
    isPieceAt(x, y) {
        for (let i = 0; i < this.wp.length; i++) {
            if (this.wp[i].x == x && this.wp[i].y == y) {
                return true;
            }
        }
        for (let i = 0; i < this.bp.length; i++) {
            if (this.bp[i].x == x && this.bp[i].y == y) {
                return true;
            }
        }
        return false;
    }

    pieceAt(x, y) {
        for (let i = 0; i < this.wp.length; i++) {
            if (this.wp[i].x == x && this.wp[i].y == y) {
                return this.wp[i];
            }
        }
        for (let i = 0; i < this.bp.length; i++) {
            if (this.bp[i].x == x && this.bp[i].y == y) {
                return this.bp[i];
            }
        }
    }

    getKingPos() {
        //If white's turn, find black king
        if (this.turn) {
            for (let i = 0; i < this.bp.length; i++) {
                if (this.bp[i] instanceof King) {
                    return [this.bp[i].x, this.bp[i].y]
                }
            }
        }
        //vice versa
        else {
            for (let i = 0; i < this.wp.length; i++) {
                if (this.wp[i] instanceof King) {
                    return [this.wp[i].x, this.wp[i].y]
                }
            }
        }
    }

    findLegalMoves() {
        if (this.turn) {
            for (let i = 0; i < this.wp.length; i++) {
                this.wp[i].addPieceMoves(this);
            }
        } else {
            for (let i = 0; i < this.bp.length; i++) {
                this.bp[i].addPieceMoves(this);
            }
        }

        this.id = this.generateID()
    }

    shortCastleAble(color) {
        let validKing, validRook = false;
        if (color) {
            for (let i = 0; i < this.wp.length; i++) {
                if (this.wp[i] instanceof King && this.wp[i].x == 4 && this.wp[i].y == 7) {
                    if (!this.wp[i].hasMoved) validKing = true;
                }
                if (this.wp[i] instanceof Rook && this.wp[i].x == 7 && this.wp[i].y == 7) {
                    if (!this.wp[i].hasMoved) validRook = true;
                }
            }
            for (let i = 0; i < this.bp.length; i++) {
                // Can't Castle Through Check
                if (this.bp[i].canMoveTo(this, 5, 7) || this.isPieceAt(5, 7)) return false;
                if (this.bp[i].canMoveTo(this, 6, 7) || this.isPieceAt(6, 7)) return false;

                // Can't Castle Out of Check
                if (this.bp[i].canMoveTo(this, 4, 7)) return false
            }
        } else {
            for (let i = 0; i < this.bp.length; i++) {
                if (this.bp[i] instanceof King && this.bp[i].x == 4 && this.bp[i].y == 0) {
                    if (!this.bp[i].hasMoved) validKing = true;
                }
                if (this.bp[i] instanceof Rook && this.bp[i].x == 7 && this.bp[i].y == 0) {
                    if (!this.bp[i].hasMoved) validRook = true;
                }
            }
            for (let i = 0; i < this.wp.length; i++) {
                // Can't Castle Through Check
                if (this.wp[i].canMoveTo(this, 5, 0) || this.isPieceAt(5, 0)) return false;
                if (this.wp[i].canMoveTo(this, 6, 0) || this.isPieceAt(6, 0)) return false;

                // Can't Castle Out of Check
                if (this.wp[i].canMoveTo(this, 4, 0)) return false
            }
        }
        return validKing && validRook;
    }

    longCastleAble(color) {
        let validKing, validRook = false;
        if (color) {
            for (let i = 0; i < this.wp.length; i++) {
                if (this.wp[i] instanceof King && this.wp[i].x == 4 && this.wp[i].y == 7) {
                    if (!this.wp[i].hasMoved) validKing = true;
                }
                if (this.wp[i] instanceof Rook && this.wp[i].x == 0 && this.wp[i].y == 7) {
                    if (!this.wp[i].hasMoved) validRook = true;
                }
            }
            for (let i = 0; i < this.bp.length; i++) {
                // Can't Castle Through Check
                if (this.bp[i].canMoveTo(this, 3, 7) || this.isPieceAt(3, 7)) return false;
                if (this.bp[i].canMoveTo(this, 2, 7) || this.isPieceAt(2, 7)) return false;
                if (this.bp[i].canMoveTo(this, 1, 7) || this.isPieceAt(1, 7)) return false;

                // Can't Castle Out of Check
                if (this.bp[i].canMoveTo(this, 4, 7)) return false
            }
        } else {
            for (let i = 0; i < this.bp.length; i++) {
                if (this.bp[i] instanceof King && this.bp[i].x == 4 && this.bp[i].y == 0) {
                    if (!this.bp[i].hasMoved) validKing = true;
                }
                if (this.bp[i] instanceof Rook && this.bp[i].x == 0 && this.bp[i].y == 0) {
                    if (!this.bp[i].hasMoved) validRook = true;
                }
            }
            for (let i = 0; i < this.wp.length; i++) {
                // Can't Castle Through Check
                if (this.wp[i].canMoveTo(this, 3, 0) || this.isPieceAt(3, 0)) return false;
                if (this.wp[i].canMoveTo(this, 2, 0) || this.isPieceAt(2, 0)) return false;
                if (this.wp[i].canMoveTo(this, 1, 0) || this.isPieceAt(1, 0)) return false;

                // Can't Castle Out of Check
                if (this.wp[i].canMoveTo(this, 4, 0)) return false
            }
        }
        return validKing && validRook;
    }

    castleRook(x, y) {
        //White 
        if (y == 7) {
            //Short
            if (x == 6) {
                for (let i = 0; i < this.wp.length; i++) {
                    if (this.wp[i] instanceof Rook && this.wp[i].x == 7) {
                        this.wp[i].moveTo(this, x - 1, y);
                        this.wp[i].movePx();
                    }
                }
            }
            //Long
            else {
                for (let i = 0; i < this.wp.length; i++) {
                    if (this.wp[i] instanceof Rook && this.wp[i].x == 0) {
                        this.wp[i].moveTo(this, x + 1, y);
                        this.wp[i].movePx();
                    }
                }
            }
        }
        //Black
        else {
            //Short
            if (x == 6) {
                for (let i = 0; i < this.bp.length; i++) {
                    if (this.bp[i] instanceof Rook && this.bp[i].x == 7) {
                        this.bp[i].moveTo(this, x - 1, y);
                        this.bp[i].movePx();
                    }
                }
            }
            //Long
            else {
                for (let i = 0; i < this.bp.length; i++) {
                    if (this.bp[i] instanceof Rook && this.bp[i].x == 0) {
                        this.bp[i].moveTo(this, x + 1, y);
                        this.bp[i].movePx();
                    }
                }
            }
        }
        castleSound.play()
    }

    enPassantCapture(color, x, y) {
        //White Capturing Black Piece
        if (color) {
            this.capture(x, y + 1);
        }
        //Black Capturing White Piece
        else {
            this.capture(x, y - 1);
        }
    }

    //Creates a hypothetical board based on a move
    generateNewBoard(move) {
        let newBoard = new Board();
        newBoard.clearPieces();
        for (let i = 0; i < this.wp.length; i++) {
            newBoard.wp.push(this.wp[i].clone());
        }
        for (let i = 0; i < this.bp.length; i++) {
            newBoard.bp.push(this.bp[i].clone());
        }
        newBoard.turn = !this.turn;


        if (this.turn) {
            for (let i = 0; i < newBoard.wp.length; i++) {
                if (newBoard.wp[i].x == move.x1 &&
                    newBoard.wp[i].y == move.y1) {
                    newBoard.wp[i].moveTo(newBoard, move.x2, move.y2);
                    break;
                }
            }
        } else {
            for (let i = 0; i < newBoard.bp.length; i++) {
                if (newBoard.bp[i].x == move.x1 &&
                    newBoard.bp[i].y == move.y1) {
                    newBoard.bp[i].moveTo(newBoard, move.x2, move.y2)
                    break;
                }
            }
        }
        return newBoard;
    }

    kingIsSafe(move) {
        let tempBoard = this.generateNewBoard(move);
        let kx = tempBoard.getKingPos()[0];
        let ky = tempBoard.getKingPos()[1];

        if (tempBoard.turn) {
            for (let i = 0; i < tempBoard.wp.length; i++) {
                if (tempBoard.wp[i].canMoveTo(tempBoard, kx, ky)) {
                    return false;
                }
            }
        } else {
            for (let i = 0; i < tempBoard.bp.length; i++) {
                if (tempBoard.bp[i].canMoveTo(tempBoard, kx, ky)) {
                    return false;
                }
            }
        }
        return true;
    }

    capture(x, y) {
        for (let i = 0; i < this.wp.length; i++) {
            if (this.wp[i].x == x && this.wp[i].y == y) {
                this.wp.splice(i, 1);
                if (this == board) {
                    this.noCaptureCounter = -1
                    console.log("---------------CApturedd sheesh----------------")
                    capturePieceSound.play()
                }
                return;
            }
        }
        for (let i = 0; i < this.bp.length; i++) {
            if (this.bp[i].x == x && this.bp[i].y == y) {
                this.bp.splice(i, 1);
                if (this == board) {
                    this.noCaptureCounter = -1
                    console.log("---------------CApturedd sheesh----------------")
                    capturePieceSound.play()
                }
                return;
            }
        }

    }

    hasMove(move) {
        for (let i = 0; i < this.legalMoves.length; i++) {
            if (this.legalMoves[i].x1 == move.x1 && this.legalMoves[i].y1 == move.y1 &&
                this.legalMoves[i].x2 == move.x2 && this.legalMoves[i].y2 == move.y2) {
                return true;
            }
        }
        return false;
    }

    clearEnPassants() {
        //Assuming turn is switched then this method is called
        if (this.turn) {
            for (let i = 0; i < this.wp.length; i++) {
                if (this.wp[i] instanceof Pawn) this.wp[i].justMovedTwoSpaces = false;
            }
        } else {
            for (let i = 0; i < this.bp.length; i++) {
                if (this.bp[i] instanceof Pawn) this.bp[i].justMovedTwoSpaces = false;
            }
        }
    }

    createPromotions() {
        let n, b, r, q, color;
        if (this.promotion.promotingState == 1) color = true;
        else if (this.promotion.promotingState == 2) color = false;
        n = new Knight(2, 3.5, color);
        b = new Bishop(3, 3.5, color);
        r = new Rook(4, 3.5, color);
        q = new Queen(5, 3.5, color);

        this.promotions.push(n, b, r, q);
    }

    showPromotions() {
        for (let i = 0; i < this.promotions.length; i++) {
            this.promotions[i].show(true);
        }
    }

    promotionPieceAt(px, py) {
        if (py > canvas.height / 2 + imgSize / 2 || py < canvas.height / 2 - imgSize / 2) {
            return undefined;
        }
        let x = Math.floor(px / squareSize);
        if (x < 2 || x > 5) return undefined;
        else return this.promotions[x - 2];
    }

    clearPromotions() {
        this.promotions = [];
        this.promotion.promotingState = 0;
        this.promotion.x = -1;
        this.promotion.y = -1;
    }

    clearMoves() {
        this.legalMoves = [];
    }

    clearPieces() {
        this.wp = [];
        this.bp = [];
    }

    inCheck(color) {
        let kingPos = [-1, -1]
        // Check if White King is in Check
        if (color) {
            // get white king pos
            for (let i = 0; i < this.wp.length; i++) {
                if (this.wp[i] instanceof King) {
                    kingPos = [this.wp[i].x, this.wp[i].y]
                }
            }
            for (let i = 0; i < this.bp.length; i++) {
                if (this.bp[i].canMoveTo(this, kingPos[0], kingPos[1])) {
                    return true
                }
            }
        } else {
            // get black king pos
            for (let i = 0; i < this.bp.length; i++) {
                if (this.bp[i] instanceof King) {
                    kingPos = [this.bp[i].x, this.bp[i].y]
                }
            }
            for (let i = 0; i < this.wp.length; i++) {
                if (this.wp[i].canMoveTo(this, kingPos[0], kingPos[1])) {
                    return true
                }
            }
        }

        return false
    }

    // Can trim this down to just id now
    equals(b2) {
        // Check if same number of pieces
        if (this.wp.length != b2.wp.length || this.bp.length != b2.wp.length) return false

        // Check ID
        if (this.id != b2.id) return false

        // must be the same player's move
        if (this.turn != b2.turn) return false

        // check if pieces are the same
        for (let i = 0; i < this.wp.length; i++) {
            if (!this.wp[i].equals(b2.wp[i])) return false
            if (!this.bp[i].equals(b2.bp[i])) return false
        }

        // same possible moves
        for (let i = 0; i < this.legalMoves.length; i++) {
            if (!this.legalMoves[i].equals(b2.legalMoves[i])) return false
        }

        return true
    }

    checkForRepetition() {
        let map = new Map()
        for (let i = 0; i < boardHistory.history.length; i++) {
            if (map.get(boardHistory.history[i].id) >= 3) return true
            else if (!map.get(boardHistory.history[i].id)) map.set(boardHistory.history[i].id, 1)
            else map.set(boardHistory.history[i].id, map.get(boardHistory.history[i].id) + 1)
        }

        return false
    }

    fiftyMoveRule() {
        return this.noCaptureCounter >= 100
    }

    checkForInsufficientMaterial() {
        // If either side as any of these pieces, then checkmate is still possible
        for (let i = 0; i < this.wp.length; i++) {
            let p = this.wp[i]
            if (p instanceof Rook || p instanceof Pawn || p instanceof Queen) return false
        }
        for (let i = 0; i < this.bp.length; i++) {
            let p = this.bp[i]
            if (p instanceof Rook || p instanceof Pawn || p instanceof Queen) return false
        }

        // Three pieces can mate
        if (this.wp.length > 2 || this.bp.length > 2) return false

        // King + Knight, King + Bishop, and Lone King can't mate
        return true
    }

    generateNotation(move, symbol, color) {

        // files and ranks are global arrays
        let notationString = ""

        // Check for short and long castle
        if (symbol == "K" && Math.abs(move.x1 - move.x2) > 1) {
            if (move.x2 - move.x1 > 0) {
                notationString = "O-O"
            } else {
                notationString = "O-O-O"
            }
            let b2 = this.generateNewBoard(move)
            b2.findLegalMoves()
            if (this.inCheck(!color) && b2.legalMoves.length == 0) notationString += "#"
            else if (this.inCheck(!color)) notationString += "+"

            return notationString
        }

        let fileAdded = false
        let rankAdded = false

        // Add symbol of attacking piece (except pawn)
        if (symbol != "P" && !move.promotionTo) notationString += symbol

        // Check for ambiguity (file, rank, or both)
        for (let i = 0; i < this.legalMoves.length; i++) {
            let lm = this.legalMoves[i]
            // Can go to same square, but we don't want to include the piece itself
            if (lm.x2 == move.x2 && lm.y2 == move.y2 && (lm.x1 != move.x1 || lm.y1 != move.y1)) {
                // Check for correct color and symbol
                if (this.pieceAt(lm.x1, lm.y1).symbol == symbol && this.pieceAt(lm.x1, lm.y1).color == color && symbol != "P") {
                    // if files are the same, use rank number, otherwise just use file letter
                    if (lm.x1 == move.x1) {
                        if (!rankAdded) notationString += ranks[move.y1]
                        rankAdded = true
                    } else {
                        if (!fileAdded) notationString += files[move.x1]
                        fileAdded = true
                    }
                }
            }
        }

        // In very special cases when there is ambiguity on the rank and the file
        if (fileAdded && rankAdded) {
            notationString = symbol + files[move.x1].toString() + ranks[move.y1].toString()
        }

        // add x for capture
        if ((this.noCaptureCounter == -1 && symbol == "P") || (this.noCaptureCounter == -1 && move.promotionTo)) {
            notationString += files[move.x1].toString() + "x"
        } else if (this.noCaptureCounter == -1) {
            notationString += "x"
        }
        console.log("CAPTURE COUNTER: ", this.noCaptureCounter)

        // add destination square
        notationString += files[move.x2].toString() + ranks[move.y2].toString()

        // Add promotion (=Q, =R, =B, =N)
        if (move.promotionTo) notationString += "=" + move.promotionTo

        //Add check or checkmate (+, #)
        let b2 = this.generateNewBoard(move)
        b2.findLegalMoves()
        if (this.inCheck(!color) && b2.legalMoves.length == 0) notationString += "#"
        else if (this.inCheck(!color)) notationString += "+"


        return notationString

    }

    nextTurn() {
        if (this.inCheck(!this.turn)) checkSound.play()
        else if (this.noCaptureCounter >= 0) movePieceSound.play()
        this.turn = !this.turn;
        this.noCaptureCounter += 1
        this.clearMoves();
        this.clearEnPassants();
        this.findLegalMoves();

        //global boardHistory
        boardHistory.addBoard(this.clone())
        console.log("The Same Board: " + boardHistory.history[boardHistory.history.length - 1].equals(boardHistory.history[0]))
        console.log("THREEFOLD REP: ", this.checkForRepetition())
        console.log("50 move rule: ", this.fiftyMoveRule())
        console.log("Insufficient material: ", this.checkForInsufficientMaterial())
        console.log("NOTATION: ", boardHistory.notation)
        // moveLog.innerHTML = boardHistory.notation

        // Checkmate and Stalemate
        if (this.legalMoves.length == 0) {
            if (this.inCheck(this.turn)) {
                this.checkmate = true
                console.log("CHECKMATE")
            } else {
                this.stalemate = "true"
                console.log("STALEMATE")
            }
        }

        // Other draws
        if (this.checkForRepetition()) this.repetition = true
        else if (this.fiftyMoveRule()) this.fifty = true
        else if (this.checkForInsufficientMaterial()) this.insufficientMaterial = true


        console.log(this.legalMoves);
        console.log("BOARD HISTORY: ", boardHistory.history)
    }

}