import { encrypt, decrypt } from 'crypto-js/aes';
import { parse } from 'crypto-js/enc-utf8';
import pkcs7 from 'crypto-js/pad-pkcs7';
import ECB from 'crypto-js/mode-ecb';
import UTF8 from 'crypto-js/enc-utf8';
import { cacheCipher } from '../../enums/cipherEnum';

interface IOption {
    mode: typeof ECB,
    padding: typeof pkcs7,
    iv: any
}

export interface EncryptionParams {
    key: string;
    iv: string;
  }

export class AesEncryption {
    private key;
    private iv;

    constructor(opt: Partial<EncryptionParams> = {}) {
        const { key, iv } = opt;
        this.key = parse(key || cacheCipher.key);
        this.iv = parse(iv || cacheCipher.iv);
    }

    get getOptions():IOption {
        return {
            mode: ECB,
            padding: pkcs7,
            iv: this.iv
        };
    }

    encryptByAES(cipherText: string) {
        return encrypt(cipherText, this.key, this.getOptions).toString();
    }

    decryptByAES(cipherText: string) {
        return decrypt(cipherText, this.key, this.getOptions).toString(UTF8);
    }
}
