'use strict';

let app = require('../../server/server')
let to = require('await-to-js').to
let form = require('../utils/form')
let code = require('../utils/code')

module.exports = function(Customer) {
    Customer.openApp = async function(machineId, publicKey) {
        let Machine = app.models.Machine
        let [errMachine, machine] = await to (Machine.findOne({where: {machineId}}))

        if (errMachine || !machineId) {
            return await form.errorForm();
        }

        return await form.productForm(machineId, publicKey)
    }

    Customer.buy = async function(list, machineId, publicKey) {
        for (let i in list) {
            let productId = list[i].productId
            let amount = list[i].amount
        }
        let listString = JSON.stringify(list);
        let listStringEncrypted = await code.encryptRSA(listString, publicKey)
        console.log('-----------------')
        console.log(listStringEncrypted)
        let pub_key = `-----BEGIN PUBLIC KEY-----
                    MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIK8JmM8nrUZPso0rqN8p+oNmcDM9aDb
                    iOmExy+Qi5Wdotb+8Qc6ICvNFzPxV2xAGZIy1JzxYggrcx1Dn5ANEb8CAwEAAQ==
                    -----END PUBLIC KEY-----
                    `
        let pri_k = `-----BEGIN RSA PRIVATE KEY-----
            MIIBOgIBAAJBAIK8JmM8nrUZPso0rqN8p+oNmcDM9aDbiOmExy+Qi5Wdotb+8Qc6
            ICvNFzPxV2xAGZIy1JzxYggrcx1Dn5ANEb8CAwEAAQJAd2qTifv6YCOyNhOPHeik
            nGdV9UWCbC97zQoqw2i+B6fFlZ0Hb+SMTV70b8zXcv47BVuDllH73RdSsRAixYTZ
            GQIhANn8Z1BIFoNpaMwtWUDbrCKqHp+7+oA0DyaZngxsrrdDAiEAmYiUnxIThyEm
            8J+AQBBfOArqrsH83TSWBi6yOrukHdUCIQDGkWC/RduUO4omK80ZAsJsFVGuKjtH
            W6TNgbPyF3KUJwIga6pxvpMoioxfCEJx53sTqvNM27xBnMXxpug8KB/J2PkCIHU9
            85Uqsug6w1xL6zFghnYt+IpKPNAobL63LMlML5AB
            -----END RSA PRIVATE KEY-----`
        console.log(await code.decryptRSA(listStringEncrypted, pk))
        console.log('-----------------')
        let qrBase64 = await code.encodeQR(listStringEncrypted)
        return await form.QR(qrBase64, machineId, publicKey)
    }

    Customer.remoteMethod(
        'openApp', {
            http: {path: '/open-app', verb: 'get'},
            accepts:
            [
                {arg: 'machine_id', type: 'number', required: true},
                {arg: 'public_key', type: 'string', required: true}
            ],
            returns: {arg: 'data', type: 'object'}
        }
    )

    Customer.remoteMethod(
        'buy', {
            http: {path: '/buy', verb: 'post'},
            accepts:
            [
                {arg: 'list', type: 'any', required: true},
                {arg: 'machine_id', type: 'number', required: true},
                {arg: 'public_key', type: 'string', required: true}
            ],
            returns: {arg: 'data', type: 'object'}
        }
    )
};
