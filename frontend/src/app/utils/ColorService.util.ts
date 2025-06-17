export enum ColorEnum {
    Pink = "#FFC0CB",
    LightGreen = "#90EE90",
    SkyBlue = "#87CEEB",
    DarkYellow = "#CCCC00",
    Purple = "#800080",
    Orange = "#FFA500",
}

export class ColorService {
    /**
     * Converts a hex color code to an RGB color.
     * @param hex - The hex color code (e.g., "#FFFFFF").
     * @returns An object with r, g, and b values.
     */

    static getColorByEnum(color: ColorEnum): string {
        return color;
    }

    static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
        if (!/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            return null;
        }
        let color = hex.substring(1).split('');
        if (color.length === 3) {
            color = [color[0], color[0], color[1], color[1], color[2], color[2]];
        }
        const intColor = parseInt(color.join(''), 16);
        return {
            r: (intColor >> 16) & 255,
            g: (intColor >> 8) & 255,
            b: intColor & 255,
        };
    }

    /**
     * Converts an RGB color to a hex color code.
     * @param r - Red value (0-255).
     * @param g - Green value (0-255).
     * @param b - Blue value (0-255).
     * @returns The hex color code (e.g., "#FFFFFF").
     */
    static rgbToHex(r: number, g: number, b: number): string {
        const toHex = (value: number) =>
            value.toString(16).padStart(2, '0').toUpperCase();
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    /**
     * Generates a random hex color code.
     * @returns A random hex color code (e.g., "#A1B2C3").
     */
    static generateRandomColor(): string {
        const randomValue = () => Math.floor(Math.random() * 256);
        return this.rgbToHex(randomValue(), randomValue(), randomValue());
    }

    /**
     * Lightens a hex color by a given percentage.
     * @param hex - The hex color code (e.g., "#FFFFFF").
     * @param percent - The percentage to lighten (0-100).
     * @returns The lightened hex color code.
     */
    static lightenColor(hex: string, percent: number): string | null {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return null;
        const lighten = (value: number) =>
            Math.min(255, Math.floor(value + (255 - value) * (percent / 100)));
        return this.rgbToHex(lighten(rgb.r), lighten(rgb.g), lighten(rgb.b));
    }

    /**
     * Darkens a hex color by a given percentage.
     * @param hex - The hex color code (e.g., "#FFFFFF").
     * @param percent - The percentage to darken (0-100).
     * @returns The darkened hex color code.
     */
    static darkenColor(hex: string, percent: number): string | null {
        const rgb = this.hexToRgb(hex);
        if (!rgb) return null;
        const darken = (value: number) =>
            Math.max(0, Math.floor(value * (1 - percent / 100)));
        return this.rgbToHex(darken(rgb.r), darken(rgb.g), darken(rgb.b));
    }
}