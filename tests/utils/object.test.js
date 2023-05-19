import { raw, extend, serialize } from '../../utils/object';

import { describe, it, expect } from 'vitest';

describe('Object ', () => {
    it('copies successfully', () => {
        const data = {user: "John", id: 123};
        const obj = new Proxy(data, {
            get(target, prop) {return target[prop]}
        })
        expect(raw(obj)).toStrictEqual(data)
    })
});