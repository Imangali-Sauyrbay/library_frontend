interface BezierOptions {
    /**
     * From 0 to 1. Determines the position along the curve
     */
    t: number

    /**
     * The starting point of the curve
     */
    startingPoint: number
    /**
     * The first control point
     */
    p1: number
    /**
     * The second control point
     */
    p2: number
    /**
     * The ending point of the curve
     */
    endingPoint: number
}

// equatision B(t) = P0(1-t)^3 + 3P1t(1-t)^2 + 3P2t^2(1-t) + P3t^3
const bezier = (options: BezierOptions): number => {
    const {t, startingPoint, p1, p2, endingPoint} = options

    return startingPoint * (1 - t) ** 3 +
    3 * p1 * t * (1 - t) ** 2 +
    3 * p2 * t ** 2 * (1 - t) +
    endingPoint * t ** 3
}

const easeInOutControlPoints = (
    startingPoint: number,
    endingPoint: number): {
        p1: number,
        p2: number
    } => {
    const p1 = startingPoint + (endingPoint - startingPoint) * 1/3
    const p2 = startingPoint + (endingPoint - startingPoint) * 2/3
    return { p1, p2 };
}

const cssToBezier = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
): [number, number, number, number] => {
    const p0 = 0;
    const p1 = y1 / x1;
    const p2 = (1 - y2) / (1 - x2);
    const p3 = 1;
    
    return [p0, p1, p2, p3];
}

export {
    bezier,
    easeInOutControlPoints,
    cssToBezier
}