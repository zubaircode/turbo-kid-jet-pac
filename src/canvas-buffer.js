//--------------------------------------------------
// CanvasBuffer
//--------------------------------------------------
class CanvasBuffer {
    constructor(width, height, playfield_id) {

        width = Math.max(16, width);
        width = Math.min(1920, width);
        height = Math.max(16, height);
        height = Math.min(1080, height);

        this.playfield_id = playfield_id;

        this.canvas_id = `canvas-${Date.now()}`;
        this.canvas = document.createElement("canvas");
        this.canvas.id = this.canvas_id;
        this.canvas.width = width;
        this.canvas.height = height;
        this.context = this.canvas.getContext("2d", {});
        this.pixels = this.context.getImageData(0, 0, width, height);
    }

    paint_pixel(x, y, color) {
        // precondition checks
        if (!Number.isInteger(x) || !Number.isInteger(y)) {
            // error
            throw new Error(`non integer co-ordinates supplied to paint_pixel x:${x} y:${y}`)
        }
  
        let target_x = x;
        let target_y = y;
      
        if (0 <= target_x && target_x < this.canvas.width && 0 <= target_y && target_y < this.canvas.height) {
            const index = (this.canvas.width * target_y * 4) + (target_x * 4);
            if (color.a) {
                this.pixels.data[index + 0] = color.r;
                this.pixels.data[index + 1] = color.g;
                this.pixels.data[index + 2] = color.b;
                this.pixels.data[index + 3] = color.a;
            }
        }
    }

    fill(color = { r: 0, g: 0, b: 0, a: 255 }) {
        for(let y = 0; y < this.canvas.height; y++) {
            for(let x = 0; x < this.canvas.width; x++) {
                this.paint_pixel(x, y, color);
            }
        }
    }

    fill_with_test_pattern() {
        for(let y = 0; y < this.canvas.height; y++) {
            for(let x = 0; x < this.canvas.width; x++) {
                const color = {
                    r: Math.floor(Math.random() * 256),
                    g: Math.floor(Math.random() * 256),
                    b: Math.floor(Math.random() * 256),
                    a: 255,
                }
                this.paint_pixel(x, y, color);
            }
        }
    }
    
    blit() {

        // write the pixels to the offscreen canvas using the offscreen context
        this.context.putImageData(this.pixels, 0, 0)
                
        // get the playfield node from the DOM
        const playfield = document.querySelector(`#${this.playfield_id}`);
        playfield.height = window.innerHeight;
        playfield.width = window.innerWidth;
    
        // get the playfield context
        const playfield_context = playfield.getContext("2d");
        playfield_context.imageSmoothingEnabled = false;
    
        // calculate aspect ratios
        const playfield_aspect = playfield.width / playfield.height;
        const buffer_aspect = this.canvas.width / this.canvas.height;
    
        if (playfield_aspect < buffer_aspect) {
    
            const target_width = playfield.width;
            const target_height = playfield.width / (buffer_aspect)
            const target_x = 0;
            const target_y = (playfield.height - target_height) / 2;
    
            // draw the offscreen canvas into the playfield
            playfield_context.drawImage(this.canvas, target_x, target_y, target_width, target_height)
            // save the playfield metrics for further operations
            this.playfield_metrics = { target_x, target_y, target_width, target_height }
        } else {
    
            const target_width = playfield.height * buffer_aspect;
            const target_height = playfield.height
            const target_x = (playfield.width - target_width) / 2;
            const target_y = 0;
    
            // draw the offscreen canvas into the playfield
            playfield_context.drawImage(this.canvas, target_x, target_y, target_width, target_height)
            // save the playfield metrics for further operations
            this.playfield_metrics = { target_x, target_y, target_width, target_height }
        }
    }

    convert_playfield_to_canvas(px, py) {

        // precondition checks
        if (!this.playfield_metrics) {
            // fail
            return undefined
        }

        // apply origin
        const offset_x = px - this.playfield_metrics.target_x
        const offset_y = py - this.playfield_metrics.target_y

        // apply pixel size ratio
        const scaled_x = offset_x * (this.canvas.width / this.playfield_metrics.target_width)
        const scaled_y = offset_y * (this.canvas.height / this.playfield_metrics.target_height)

        // round to nearest pixel
        const rounded_x = Math.floor(scaled_x)
        const rounded_y = Math.floor(scaled_y)

        // success
        return { cx : rounded_x, cy : rounded_y }
    }
}

export default CanvasBuffer;