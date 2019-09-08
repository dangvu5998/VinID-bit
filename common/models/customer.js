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

    Customer.buy = async function(list, publicKey) {
        for (let i in list) {
            let productId = list[i].productId
            let amount = list[i].amount

        }
        let listString = JSON.stringify(list);
        let listStringEncrypted = await code.encryptRSA(listString, publicKey)
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
