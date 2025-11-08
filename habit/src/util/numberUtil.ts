export function iconDepthMapRange(value: number): number {
    const inputMin = 0
    const inputMax = 1.5
    const outputMin = 5
    const outputMax = 1

    if (value > inputMax) {
        return outputMax;
    }

    const depth = Math.floor(outputMin + (value - inputMin) * (outputMax - outputMin) / (inputMax - inputMin));

    if (depth < outputMax) {
        return outputMax;
    }

    if (depth > outputMin) {
        return outputMin;
    }

    return depth;
}
