import "./main.css";
import GameLoop from "./game-loop"
import CanvasBuffer from "./canvas-buffer"
import Playfield from "./playfield"

// create the canvas
const game_canvas = new CanvasBuffer(256, 144, "playfield")

// create the playfield
const game_playfield = new Playfield(game_canvas)

// set the level
let game_level = 0

// setup control input
let cheat = []
const cheat_phrase = "naughtynaughty"

window.addEventListener("keyup", (e) => {
    if (cheat.length === cheat_phrase.length) {
        cheat.shift()
    }
    cheat.push(e.key)
    const cheat_text = cheat.join('')
    if (0 <= cheat_text.indexOf(cheat_phrase)) {
        cheat = []
        game_playfield.set_complete()
    }
})

// setup control input
window.addEventListener("click", (e) => {
    game_playfield.set_target(e.clientX, e.clientY)
})

// setup control input
window.addEventListener("touchstart", (e) => {
    game_playfield.set_target(e.layerX, e.layerY)
})

// setup control input
window.addEventListener("touchmove", (e) => {
    game_playfield.set_target(e.layerX, e.layerY)
})

// setup control input
window.addEventListener("touchend", (e) => {
    game_playfield.set_target(e.layerX, e.layerY)
})

// the game runner
function game_runner() {

    // animate
    game_playfield.animate()

    // render
    game_playfield.paint()
}

// create the game loop
const game_loop = new GameLoop(game_canvas);

// start the game loop
game_loop.start_loop(() => game_runner(), undefined)

