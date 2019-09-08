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
            return form.errorForm();
        }

        return form.productForm(machineId, publicKey)
    }

    Customer.buy = async function(list, publicKey) {
        let listString = JSON.stringify(list);
        let listStringEncrypted = code.encrypt(listString, publicKey)
        let qrBase64 = code.encodeQR(listStringEncrypted)
        return form.QR(qrBase64)
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
                {arg: 'public_key', type: 'string', required: true}
            ],
            returns: {arg: 'data', type: 'object'}
        }
    )
};
