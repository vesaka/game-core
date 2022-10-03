class Matrix {

    constructor(options) {
        this.width = 100;
        this.height = 100;
        this.rows = 5;
        this.columns = 5;
        this.slots = {};
        this.count = this.rows * this.columns;
        Object.assign(this, options);
        this.generateSlots();
        return this;
    }

    generateSlots() {
        const {rows, columns, width, height} = this;
        const cellWidth = Math.fixed(width / rows, 2);
        const cellHeight = Math.fixed(height / columns, 2);
        for (let x = 0; x < rows; x++) {
            if (!this.slots[x]) {
                this.slots[x] = {};
            }
            for (let y = 0; y < columns; y++) {
                this.slots[x][y] = {
                    x, y,
                    ax: x * cellWidth, ay: y * cellHeight,
                    bx: (x + 1) * cellWidth, by: y * cellHeight,
                    cx: x * cellWidth, cy: (y + 1) * cellHeight,
                    dx: (x + 1) * cellWidth, dy: (y + 1) * cellHeight,
                    width: cellWidth,
                    height: cellHeight,
                    available: true
                };
            }
        }
    }

    bookSlot(x, y = null) {
        if (!y) {
            x = x % this.columns;
            y = Math.floor(x / this.columns);
        }

        if (this.slots[x][y]) {
            this.slots[x][y].available = false;
        }

        return this;
    }

    releaseSlot(x, y = null) {
        if (!y) {
            x = x % this.columns;
            y = Math.floor(x / this.columns);
        }
        if (this.slots[x][y]) {
            this.slots[x][y].available = true;
        }

        return this;
    }

    eachSlot(callback) {
        const {slots} = this;
        for (let x in slots) {
            for (let y in slots[x]) {
                callback(slots[x][y], x, y);
            }
        }
    }

    eachEdgeSlot(callback) {
        const {slots, rows, columns} = this;
        const [lastX, lastY] = [rows - 1, columns - 1];
        for (let x = 0; x < rows; x++) {
            callback(slots[x][0]);
        }
        
        for (let y = 1; y < columns; y++) {
            callback(slots[rows-1][y]);
        }

        for (let x = lastX-1; x >= 0; x--) {
            callback(slots[x][columns-1]);
        }

        for (let y = lastY-1; y > 0; y--) {
            callback(slots[0][y]);
        }
    }

    firstSlot(callback) {
        const {slots} = this;
        let result;

        for (let x in slots) {
            for (let y in slots[x]) {
                result = callback(slots[x][y]);
                if (true === result) {
                    return slots[x][y];
                }
            }
        }

        return null;
    }

    findSlotByPoint(point) {

    }

}

export default Matrix;