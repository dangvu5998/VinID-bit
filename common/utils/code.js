const QRCode = require('qrcode');

async function encodeQR(msg) {
    try {
        return await QRCode.toDataURL(msg)
    } catch(err) {
        return null;
    }
}
