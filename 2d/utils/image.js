/* global NaN */

const ID = 'non-trasnaprent-bounds-image';
const d3_geom_contourDx = [1, 0, 1, 1, -1, 0, -1, 1, 0, 0, 0, 0, -1, 0, -1, NaN];
const d3_geom_contourDy = [0, -1, 0, 0, 0, -1, 0, 0, 1, -1, 1, 1, 0, -1, 0, NaN];

const getNonTransparentBounds = texture => {

    if (!texture.resource) {
        return false;
    }
    const imgSource = texture.resource.source;


    let canvas = null;
    if (!imgSource) {
        return false;
    }
    let context = null;
    if (imgSource.getContext) {
        canvas = imgSource;
        context = canvas.getContext('2d');
    } else if (imgSource instanceof Image) {
        canvas = document.createElement('canvas');
        canvas.width = imgSource.width;
        canvas.height = imgSource.height;
        context = canvas.getContext('2d');
        context.drawImage(imgSource, 0, 0);
    } else {
        return false;
    }

    const cw = canvas.width, ch = canvas.height;
    let data = context.getImageData(0, 0, cw, ch).data;
//console.log(data);
return;
    const defineNonTransparent = (x, y) => {
        const a = data[(y * cw + x) * 4 + 3];
        return(a > 20);
    };
    
    console.log(contour(defineNonTransparent));


};



const contour = (grid, start) => {
    var s = start || [0, 0], // starting point 
            c = [], // contour polygon 
            x = s[0], // current x position 
            y = s[1], // current y position 
            dx = 0, // next x direction 
            dy = 0, // next y direction 
            pdx = NaN, // previous x direction 
            pdy = NaN, // previous y direction 
            i = 0;

    do {
        i = 0;
        if (grid(x - 1, y - 1))
            i += 1;
        if (grid(x, y - 1))
            i += 2;
        if (grid(x - 1, y))
            i += 4;
        if (grid(x, y))
            i += 8;

        if (i === 6) {
            dx = pdy === -1 ? -1 : 1;
            dy = 0;
        } else if (i === 9) {
            dx = 0;
            dy = pdx === 1 ? -1 : 1;
        } else {
            dx = d3_geom_contourDx[i];
            dy = d3_geom_contourDy[i];
        }

        // update contour polygon 
        if (dx !== pdx && dy !== pdy) {
            c.push([x, y]);
            pdx = dx;
            pdy = dy;
        }

        x += dx;
        y += dy;
    } while (s[0] !== x || s[1] !== y);

    return c;
};

const createHitmap = (texture, threshold = 255) => {
    if (!texture.resource) {
        return false;
    }
    const imgSource = texture.resource.source;

    let canvas = null;
    if (!imgSource) {
        return false;
    }
    let context = null;
    if (imgSource.getContext) {
        canvas = imgSource;
        context = canvas.getContext('2d');
    } else if (imgSource instanceof Image) {
        canvas = document.createElement('canvas');
        canvas.width = imgSource.width;
        canvas.height = imgSource.height;
        context = canvas.getContext('2d');
        context.drawImage(imgSource, 0, 0);
    } else {
        return false;
    }

    const w = canvas.width, h = canvas.height;
    let imageData = context.getImageData(0, 0, w, h);
    let hitmap = texture.hitmap = new Uint32Array(Math.ceil(w * h / 32));
    for (let i = 0; i < w * h; i++) {
        let ind1 = i % 32;
        let ind2 = i / 32 | 0;

        if (imageData.data[i * 4 + 3] >= threshold) {
            hitmap[ind2] = hitmap[ind2] | (1 << ind1);
        }
    }


    return true;
};

export { getNonTransparentBounds, createHitmap };