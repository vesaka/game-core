import CryptoJS from 'crypto-js';

const CryptoJSAesJson = {
    stringify: (cipherParams) => {
        const j = {
            ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64)
        };
        if (cipherParams.iv) j.iv = cipherParams.iv.toString();
        if (cipherParams.salt) j.s = cipherParams.salt.toString();
        return JSON.stringify(j);
    },
    parse: (jsonStr) => {
        const j = JSON.parse(jsonStr);
        const cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(j.ct)
        });
        if (j.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(j.iv);
        if (j.s) cipherParams.salt = CryptoJS.enc.Hex.parse(j.s);
        return cipherParams;
    }
};
export const encrypt = (data, secret) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secret, {
        format: CryptoJSAesJson
    }).toString();
};

export const decrypt = (encrypted, secret) => {
    return JSON.parse(CryptoJS.AES.decrypt(encrypted, secret, {
        format: CryptoJSAesJson
    }).toString(CryptoJS.enc.Utf8));

}