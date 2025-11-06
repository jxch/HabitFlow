import chroma from 'chroma-js';

export function randomRgbaStr(): string {
    const alpha = 0.7 + Math.random() * 0.3;
    const [r, g, b, a] = chroma.random().alpha(alpha).rgba();
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${+a.toFixed(3)})`;
}
