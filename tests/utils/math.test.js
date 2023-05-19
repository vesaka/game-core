import { factoriel, between, degrees } from '../../utils/math';

import { describe, it, expect } from 'vitest';

describe('Factoriel', () => {
    it.each([
        [1, 1],
        [2, 2],
        [3, 6],
        [4, 24],
        [5, 120]
    ])('calculates (%i) to be ($i)', (a, result) => {
        expect(factoriel(a)).toBe(result);
    })
});

describe('Between util', () => {
    it.each([
        [35, 103],
        [-143, 29],
        [302, 2703],
    ])('returns result greater than (%i) and less than ($i)', (a, b) => {
        const result = between(a, b);
 
        expect(result).toBeGreaterThanOrEqual(a);
        expect(result).toBeLessThanOrEqual(b);

    })
});

describe('Degree util ', () => {
    it.each([
        [1, '57.29578'],
        [1.234, '70.70299'],
        [-0.78, '-44.69071']
    ])('converts %i radians to %i degrees', (a, b) => {
        expect(degrees(a).toFixed(5)).toBe(b);
    })
});