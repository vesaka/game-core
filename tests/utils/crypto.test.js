import { encrypt, decrypt } from '../../utils/crypto';

import { describe, it, expect } from 'vitest';

const secret = '!MyBigSecret!';
const encryptableData = {foor: 'bar'};
describe('Cryto JS ', () => {
    it('returns encrypted string', () => {
        expect(encrypt(encryptableData, secret)).toBeTypeOf('string');
    });

    it('decrypts data correctly', () => {
        const data = {user: 'John Doe', id: 123};
        const encryptedUserData = encrypt(data, secret);

        expect(decrypt(encryptedUserData, secret)).toStrictEqual(data);
    })

    it('decrypts different if secret do not mach', () => {
        const data = {user: 'John Doe', id: 123};
        const encryptedUserData = encrypt(data, secret);

        expect(() => decrypt(encryptedUserData, '!MYOtherSecret!')).toThrow(/JSON|UTF\-8\s+data/);
    })
});
