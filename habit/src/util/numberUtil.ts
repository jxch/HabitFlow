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

export function slidingWindowSum(input: string, windowSize: number): number[] {
    const numbers: number[] = input.split(',').map(str => Number(str.trim()));
    const result: number[] = [];

    for (let i: number = 0; i < numbers.length; i++) {
        let sum: number = 0;
        for (let j: number = 0; j < windowSize; j++) {
            const index: number = i + j;  // 从当前位置向右
            sum += index < numbers.length ? numbers[index]! : 0; // 超出范围默认为0
        }
        result.push(sum);
    }

    return result;
}