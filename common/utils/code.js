const QRCode = require('qrcode');
const NodeRSA = require('node-rsa')

exports.encodeQR =  async (msg) => {
    return QRCode.toDataURL(msg);
}

exports.encryptRSA = async (msg, publicKey) => {
    const key = new NodeRSA(publicKey)
    return key.encrypt(msg, 'base64')
}

exports.decryptRSA = async (msg, privateKey) => {
    const key = new NodeRSA(privateKey)
    return key.decrypt(msg, 'utf8')
}
