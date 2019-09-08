const QRCode = require('qrcode');

exports.encodeQR =  async (msg) => {
    return QRCode.toDataURL(msg);
}
