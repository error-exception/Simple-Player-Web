export type TimeFunction = (x: number) => number

export const ease = cubicBezier(0.25, 0.1, 0.25, 1)

export const easeIn = cubicBezier(0.25, 0.1, 0.25, 1)
export const easeInSine = cubicBezier(0.12, 0, 0.39, 0)
export const easeInQuad = cubicBezier(0.11, 0, 0.5, 0)
export const easeInCubic = cubicBezier(0.32, 0, 0.67, 0)
export const easeInQuart = cubicBezier(0.5, 0, 0.75, 0)
export const easeInQuint = cubicBezier(0.64, 0, 0.78, 0)
export const easeInExpo = cubicBezier(0.7, 0, 0.84, 0)
export const easeInCirc = cubicBezier(0.55, 0, 1, 0.45)
export const easeInBack = cubicBezier(0.36, 0, 0.66, -0.56)
export const easeInElastic = (x: number): number => {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
        ? 0
        : x === 1
            ? 1
            : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4);
}
export const easeInBounce = (x: number): number => {
    return 1 - easeOutBounce(1 - x);
}

export const easeOut = cubicBezier(0, 0, 0.58, 1)
export const easeOutSine = cubicBezier(0.61, 1, 0.88, 1)
export const easeOutQuad = cubicBezier(0.5, 1, 0.89, 1)
export const easeOutCubic = cubicBezier(0.33, 1, 0.68, 1)
export const easeOutQuart = cubicBezier(0.25, 1, 0.5, 1)
export const easeOutQuint = cubicBezier(0.22, 1, 0.36, 1)
export const easeOutExpo = cubicBezier(0.16, 1, 0.3, 1)
export const easeOutCirc = cubicBezier(0, 0.55, 0.45, 1)
export const easeOutBack = cubicBezier(0.34, 1.56, 0.64, 1)
export const easeOutElastic = (x: number): number => {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
        ? 0
        : x === 1
            ? 1
            : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
}
export const easeOutBounce = (x: number): number => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}


export const easeInOut = cubicBezier(0.42, 0, 0.58, 1)
export const easeInOutSine = cubicBezier(0.37, 0, 0.63, 1)
export const easeInOutQuad = cubicBezier(0.45, 0, 0.55, 1)
export const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1)
export const easeInOutQuart = cubicBezier(0.76, 0, 0.24, 1)
export const easeInOutQuint = cubicBezier(0.83, 0, 0.17, 1)
export const easeInOutExpo = cubicBezier(0.87, 0, 0.13, 1)
export const easeInOutCirc = cubicBezier(0.85, 0, 0.15, 1)
export const easeInOutBack = cubicBezier(0.68, -0.6, 0.32, 1.6)
export const easeInOutElastic = (x: number): number => {
    const c5 = (2 * Math.PI) / 4.5;

    return x === 0
        ? 0
        : x === 1
            ? 1
            : x < 0.5
                ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c5)) / 2
                : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c5)) / 2 + 1;
}
export const easeInOutBounce = (x: number): number => {
    return x < 0.5
        ? (1 - easeOutBounce(1 - 2 * x)) / 2
        : (1 + easeOutBounce(2 * x - 1)) / 2;
}
export const linear = cubicBezier(0, 0, 1, 1)


export function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number) {
    const ZERO_LIMIT = 1e-6;
    // Calculate the polynomial coefficients,
    // implicit first and last control points are (0,0) and (1,1).
    const ax = 3 * p1x - 3 * p2x + 1;
    const bx = 3 * p2x - 6 * p1x;
    const cx = 3 * p1x;

    const ay = 3 * p1y - 3 * p2y + 1;
    const by = 3 * p2y - 6 * p1y;
    const cy = 3 * p1y;

    function sampleCurveDerivativeX(t: number) {
        // `ax t^3 + bx t^2 + cx t` expanded using Horner's rule
        return (3 * ax * t + 2 * bx) * t + cx;
    }

    function sampleCurveX(t: number) {
        return ((ax * t + bx) * t + cx) * t;
    }

    function sampleCurveY(t: number) {
        return ((ay * t + by) * t + cy) * t;
    }

    // Given an x value, find a parametric value it came from.
    function solveCurveX(x: number) {
        let t2 = x;
        let derivative;
        let x2;

        // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation
        // first try a few iterations of Newton's method -- normally very fast.
        // http://en.wikipedia.org/wikiNewton's_method
        for (let i = 0; i < 8; i++) {
            // f(t) - x = 0
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return t2;
            }
            derivative = sampleCurveDerivativeX(t2);
            // == 0, failure
            /* istanbul ignore if */
            if (Math.abs(derivative) < ZERO_LIMIT) {
                break;
            }
            t2 -= x2 / derivative;
        }

        // Fall back to the bisection method for reliability.
        // bisection
        // http://en.wikipedia.org/wiki/Bisection_method
        let t1 = 1;
        /* istanbul ignore next */
        let t0 = 0;

        /* istanbul ignore next */
        t2 = x;
        /* istanbul ignore next */
        while (t1 > t0) {
            x2 = sampleCurveX(t2) - x;
            if (Math.abs(x2) < ZERO_LIMIT) {
                return t2;
            }
            if (x2 > 0) {
                t1 = t2;
            } else {
                t0 = t2;
            }
            t2 = (t1 + t0) / 2;
        }

        // Failure
        return t2;
    }

    function solve(x: number) {
        return sampleCurveY(solveCurveX(x));
    }

    return solve;
}