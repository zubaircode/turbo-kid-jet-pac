//--------------------------------------------------
// SpritePainter
//--------------------------------------------------
class SpritePainter {
    constructor() {
    }

    static paint(canvas_buffer, sprite, x, y) {
        // precondition checks
        if (!Number.isInteger(x)) {
            throw Error(`SpritePainter.paint -> invalid x:${x}`)
        }

        // precondition checks
        if (!Number.isInteger(y)) {
            throw Error(`SpritePainter.paint -> invalid y:${y}`)
        }

        for(let row = 0 ; row < 8; row++) {
            for(let column = 0; column < 8; column++) {
                canvas_buffer.paint_pixel(x + column, y + row, sprite.to_color(row, column));
            }
        }
    }
}

export default SpritePainter;
