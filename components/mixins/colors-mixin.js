export default {
    methods: {
        byteToHex(num) {
            return ('0' + num.toString(16)).slice(-2);
        },
        colorToRGBA(color) {
            let canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 1, 1);
            const result = ctx.getImageData(0, 0, 1, 1).data;
            canvas.remove();
            return result;

        },
        colorToRGBAString(color) {
            const result = this.colorToRGBA(color);
            return `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${(Math.round(result[3] * 100) / 255) / 100})`;
        },
        colorToHex(color, withDash = true) {
            let rgba, hex;
            rgba = this.colorToRGBA(color);
            hex = [0, 1, 2].map(
                    function (idx) {
                        return byteToHex(rgba[idx]);
                    }
            ).join('');
            return (withDash ? "#" : "") + hex;
        },
        pickColor(position) {
            let canvas = this.$refs.line, ctx = canvas.getContext('2d'),
                    offset = parseInt(Math.min((position * canvas.width).toFixed(0), canvas.width - 1)),
                    result = ctx.getImageData(offset, 1, 1, 1).data;

            return `rgba(${result[0]}, ${result[1]}, ${result[2]}, ${(Math.round(result[3] * 100) / 255) / 100})`;
        },
        hexToByte(color) {
            let rrggbb = color.replace('#', ''), bbggrr = rrggbb.substr(4, 2) + rrggbb.substr(2, 2) + rrggbb.substr(0, 2);
            return parseInt(bbggrr, 16);
        }
    }
}


