class Piece{
    constructor(x, y, color){
        this.x = x;
        this.y = y;
        this.px = x * squareSize;
        this.py = y * squareSize;
        this.color = color;
        this.hasMoved = false;
        this.symbol = "NONE";
        this.img = undefined;
        this.moving = false;
    }

    clone(){

    }

    equals(p2){
        if (this.x == p2.x && this.y == p2.y && this.color == p2.color){
            return true
        }
    }  

    inBounds(x, y){
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }

    friendlyFire(b, x, y){
        if(!b.isPieceAt(x, y)) return false;
        else if(b.pieceAt(x, y).color == this.color) return true;
        return false;
    }

    obstructedVertically(b, x, y){
        if(!this.inBounds(x, y)) return false;

        // Increasing Y coordinate
        if(this.y < y){
            for(let i = this.y + 1; i < y; i++){
                if(b.isPieceAt(x, i)) return true;
            }
        }
        // Decreasing Y coordinate
        else if(this.y > y){
            for(let i = this.y - 1; i > y; i--){
                if(b.isPieceAt(x, i)) return true;
            }
        }
        return false;
    }

    obstructedHorizontally(b, x, y){
        if(!this.inBounds(x, y)) return false;

        // Increasing X coordinate
        if(this.x < x){
            for(let i = this.x + 1; i < x; i++){
                if(b.isPieceAt(i, y)) return true;
            }
        }
        // Decreasing X coordinate
        else if(this.x > x){
            for(let i = this.x - 1; i > x; i--){
                if(b.isPieceAt(i, y)) return true;
            }
        }
        return false;
    }

    obstructedDiagonally(b, x, y, dir){
        if(!this.inBounds(x, y)) return false;

        let pathLength = Math.abs(x - this.x) - 1;
        let xd = this.x;
        let yd = this.y;
        for(let i = 0; i < pathLength; i++){
            xd += dir[0];
            yd += dir[1]; 
            if(b.isPieceAt(xd, yd)){
                return true;
            }
        }
        return false;
    }

    addPieceMoves(b){
        for(let i = 0; i < gridSize; i++){
            for(let j = 0; j < gridSize; j++){
                if(this.x == i && this.y == j) continue;
                else if(this.canMoveTo(b, i, j)){
                    let move = new Move(this.x, this.y, i, j);
                    let promotingMove = false;
                    let m2, m3, m4;
                    //Pawn promotion
                    if(this instanceof Pawn && (j == 0 || j == 7)){
                        move.promotionTo = "Q";
                        m2 = new Move(move.x1, move.y1, move.x2, move.y2);
                        m2.promotionTo = "R";
                        m3 = new Move(move.x1, move.y1, move.x2, move.y2);
                        m3.promotionTo = "B";
                        m4 = new Move(move.x1, move.y1, move.x2, move.y2);
                        m4.promotionTo = "N";
                        promotingMove = true;
                    }
                    if(b.kingIsSafe(move)){
                        b.legalMoves.push(move);
                        if(promotingMove){
                            b.legalMoves.push(m2, m3, m4);
                            promotingMove = false;
                        }
                    }
                }
                //Castling moves
                if(this instanceof King){
                    let move = new Move(this.x, this.y, i, j);
                    //White
                    if(this.color){
                        //Short Castle
                        if(b.shortCastleAble(this.color) && i == 6 && j == 7){ 
                            b.legalMoves.push(move);
                        }
                        //Long Castle
                        if(b.longCastleAble(this.color) && i == 2 && j == 7){
                            b.legalMoves.push(move);
                        }
                    }
                    //Black
                    else{
                        //Short Castle
                        if(b.shortCastleAble(this.color) && i == 6 && j == 0){ 
                            b.legalMoves.push(move);
                        }
                        //Long Castle
                        if(b.longCastleAble(this.color) && i == 2 && j == 0){
                            b.legalMoves.push(move);
                        }
                    }
                }
            }
        }
    }

    getPossibleMoves(b){
        let possibleMoves = []; 
        for(let i = 0; i < gridSize; i++){
            for(let j = 0; j < gridSize; j++){
                if(this.x == i && this.y == j) continue;
                else if(this.canMoveTo(b, i, j)){
                    let move = new Move(this.x, this.y, i, j);
                    let promotingMove = false;
                    let m2, m3, m4;
                    //Pawn promotion
                    if(this instanceof Pawn && (j == 0 || j == 7)){
                        move.promotionTo = "Q";
                        m2 = new Move(move.x1, move.y1, move.x2, move.y2);
                        m2.promotionTo = "R";
                        m3 = new Move(move.x1, move.y1, move.x2, move.y2);
                        m3.promotionTo = "B";
                        m4 = new Move(move.x1, move.y1, move.x2, move.y2);
                        m4.promotionTo = "N";
                        promotingMove = true;
                    }
                    if(b.kingIsSafe(move)){
                        possibleMoves.push(move);
                        if(promotingMove){
                            possibleMoves.push(m2, m3, m4);
                            promotingMove = false;
                        }
                    }
                }
                //Castling moves
                if(this instanceof King){
                    let move = new Move(this.x, this.y, i, j);
                    //White
                    if(this.color){
                        //Short Castle
                        if(b.shortCastleAble(this.color) && i == 6 && j == 7){ 
                            possibleMoves.push(move);
                        }
                        //Long Castle
                        if(b.longCastleAble(this.color) && i == 2 && j == 7){
                            possibleMoves.push(move);
                        }
                    }
                    //Black
                    else{
                        //Short Castle
                        if(b.shortCastleAble(this.color) && i == 6 && j == 0){ 
                            possibleMoves.push(move);
                        }
                        //Long Castle
                        if(b.longCastleAble(this.color) && i == 2 && j == 0){
                            possibleMoves.push(move);
                        }
                    }
                }
            }
        }
        return possibleMoves;
    }

    canMoveTo(b, x, y){
        if(this.inBounds(x, y) && !this.friendlyFire(b, x, y)){ 
            return true
        }
        return false;
    }

    moveTo(b, x, y){
        if(b.isPieceAt(x, y)) {
            b.capture(x, y);
        }
        //Move rook in castling
        if(this instanceof King && Math.abs(x - this.x) == 2){
            b.castleRook(x, y);
        }
        //If pawn has just moved twice
        if(this instanceof Pawn && Math.abs(y - this.y) == 2){
            this.justMovedTwoSpaces = true;
        }
        //En passent Capture
        if(this instanceof Pawn && x != this.x && !b.isPieceAt(x, y)){
            b.enPassantCapture(this.color, x, y);
        }
        //Pawn promotion
        if(this instanceof Pawn && (y == 0 || y == 7)){
            if(this.color) b.promotion.promotingState = 1;
            else b.promotion.promotingState = 2;
            b.promotion.x = x;
            b.promotion.y = y;
            if(this.color){
                b.promotion.pawnIndex = b.wp.indexOf(this);
            }
            else{
                b.promotion.pawnIndex = b.bp.indexOf(this);
            }
            b.createPromotions();
        }
        this.x = x;
        this.y = y;
        this.hasMoved = true;
    }

    movePx(){
        this.px = this.x * squareSize;
        this.py = this.y * squareSize;
    }

    resetPx(){
        this.px = this.x * squareSize + squareSize/2;
        this.py = this.y * squareSize + squareSize/2;
    }

    show(){
        /*
        ctx.font = "30px arial";
        if(this.color){
            ctx.strokeStyle = "red";
        }
        else ctx.strokeStyle = "black";
        ctx.strokeText(this.symbol, this.px, this.py);
        */
       ctx.drawImage(this.img, this.px, this.py, imgSize, imgSize);
        
    }

}

class King extends Piece{
    constructor(x, y, color){
        super(x, y, color);
        this.symbol = "K";
        if(this.color) this.img = wKing;
        else this.img = bKing;
        this.img.width = imgSize;
        this.img.height = imgSize;
    }

    clone(){
        let clonedPiece = new King(this.x, this.y, this.color);
        clonedPiece.hasMoved = this.hasMoved;
        return clonedPiece;
    }

    canMoveTo(b, x, y){
        if(Math.abs(x - this.x) <= 1 && Math.abs(y - this.y) <= 1){
            return super.canMoveTo(b, x, y);
        }
        return false;
    }
}

class Queen extends Piece{
    constructor(x, y, color){
        super(x, y, color);
        this.symbol = "Q";
        if(this.color) this.img = wQueen;
        else this.img = bQueen;
        this.img.width = imgSize;
        this.img.height = imgSize;
    }

    clone(){
        let clonedPiece = new Queen(this.x, this.y, this.color);
        clonedPiece.hasMoved = this.hasMoved;
        return clonedPiece;
    }

    canMoveTo(b, x, y){
        //Vertical
        if(this.x == x && this.y != y && !this.obstructedVertically(b, x, y)){
            return super.canMoveTo(b, x, y);
        }
        //Horizontal
        if(this.y == y && this.x != x && !this.obstructedHorizontally(b, x, y)){
            return super.canMoveTo(b, x, y);
        }
        //Diagonal 
        let dirX, dirY;
        if(x - this.x > 0) dirX = 1;
        else dirX = -1;
        if(y - this.y > 0) dirY = 1;
        else dirY = -1;
        let dir = [dirX, dirY];
        if(Math.abs(x - this.x) == Math.abs(y - this.y) && !this.obstructedDiagonally(b, x, y, dir)){
            return super.canMoveTo(b, x, y);
        }
        return false;
    }
}

class Rook extends Piece{
    constructor(x, y, color){
        super(x, y, color);
        this.symbol = "R";
        if(this.color) this.img = wRook;
        else this.img = bRook;
        this.img.width = imgSize;
        this.img.height = imgSize;
    }

    clone(){
        let clonedPiece = new Rook(this.x, this.y, this.color);
        clonedPiece.hasMoved = this.hasMoved;
        return clonedPiece;
    }

    canMoveTo(b, x, y){
        //Vertical
        if(this.x == x && this.y != y && !this.obstructedVertically(b, x, y)){
            return super.canMoveTo(b, x, y);
        }
        //Horizontal
        if(this.y == y && this.x != x && !this.obstructedHorizontally(b, x, y)){
            return super.canMoveTo(b, x, y);
        }
        return false;
    }
}

class Knight extends Piece{
    constructor(x, y, color){
        super(x, y, color);
        this.symbol = "N";
        if(this.color) this.img = wKnight;
        else this.img = bKnight;
        this.img.width = imgSize;
        this.img.height = imgSize;
    }

    clone(){
        let clonedPiece = new Knight(this.x, this.y, this.color);
        clonedPiece.hasMoved = this.hasMoved;
        return clonedPiece;
    }

    canMoveTo(b, x, y){
        //More horizontal
        if(Math.abs(x - this.x) == 2 && Math.abs(y - this.y) == 1){
            return super.canMoveTo(b, x, y);
        }
        //More vertical
        else if(Math.abs(x - this.x) == 1 && Math.abs(y - this.y) == 2){
            return super.canMoveTo(b, x, y);
        }
        return false;
    }
}

class Bishop extends Piece{
    constructor(x, y, color){
        super(x, y, color);
        this.symbol = "B";
        if(this.color) this.img = wBishop;
        else this.img = bBishop;
        this.img.width = imgSize;
        this.img.height = imgSize;
    }

    clone(){
        let clonedPiece = new Bishop(this.x, this.y, this.color);
        clonedPiece.hasMoved = this.hasMoved;
        return clonedPiece;
    }

    canMoveTo(b, x, y){
        //Diagonal 
        let dirX, dirY;
        if(x - this.x > 0) dirX = 1;
        else dirX = -1;
        if(y - this.y > 0) dirY = 1;
        else dirY = -1;
        let dir = [dirX, dirY];
        if(Math.abs(x - this.x) == Math.abs(y - this.y) && !this.obstructedDiagonally(b, x, y, dir)){
            return super.canMoveTo(b, x, y);
        }
        return false;
    }
}

class Pawn extends Piece{
    constructor(x, y, color){
        super(x, y, color);
        this.symbol = "P";
        if(this.color) this.img = wPawn;
        else this.img = bPawn;
        this.img.width = imgSize;
        this.img.height = imgSize;
        this.justMovedTwoSpaces = false;
    }

    clone(){
        let clonedPiece = new Pawn(this.x, this.y, this.color);
        clonedPiece.hasMoved = this.hasMoved;
        return clonedPiece;
    }

    canMoveTo(b, x, y){
        if(this.obstructedVertically(b, x, y)) return false;
        //Pawns can't attack head on
        if(b.isPieceAt(x, y) && this.x == x) return false;

        //White pawns
        if(b.turn){
            if(y - this.y == -2 && x == this.x){
                if(!this.hasMoved){
                    return super.canMoveTo(b, x, y);
                }
            }
            else if(y - this.y == -1 && x == this.x){
                return super.canMoveTo(b, x, y);
            }
            else if(y - this.y == -1 && Math.abs(x - this.x) == 1 && b.isPieceAt(x, y)){
                return super.canMoveTo(b, x, y);
            }
            //En passant
            else if(y - this.y == -1 && Math.abs(x - this.x) == 1 && b.isPieceAt(x, y + 1)){
                if(b.pieceAt(x, y + 1) instanceof Pawn && !b.pieceAt(x, y + 1).color){
                    if(b.pieceAt(x, y + 1).justMovedTwoSpaces) return super.canMoveTo(b, x, y);
                } 
            }
        }
        //Black pawns
        else if(!b.turn){
            if(y - this.y == 2 && x == this.x){
                if(!this.hasMoved){
                    return super.canMoveTo(b, x, y);
                }
            }
            else if(y - this.y == 1 && x == this.x){
                return super.canMoveTo(b, x, y);
            }
            else if(y - this.y == 1 && Math.abs(x - this.x) == 1 && b.isPieceAt(x, y)){
                return super.canMoveTo(b, x, y);
            }
            //En passant
            else if(y - this.y == 1 && Math.abs(x - this.x) == 1 && b.isPieceAt(x, y - 1)){
                if(b.pieceAt(x, y - 1) instanceof Pawn && b.pieceAt(x, y - 1).color){
                    if(b.pieceAt(x, y - 1).justMovedTwoSpaces) return super.canMoveTo(b, x, y);
                } 
            }
        }
        return false;
    }
}