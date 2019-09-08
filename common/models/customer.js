'use strict';

let app = require('../../server/server')
let to = require('await-to-js').to
let form = require('../utils/form')
let code = require('../utils/code')

module.exports = function(Customer) {
    Customer.openApp = async function(information) {
        let machineId = parseInt(information.split(':::')[0])
        let publicKey = information.split(':::')[1]
        // console.log(machineId)
        // console.log(publicKey)
        let Machine = app.models.Machine
        let [errMachine, machine] = await to (Machine.findOne({where: {machineId}}))

        if (errMachine || !machineId) {
            return await form.errorForm();
        }

        return await form.productForm(machineId, publicKey)
    }

    Customer.buy = async function(req, information) {
        let list = req.body
        let machineId = parseInt(information.split(':::')[0])
        let publicKey = information.split(':::')[1]
        // console.log(list, machineId, publicKey)
        // let list = metadata.elements
        // for (let i in list) {
        //     let productId = list[i].productId
        //     let amount = list[i].amount
        // }
        // list = JSON.parse(list)
        let standardList = {}
        let ProductMachine = app.models.ProductMachine
        for (const [key, value] of Object.entries(list)) {
            let machineIdInList = parseInt(key.split('_')[0], 10)
            if (machineIdInList != machineId) {
                continue
            }
            let productIdInList = parseInt(key.split('_')[1], 10)
            let remain = ProductMachine.findOne({where: {productId: productIdInList, machineId: machineIdInList}}).amount
            value = parseInt(value, 10)
            if (value < 0) {
                value = 0
            }
            if (value > remain) {
                value = remain
            }
            standardList[productIdInList] = value
        }
        let listString = JSON.stringify(standardList);
        // console.log(listString)
        let listStringEncrypted = await code.encryptRSA(listString, publicKey)
        // console.log(listStringEncrypted)
        let qrBase64 = await code.encodeQR(listStringEncrypted)
        return await form.QR(qrBase64, machineId, publicKey)
    }

    Customer.remoteMethod(
        'openApp', {
            http: {path: '/open-app', verb: 'post'},
            accepts:
            [
                {arg: 'information', type: 'string', required: true, http: {source: 'query'}}
            ],
            returns: {arg: 'data', type: 'object'}
        }
    )

    Customer.remoteMethod(
        'buy', {
            http: {path: '/buy', verb: 'post'},
            accepts:
            [
                {arg: 'req', type: 'object', required: true, http: {source: 'req'}},
                {arg: 'information', type: 'string', required: true, http: {source: 'query'}}
            ],
            returns: {arg: 'data', type: 'object'}
        }
    )
};
