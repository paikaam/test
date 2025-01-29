const express = require('express');
const CryptoJS = require('crypto-js');

const app = express();
app.use(express.json());

const secretKey = "ZW9ueHNJWUFMcVd6M25GRw==";

function cryptoJSEncryptAES(data) {
    if (!data) return null;
    const key = CryptoJS.enc.Base64.parse(secretKey);
    return CryptoJS.AES.encrypt(JSON.stringify(data), key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString();
}

function cryptoJSDecryptAES(encryptedData) {
    try {
        if (!encryptedData) return null;
        const key = CryptoJS.enc.Base64.parse(secretKey);
        const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    } catch (e) {
        console.error("Decryption Exception occurred", e);
        return null;
    }
}

app.post('/encrypt', (req, res) => {
    const data = req.body;
    const encryptedData = cryptoJSEncryptAES(data);
    res.json({ encryptedData });
});

app.post('/encrypt2', express.text(), (req, res) => {
    const plaintext = req.body;
    const encryptedData = cryptoJSEncryptAES(plaintext);
    res.json({ encryptedData });
});

app.post('/decrypt', (req, res) => {
    const { encryptedData } = req.body;
    const decryptedData = cryptoJSDecryptAES(encryptedData);
    res.json({ decryptedData });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});