//--------------------------------------------------
// GameLoop
//--------------------------------------------------
class GameLoop {
    constructor(canvas_buffer) {
        this.canvas_buffer = canvas_buffer;
        this.run = false;
        this.frame_time_last = 0;
        this.frame_time_accumulator = 0;
        this.frame_time_threshold = 1000 / 120;
        this.frame_hook_before_paint = undefined;
        this.frame_hook_after_paint = undefined;
    }

    start_loop(before_paint, after_paint) {
        if (this.frame_interval === undefined) {
            this.frame_hook_before_paint = before_paint;
            this.frame_hook_after_paint = after_paint;
            this.run = true;
            this.frame_time_last = 0;
            this.frame_time_accum = 0;
            // request the next frame
            this.frame_interval = window.requestAnimationFrame((frame_time) => this.frame(frame_time))
        }
    }

    stop_loop() {
        if (this.frame_interval !== undefined) {
            this.run = false;
        }
    }

    frame(frame_time) {
        
        const frame_time_delta = frame_time - this.frame_time_last;
        this.frame_time_last = frame_time;
        this.frame_time_accumulator += frame_time_delta;

        if (this.frame_time_accumulator >= this.frame_time_threshold) {

            // reset the frame time accumulator
            this.frame_time_accumulator %= this.frame_time_accumulator;

            // clear the frame
            // this.canvas_buffer.fill_with_test_pattern()
            this.canvas_buffer.fill()

            // check for hook
            if (this.frame_hook_before_paint !== undefined) {
                this.frame_hook_before_paint();
            }

            // check for hook
            if (this.frame_hook_after_paint !== undefined) {
                this.frame_hook_after_paint();
            }
        }

        // copy offscreen surface to onscreen surface
        this.canvas_buffer.blit();

        // check the run state
        if (this.run) {
            // request the next frame
            this.frame_interval = window.requestAnimationFrame((frame_time) => this.frame(frame_time))
        }
    }
}

export default GameLoop;
