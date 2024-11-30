
import SpritePainter from "./sprite-painter"
import Sprite from "./sprite"

//--------------------------------------------------
// Playfield
//--------------------------------------------------
class Playfield {
    constructor(canvas_buffer) {

        // precondition check
        if (canvas_buffer.canvas.width !== 256) {
            // error
            throw Error(`Playfield.constructor -> invalid canvas_buffer.canvas.width:${canvas_buffer.canvas.width}`)
        }

        // precondition check
        if (canvas_buffer.canvas.height !== 144) {
            // error
            throw Error(`Playfield.constructor -> canvas_buffer.canvas.height:${canvas_buffer.canvas.height}`)
        }

        this.m_canvas_buffer = canvas_buffer

        this.m_player_x_min = (0)
        this.m_player_x_max = (this.m_canvas_buffer.canvas.width - 8)
        this.m_player_x = (this.m_player_x_min + this.m_player_x_max) / 2
        this.m_player_x_velocity = 0

        this.m_player_y_min = (0)
        this.m_player_y_max = (this.m_canvas_buffer.canvas.height - 8)
        this.m_player_y = this.m_player_y_max
        this.m_player_y_velocity = 0

        this.m_player_x_target = undefined
        this.m_player_y_target = undefined

        this.m_player_sprite_x_neg = new Sprite([66, 126, 87, 127, 127, 126, 66, 198])
        this.m_player_sprite_x_pos = new Sprite([66, 126, 234, 254, 254, 126, 66, 99])

        this.m_stars_complete = false
        this.m_stars_finished = false

        this.m_star_progress_sprites_time = 480
        this.m_star_progress_sprites = []
        this.m_star_progress_sprites.push(new Sprite([124, 254, 255, 255, 255, 126, 126, 60]))        
        this.m_star_progress_sprites.push(new Sprite([60, 124, 127, 255, 254, 126, 62, 56]))        
        this.m_star_progress_sprites.push(new Sprite([0, 28, 60, 62, 126, 60, 24, 0]))        
        this.m_star_progress_sprites.push(new Sprite([0, 0, 28, 60, 60, 24, 0, 0]))        
        this.m_star_progress_sprites.push(new Sprite([0, 0, 0, 16, 24, 0, 0, 0]))        

        this.m_star_complete_sprites_time = 60
        this.m_star_complete_sprites = []
        this.m_star_complete_sprites.push(new Sprite([0, 0, 0, 16, 24, 0, 0, 0]))        
        this.m_star_complete_sprites.push(new Sprite([0, 0, 28, 60, 60, 24, 0, 0]))        
        this.m_star_complete_sprites.push(new Sprite([0, 28, 60, 62, 126, 60, 24, 0]))        
        this.m_star_complete_sprites.push(new Sprite([60, 124, 127, 255, 254, 126, 62, 56]))        
        this.m_star_complete_sprites.push(new Sprite([124, 254, 255, 255, 255, 126, 126, 60]))        

        this.m_star_map = []
        this.m_star_map.push("--------------------------------")
        this.m_star_map.push("-------###--####-------###------")
        this.m_star_map.push("--###-#----#---#--###-#---#-----")
        this.m_star_map.push("-#----#-##----#--#----#-##------")
        this.m_star_map.push("-#-##-##-----#---#-##-##--------")
        this.m_star_map.push("-##---#-----#--#-##---#-#-------")
        this.m_star_map.push("-#----#-##-####--#----#--#------")
        this.m_star_map.push("-#-##-##---------#-##-#--#------")
        this.m_star_map.push("-##--------------##-------------")
        this.m_star_map.push("--------------------------###---")
        this.m_star_map.push("----##--------------##---#------")
        this.m_star_map.push("---#--#--------###--#-#--#-##---")
        this.m_star_map.push("--#------###--#---#-#--#-##-----")
        this.m_star_map.push("--#-###-#---#-#---#-#--#-#------")
        this.m_star_map.push("--#---#-#---#-#---#-#--#-#-##---")
        this.m_star_map.push("--##-##-#---#--###--#-#--##-----")
        this.m_star_map.push("---###---###--------##----------")
        this.m_star_map.push("--------------------------------")

        this.m_stars = []
        for(let y = 0; y < this.m_star_map.length; y++) {
            const row = this.m_star_map[y]
            for(let x = 0; x < row.length; x++) {
                if (row[x] !=="-") {
                    this.m_stars.push({ x:(x * 8), y:(y * 8), t: -1 })
                }
            }
        }
    
        this.m_bob_sprites_time = 4
        this.m_bob_sprites = []
        this.m_bob_sprites.push(new Sprite([0, 0, 0, 0, 0, 255, 219, 255]))        
        this.m_bob_sprites.push(new Sprite([0, 0, 0, 0, 126, 90, 255, 255]))        
        this.m_bob_sprites.push(new Sprite([0, 0, 0, 126, 90, 126, 126, 255]))        
        this.m_bob_sprites.push(new Sprite([0, 0, 126, 90, 126, 126, 126, 36]))        
        this.m_bob_sprites.push(new Sprite([0, 126, 90, 126, 126, 126, 36, 0]))        
        this.m_bob_sprites.push(new Sprite([126, 90, 126, 126, 126, 36, 0, 0]))        
        this.m_bob_sprites.push(new Sprite([0, 126, 90, 126, 126, 126, 36, 0]))        
        this.m_bob_sprites.push(new Sprite([0, 0, 126, 90, 126, 126, 126, 36]))        
        this.m_bob_sprites.push(new Sprite([0, 0, 0, 126, 90, 126, 126, 255]))        
        this.m_bob_sprites.push(new Sprite([0, 0, 0, 0, 126, 90, 255, 255]))        
        this.m_bob = { x: (31 * 8), y: (17 * 8), t: 0 }
    }
    
    convert_from_cx_to_sx(cx, cy) {
        const sprite_location = {
            sx : Math.max(0, Math.min(cx, this.m_canvas_width - 8)), 
            sy : Math.max(0, Math.min(cy, this.m_canvas_height - 8)),
        }
        return sprite_location
    }    

    set_target(px, py) {
        // calculate the canvas ordinates
        const canvas_location = this.m_canvas_buffer.convert_playfield_to_canvas(px, py)
        if (!canvas_location) {
            // fail
            return
        }
        // set the target
        this.m_player_x_target = canvas_location.cx + 0.5
        this.m_player_y_target = canvas_location.cy + 0.5

        //--------------------------------------------------
        // stars finished
        //--------------------------------------------------
        if (this.m_stars_finished === true) {
            if (this.m_bob.x <= canvas_location.cx && canvas_location.cx < this.m_bob.x + 8 &&
                this.m_bob.y <= canvas_location.cy && canvas_location.cy < this.m_bob.y + 8) {
                
                // open a link
                open("https://youtu.be/7b2T8K2D-ps?feature=shared")
            }
            
        }        
    }

    set_complete() {
        // success
        this.m_stars_complete = true
        // reset the stars
        this.m_stars.forEach((element) => {
            element.t = 0
        })
    }

    set_finished() {
        // success
        this.m_stars_finished = true
    }

    animate() {

        //--------------------------------------------------
        // player movement model
        //--------------------------------------------------
        if (this.m_player_x_target !== undefined && this.m_player_y_target !== undefined) {

            const   dx = (this.m_player_x_target - this.m_player_x)
            const   dy = (this.m_player_y_target - this.m_player_y)
            const   dd = (Math.sqrt(dx * dx + dy * dy))

            const   target_intercept_x_velocity = (dx / dd) * Math.max(1.0, dd / 4)
            const   target_intercept_y_velocity = (dy / dd) * Math.max(1.0, dd / 4)

            const   dvx = target_intercept_x_velocity - this.m_player_x_velocity
            const   dvy = target_intercept_y_velocity - this.m_player_y_velocity
            
            const   min_impulse = 0
            const   max_impuse = 0.125

            if (0 < dvx) {
                this.m_player_x_velocity += Math.max(min_impulse, Math.min(max_impuse, Math.abs(dvx)))
            }

            if (dvx < 0) {
                this.m_player_x_velocity -= Math.max(min_impulse, Math.min(max_impuse, Math.abs(dvx)))
            }

            if (0 < dvy) {
                this.m_player_y_velocity += Math.max(min_impulse, Math.min(max_impuse, Math.abs(dvy)))
            }

            if (dvy < 0) {
                this.m_player_y_velocity -= Math.max(min_impulse, Math.min(max_impuse, Math.abs(dvy)))
            }
        }

        //--------------------------------------------------
        // player movement
        //--------------------------------------------------
        this.m_player_x += this.m_player_x_velocity
        if (Math.floor(this.m_player_x) < this.m_player_x_min || this.m_player_x_max < Math.floor(this.m_player_x)) {
            this.m_player_x_velocity = -this.m_player_x_velocity
            this.m_player_x += this.m_player_x_velocity
        }

        this.m_player_y += this.m_player_y_velocity
        if (Math.floor(this.m_player_y) < this.m_player_y_min || this.m_player_y_max < Math.floor(this.m_player_y)) {
            this.m_player_y_velocity = -this.m_player_y_velocity
            this.m_player_y += this.m_player_y_velocity
        }

        //--------------------------------------------------
        // stars in progress
        //--------------------------------------------------
        if (this.m_stars_complete === false) {

            //--------------------------------------------------
            // animation
            //--------------------------------------------------
            this.m_stars.forEach((element) => {
                if (0 <= element.t) {
                    element.t++
                    const t_max = this.m_star_progress_sprites_time * this.m_star_progress_sprites.length - 1
                    if(t_max < element.t) {
                        // reset the star
                        element.t = -1
                    }
                }
            })

            //--------------------------------------------------
            // collision detection
            //--------------------------------------------------
            this.m_stars.forEach((element) => {
                const   dx = (this.m_player_x - element.x)
                const   dy = (this.m_player_y - element.y)
                const   dh = (Math.sqrt(dx * dx + dy * dy))
                if (dh <= 8) {
                    element.t = 0
                }
            })

            //--------------------------------------------------
            // check for level complete
            //--------------------------------------------------
            const complete_count = this.m_stars.reduce((accum, element) => {
                if (0 <= element.t) {
                    return accum + 1
                }
                return accum
            }, 0)
            if (complete_count === this.m_stars.length) {
                this.set_complete()
            }
            // console log a progress hint
            // console.log(`:${complete_count}/${this.m_stars.length}`)
        }

        //--------------------------------------------------
        // stars complete
        //--------------------------------------------------
        if (this.m_stars_complete === true) {

            //--------------------------------------------------
            // animation
            //--------------------------------------------------
            this.m_stars.forEach((element) => {
                if (0 <= element.t) {
                    const t_max = this.m_star_complete_sprites_time * this.m_star_complete_sprites.length - 1
                    if(element.t < t_max) {
                        element.t++
                    }
                }
            })

            //--------------------------------------------------
            // check for level finished
            //--------------------------------------------------
            const finished_count = this.m_stars.reduce((accum, element) => {
                const t_max = this.m_star_complete_sprites_time * this.m_star_complete_sprites.length - 1
                if (element.t === t_max) {
                    return accum + 1
                }
                return accum
            }, 0)
            if (finished_count === this.m_stars.length) {
                this.set_finished()
            }
        }

        //--------------------------------------------------
        // stars finished
        //--------------------------------------------------
        if (this.m_stars_finished === true) {

            //--------------------------------------------------
            // animation
            //--------------------------------------------------
            const element = this.m_bob
            if (0 <= element.t) {
                const t_max = this.m_bob_sprites_time * this.m_bob_sprites.length - 1
                if(element.t < t_max) {
                    element.t++
                } else {
                    element.t = 0
                }
            }
        }
    }

    paint() {

        //--------------------------------------------------
        // stars in progress
        //--------------------------------------------------
        if (this.m_stars_complete === false) {

            //--------------------------------------------------
            // progress
            //--------------------------------------------------
            this.m_stars.forEach((element) => {
                if (0 <= element.t) {
                    const frame = Math.floor(element.t / this.m_star_progress_sprites_time)
                    SpritePainter.paint(
                        this.m_canvas_buffer,
                        this.m_star_progress_sprites[frame],
                        element.x,
                        element.y)
                }
            })
        }

        //--------------------------------------------------
        // stars complete
        //--------------------------------------------------
        if (this.m_stars_complete === true) {

            //--------------------------------------------------
            // progress
            //--------------------------------------------------
            this.m_stars.forEach((element) => {
                if (0 <= element.t) {
                    const frame = Math.floor(element.t / this.m_star_complete_sprites_time)
                    SpritePainter.paint(
                        this.m_canvas_buffer,
                        this.m_star_complete_sprites[frame],
                        element.x,
                        element.y)
                }
            })
        }

        //--------------------------------------------------
        // stars finished
        //--------------------------------------------------
        if (this.m_stars_finished === true) {

            //--------------------------------------------------
            // bob
            //--------------------------------------------------
            debugger
            const element = this.m_bob
            const frame = Math.floor(element.t / this.m_bob_sprites_time)
            // paint the player
            SpritePainter.paint(
                this.m_canvas_buffer,
                this.m_bob_sprites[frame],
                element.x,
                element.y)
        }

        //--------------------------------------------------
        // player
        //--------------------------------------------------
        const player_sprite = 0 <= this.m_player_x_velocity ? this.m_player_sprite_x_pos : this.m_player_sprite_x_neg
        // paint the player
        SpritePainter.paint(
            this.m_canvas_buffer,
            player_sprite,
            Math.floor(this.m_player_x),
            Math.floor(this.m_player_y))
    }
}

export default Playfield;
