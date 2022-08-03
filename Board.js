class Board{
    constructor(){
        //White and black pieces
        this.wp = [];
        this.bp = [];
        this.promotions = [];
        this.legalMoves = [];
        this.turn = true;
        this.initializePieces();
        this.promotion = {
            promotingState: false,
            x: -1,
            y: -1,  
            pawnIndex: -1,
        }
    }

    initializePieces(){
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


        for(let i = 0; i < 8; i++){
            //White and black pawns
            this.wp.push(new Pawn(i, 6, true));
            this.bp.push(new Pawn(i, 1, false));
        }
    }

    show(){
        for(let i = 0; i < this.wp.length; i++){
            this.wp[i].show();
        }
        for(let i = 0; i < this.bp.length; i++){
            this.bp[i].show();
        }
    }
    isPieceAt(x, y){
        for(let i = 0; i < this.wp.length; i++){
            if(this.wp[i].x == x && this.wp[i].y == y){
                return true;
            }
        }
        for(let i = 0; i < this.bp.length; i++){
            if(this.bp[i].x == x && this.bp[i].y == y){
                return true;
            }
        }
        return false;
    }

    pieceAt(x, y){
        for(let i = 0; i < this.wp.length; i++){
            if(this.wp[i].x == x && this.wp[i].y == y){
                return this.wp[i];
            }
        }
        for(let i = 0; i < this.bp.length; i++){
            if(this.bp[i].x == x && this.bp[i].y == y){
                return this.bp[i];
            }
        }
    }

    getKingPos(){
        //If white's turn, find black king
        if(this.turn){
            for(let i = 0; i < this.bp.length; i++){
                if(this.bp[i] instanceof King){
                    return [this.bp[i].x, this.bp[i].y]
                }
            }
        }
        //vice versa
        else{
            for(let i = 0; i < this.wp.length; i++){
                if(this.wp[i] instanceof King){
                    return [this.wp[i].x, this.wp[i].y]
                }
            }
        }
    }


    findLegalMoves(){
        if(this.turn){
            for(let i = 0; i < this.wp.length; i++){
                this.wp[i].addPieceMoves(this);
            }
        }
        else{
            for(let i = 0; i < this.bp.length; i++){
                this.bp[i].addPieceMoves(this);
            }
        }
    }

    shortCastleAble(color){
        let validKing, validRook = false;
        if(color){
            for(let i = 0; i < this.wp.length; i++){
                if(this.wp[i] instanceof King && this.wp[i].x == 4 && this.wp[i].y == 7){
                    if(!this.wp[i].hasMoved) validKing = true;
                }
                if(this.wp[i] instanceof Rook && this.wp[i].x == 7 && this.wp[i].y == 7){
                    if(!this.wp[i].hasMoved) validRook = true;
                }
            }
            for(let i = 0; i < this.bp.length; i++){
                if(this.bp[i].canMoveTo(this, 5, 7) || this.isPieceAt(5, 7)) return false;
                if(this.bp[i].canMoveTo(this, 6, 7) || this.isPieceAt(6, 7)) return false;
            }
        }
        else{
            for(let i = 0; i < this.bp.length; i++){
                if(this.bp[i] instanceof King && this.bp[i].x == 4 && this.bp[i].y == 0){
                    if(!this.bp[i].hasMoved) validKing = true;
                }
                if(this.bp[i] instanceof Rook && this.bp[i].x == 7 && this.bp[i].y == 0){
                    if(!this.bp[i].hasMoved) validRook = true;
                }
            }
            for(let i = 0; i < this.wp.length; i++){
                if(this.wp[i].canMoveTo(this, 5, 0) || this.isPieceAt(5, 0)) return false;
                if(this.wp[i].canMoveTo(this, 6, 0) || this.isPieceAt(6, 0)) return false;
            }
        }
        return validKing && validRook;
    }

    longCastleAble(color){
        let validKing, validRook = false;
        if(color){
            for(let i = 0; i < this.wp.length; i++){
                if(this.wp[i] instanceof King && this.wp[i].x == 4 && this.wp[i].y == 7){
                    if(!this.wp[i].hasMoved) validKing = true;
                }
                if(this.wp[i] instanceof Rook && this.wp[i].x == 0 && this.wp[i].y == 7){
                    if(!this.wp[i].hasMoved) validRook = true;
                }
            }
            for(let i = 0; i < this.bp.length; i++){
                if(this.bp[i].canMoveTo(this, 3, 7) || this.isPieceAt(3, 7)) return false;
                if(this.bp[i].canMoveTo(this, 2, 7) || this.isPieceAt(2, 7)) return false;
                if(this.bp[i].canMoveTo(this, 1, 7) || this.isPieceAt(1, 7)) return false;
            }
        }
        else{
            for(let i = 0; i < this.bp.length; i++){
                if(this.bp[i] instanceof King && this.bp[i].x == 4 && this.bp[i].y == 0){
                    if(!this.bp[i].hasMoved) validKing = true;
                }
                if(this.bp[i] instanceof Rook && this.bp[i].x == 0 && this.bp[i].y == 0){
                    if(!this.bp[i].hasMoved) validRook = true;
                }
            }
            for(let i = 0; i < this.wp.length; i++){
                if(this.wp[i].canMoveTo(this, 3, 0) || this.isPieceAt(3, 0)) return false;
                if(this.wp[i].canMoveTo(this, 2, 0) || this.isPieceAt(2, 0)) return false;
                if(this.wp[i].canMoveTo(this, 1, 0) || this.isPieceAt(1, 0)) return false;
            }
        }
        return validKing && validRook;
    }
    
    castleRook(x, y){
        //White 
        if(y == 7){
            //Short
            if(x == 6){
                for(let i = 0; i < this.wp.length; i++){
                    if(this.wp[i] instanceof Rook && this.wp[i].x == 7){
                        this.wp[i].moveTo(this, x-1, y);
                        this.wp[i].movePx();
                    }
                }
            }
            //Long
            else{
                for(let i = 0; i < this.wp.length; i++){
                    if(this.wp[i] instanceof Rook && this.wp[i].x == 0){
                        this.wp[i].moveTo(this, x+1, y);
                        this.wp[i].movePx();
                    }
                }
            }
        }
        //Black
        else{
            //Short
            if(x == 6){
                for(let i = 0; i < this.bp.length; i++){
                    if(this.bp[i] instanceof Rook && this.bp[i].x == 7){
                        this.bp[i].moveTo(this, x-1, y);
                        this.bp[i].movePx();
                    }
                }
            }
            //Long
            else{
                for(let i = 0; i < this.bp.length; i++){
                    if(this.bp[i] instanceof Rook && this.bp[i].x == 0){
                        this.bp[i].moveTo(this, x+1, y);
                        this.bp[i].movePx();
                    }
                }
            }
        }
    }

    enPassantCapture(color, x, y){
        //White Capturing Black Piece
        if(color){
            this.capture(x, y + 1);
        }
        //Black Capturing White Piece
        else{
            this.capture(x, y - 1);
        }
    }

    //Creates a hypothetical board based on a move
    generateNewBoard(move){
        let newBoard = new Board();
        newBoard.clearPieces();
        for(let i = 0; i < this.wp.length; i++){
            newBoard.wp.push(this.wp[i].clone());
        }
        for(let i = 0; i < this.bp.length; i++){
            newBoard.bp.push(this.bp[i].clone());
        }
        newBoard.turn = !this.turn;

        
        if(this.turn){
            for(let i = 0; i < newBoard.wp.length; i++){
                if(newBoard.wp[i].x == move.x1 &&
                    newBoard.wp[i].y == move.y1){
                    newBoard.wp[i].moveTo(newBoard, move.x2, move.y2);
                    break;
                }
            }
        }
        else{
            for(let i = 0; i < newBoard.bp.length; i++){
                if(newBoard.bp[i].x == move.x1 &&
                    newBoard.bp[i].y == move.y1){
                    newBoard.bp[i].moveTo(newBoard, move.x2, move.y2)
                    break;
                }
            }
        }
        return newBoard;  
    }

    kingIsSafe(move){
        let tempBoard = this.generateNewBoard(move);
        let kx = tempBoard.getKingPos()[0];
        let ky = tempBoard.getKingPos()[1];
        
        if(tempBoard.turn){
            for(let i = 0; i < tempBoard.wp.length; i++){
                if(tempBoard.wp[i].canMoveTo(tempBoard, kx, ky)){
                    return false;                
                }
            }
        }
        else{
            for(let i = 0; i < tempBoard.bp.length; i++){
                if(tempBoard.bp[i].canMoveTo(tempBoard, kx, ky)){
                    return false;
                }
            }
        }
        return true;
    }

    capture(x, y){
        for(let i = 0; i < this.wp.length; i++){
            if(this.wp[i].x == x && this.wp[i].y == y){
                this.wp.splice(i, 1);
                return;
            }
        }
        for(let i = 0; i < this.bp.length; i++){
            if(this.bp[i].x == x && this.bp[i].y == y){
                this.bp.splice(i, 1);
                return;
            }
        }
    }

    hasMove(move){
        for(let i = 0; i < this.legalMoves.length; i++){
            if(this.legalMoves[i].x1 == move.x1 && this.legalMoves[i].y1 == move.y1 &&
                this.legalMoves[i].x2 == move.x2 && this.legalMoves[i].y2 == move.y2){
                return true;
            }
        }
        return false;
    }

    clearEnPassants(){
        //Assuming turn is switched then this method is called
        if(this.turn){
            for(let i = 0; i < this.wp.length; i++){
                if(this.wp[i] instanceof Pawn) this.wp[i].justMovedTwoSpaces = false;
            }
        }
        else{
            for(let i = 0; i < this.bp.length; i++){
                if(this.bp[i] instanceof Pawn) this.bp[i].justMovedTwoSpaces = false;
            }
        }
    }

    createPromotions(){
        let n, b, r, q, color;
        if(this.promotion.promotingState == 1) color = true;
        else if(this.promotion.promotingState == 2) color = false;
        n = new Knight(2, 3.5, color);
        b = new Bishop(3, 3.5, color);
        r = new Rook(4, 3.5, color);
        q = new Queen(5, 3.5, color);
        
        this.promotions.push(n, b, r, q);
    }

    showPromotions(){
        for(let i = 0; i < this.promotions.length; i++){
            this.promotions[i].show();
        }
    }

    promotionPieceAt(px, py){
        if(py > canvas.height/2 + imgSize/2 || py < canvas.height/2 - imgSize/2){
            return undefined;
        }
        let x = Math.floor(px/squareSize);
        if(x < 2 || x > 5) return undefined;
        else return this.promotions[x - 2];
    } 

    clearPromotions(){
        this.promotions = [];
        this.promotion.promotingState = 0;
        this.promotion.x = -1;
        this.promotion.y = -1;
    }

    clearMoves(){
        this.legalMoves = [];
    }

    clearPieces(){
        this.wp = [];
        this.bp = [];
    }
    
    nextTurn(){
        this.turn = !this.turn;
        this.clearMoves();
        this.clearEnPassants();
        this.findLegalMoves();
        console.log(this.legalMoves);
    }
       
}