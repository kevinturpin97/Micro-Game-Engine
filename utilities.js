class Utilities {
    static decreaseBrightness(color, amount) {
        const hsl = this.hexToHsl(color);
        hsl[2] -= amount;
        return this.hslToHex(hsl);
    }

    static increaseBrightness(color, amount) {
        const hsl = this.hexToHsl(color);
        hsl[2] += amount;
        return this.hslToHex(hsl);
    }

    static hexToHsl(color) {
        let r = parseInt(color.substring(1, 3), 16) / 255;
        let g = parseInt(color.substring(3, 5), 16) / 255;
        let b = parseInt(color.substring(5, 7), 16) / 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);

        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        return [h, s, l];
    }

    static hslToHex(hsl) {
        let r, g, b;

        let h = hsl[0];
        let s = hsl[1];
        let l = hsl[2];

        if (s === 0) {
            r = g = b = l;
        } else {
            let hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return `#${Math.round(r * 255).toString(16).padStart(2, '0')}${Math.round(g * 255).toString(16).padStart(2, '0')}${Math.round(b * 255).toString(16).padStart(2, '0')}`;
    }
}

export { Utilities };