import chroma from 'chroma-js';

export function randomRgbaStr(): string {
    const alpha = 0.7 + Math.random() * 0.3;
    const [r, g, b, a] = chroma.random().alpha(alpha).rgba();
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${+a.toFixed(3)})`;
}

export function getOptimalTextColor(backgroundColor: string): string {
    try {
        const bgColor = chroma(backgroundColor);
        const luminance = bgColor.luminance();

        // 映射亮度到白色强度 (越亮背景 -> 越柔和的白色)
        const softness = Math.min(0.8, luminance * 1.2); // 0-0.8

        // 从纯白到柔和白色的渐变
        return chroma.mix('#ffffff', '#dadada', softness, 'lab').hex();
    } catch {
        return '#ffffff';
    }
}

export function generateHeatmapColors(baseColor: string): string[] {
    return chroma.scale([
        chroma(baseColor).alpha(0.1),  // 最浅（10%透明度）
        chroma(baseColor).alpha(0.3),  // 浅
        chroma(baseColor).alpha(0.6),  // 中
        chroma(baseColor).alpha(1)   // 最深（不透明）
    ]).mode('lab').colors(4);
}
