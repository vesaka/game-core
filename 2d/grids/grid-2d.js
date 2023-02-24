import Container from '$core/container';
import { between } from '$core/utils/math';

class Grid2D extends Container {
    constructor(preset) {
        super();
        this.width = 100;
        this.height = 100;
        Object.assign(this, preset);
        this.list = {};
        this.cells = [];
        this.presets = {};
        this.freeSlots = [];
        this.takenSlots = [];
        if (!this.placement) {
            this.placement = {
                x: [0.1, 0.9],
                y: [-0.1, -0.2]
            }
        }
        return this;
    }
    
    arrange(process = null) {
        const {rows, columns, types, placement, app} =  this;
        const def = this.default;
        
        const slot = Object.assign({}, placement, {
            x: [placement.x[0]*app.screen.width, placement.x[1]*app.screen.width],
            y: [placement.y[0]*app.screen.height, placement.y[1]*app.screen.height],
        });

        let count = 0; 

        for (let type in types) {
            if (!this.list[type]) {
                this.list[type] = [];
            }
            
            const settings = Object.assign({}, def, types[type]);
            
            count += settings.max;
            this.presets[type] = settings;
            if (typeof process === 'function') {
                for (let i = 0; i < settings.max; i++) {
                    this.list[type].push(process(settings, type, i));
                }
            }
        }
        
        this.clountSlots = count;
        
        const remain = count % slot.columns; 
        const lastRow = slot.rows - 1;
        const cellHeight = Math.abs(slot.y[1] - slot.y[0])  / slot.rows;
        const gridWidth = Math.abs(slot.x[1] - slot.x[0]);

        for (let n = 0; n <= count; n++) {
            const column = n % slot.columns;
            const row = Math.floor(n / slot.columns);
            const cellWidth = Math.floor(gridWidth / (row !== lastRow ? slot.columns : remain));
            this.freeSlots.push(n);
            
            this.cells.push({
                x: [slot.x[0] + column*cellWidth, slot.x[0] + (column + 1)*cellWidth ],
                y: [slot.y[0] - row*cellHeight, slot.y[0] - (row + 1)*cellHeight ]
            });
        }
                
    }
    
    getCell(i = null) {
        if (!this.cells[i]) {
            i = 0;
        }
        
        return this.cells[i];
    }
    
    bookSlot(i) {
        const id = this.freeSlots.indexOf(i);
        if (id > -1) {
            this.freeSlots.splice(id, 1);
        }
        
        if (this.takenSlots.indexOf(i) < 0) {
            this.takenSlots.push(i);
        }
        
        return this;
    }
    
    releaseSlot(i) {
        const id = this.takenSlots.indexOf(i);
        if (id > -1) {
            this.takenSlots.splice(id, 1);
        }
        
        if (this.freeSlots.indexOf(i) < 0) {
            this.freeSlots.push(i);
        }
        
        return this;
    }
    
    realeaseAllSlots() {
        this.takenSlots = [];
        this.freeSlots = [];
        for (let n = 0; n <= this.countSlots; n++) {
            this.freeSlots.push(n);
        }
    }
    
    randomize(delta = 2) {
        const {rows, columns, width, height} = this;
        const cell = {
            width: Math.round(width / rows, 2),
            height: Math.round(height / columns, 2)
        };
        const points = [];
        
        let x, y, lastX = Math.round(Math.between(rows - delta, rows)), lastY;
        
        const push = (x, y) => {
            points.push({
                    x: Math.round(Math.between(x * cell.width, (x+1) * cell.width), 2),
                    y: Math.round(Math.between(y * cell.height, (y+1) * cell.heihgt), 2),
            });
        };
        for (x = 0; x < lastX; x++) {
            y = x > 0  ? Math.between(0, delta) : 0;
            push(x, y);
        }
        
        lastY = y;
        
        for (y = lastY; y < columns; y++) {
            x = Math.between(rows - delta, rows);
            push(x, y);
        }
        
        lastX = x;
        lastY = y;
        
        for (x = lastX; x > 0; x--) {
            y = Math.between(columns - delta, columns);
            push(x, y);
        }
        
        lastX = x;
        lastY = y;
        
        for (y = lastY; y > 0; y--) {
            x = Math.between(0, delta);
            push(x, y);
        }
        
        return points;
    }
}

export default Grid2D;