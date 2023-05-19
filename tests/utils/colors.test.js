import { cmpToHex } from '../../utils/colors';

import { describe, it, assertType , expect, beforeEach } from 'vitest';

describe('cmpToHex util', () => {
    it('returns string', () => {
        expect(cmpToHex('#121212')).toBeTypeOf('string');
    })
});

