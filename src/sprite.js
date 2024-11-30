//--------------------------------------------------
// Sprite
//--------------------------------------------------
class Sprite {
    constructor([row_0 = 0, row_1 = 0, row_2 = 0, row_3 = 0, row_4 = 0, row_5 = 0, row_6 = 0, row_7 = 0] = []) {
        
        // sprite visuals
        this.rows = [row_0, row_1, row_2, row_3, row_4, row_5, row_6, row_7];
        this.matrix = this.rows.map((element) => Sprite.create_vector(element));
    }

    to_color(row, column) {
        let color = undefined;
        if (0 <= row && row < 8 && 0 <= column && column < 8) {
            if (this.matrix[row][column]) {
                color = { r: 255, g: 255, b: 255, a: 255 } 
            }
        }
        if (!color) {
            color = { red: 0, green: 0, blue: 0, apha: 0 }
        }
        return color;
    }

    toString() {
        return Sprite.convert_matrix_to_string(this.matrix);
    }

    static create_vector(input) {
        if(typeof input === "number" && 0 <= input && input < 256) {
            let result = [];
            for(let count = 7; count >= 0; count--) {
                result.push((input >> count) & 1);
            }
            return result;
        }

        return ([0, 0, 0, 0, 0, 0, 0, 0]);
    }
    
    static convert_row_to_string(input) {
        const result = input.reduce((previous, current, index, array) => {
            return previous + (current ? "X" : "_") }, "");
        return result;
    }

    static convert_matrix_to_string(input) {
        const result = input.reduce((previous, current, index, array) => {
            return previous + Sprite.convert_row_to_string(current) + "\n" }, "");
        return result;
    }
}

export default Sprite;