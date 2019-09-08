let app = require('../../server/server')
let to = require('await-to-js').to
let urlRoot = "https://vinid-bit.herokuapp.com/api/customers"

module.exports = {
    errorForm: async () => {
        let form = {
            "metadata": {
                "app_name": "bitZero",
                "title": "bitZero",
                "submit_button": {
                    "label": "Gửi thông tin",
                    "background_color": "#6666ff",
                    "cta": "request",
                    "url": urlRoot + "/open-app"
                },
                "reset_button": {
                    "label": "Xoá bản ghi",
                    "background_color": "#669999"
                },
                "elements": []
            },
            "machine_id": "",
            "public_key": ""
        }
        form.metadata.elements.push({
            'type': 'text',
            'style': 'paragraph',
            'content': 'Yêu cầu không hợp lệ!'
        })
        return form
    },

    productForm: async (machineId, publicKey) => {
        let ProductMachine = app.models.ProductMachine
        let [errorPM, productMachine] = await to (ProductMachine.find({where: {machineId}}))
        if (errorPM || !productMachine) {
            return await this.errorForm
        }
        let form = {
            "metadata": {
                "app_name": "bitZero",
                "title": "bitZero",
                "submit_button": {
                    "label": "Gửi thông tin",
                    "background_color": "#6666ff",
                    "cta": "request",
                    "url": urlRoot + "/open-app"
                },
                "reset_button": {
                    "label": "Xoá bản ghi",
                    "background_color": "#669999"
                },
                "elements": []
            },
            "machine_id": "",
            "public_key": ""
        }
        form.machine_id = machineId
        form.public_key = publicKey
        let Product = app.models.Product
        for (let i in productMachine) {
            let product = await Product.findOne({where: {productId: productMachine[i].productId}})
            let productName = product.productName
            form.metadata.elements.push({
                type: 'input',
                input_type: 'number',
                name: `${productMachine[i].productId}_${productMachine[i].machineId}`,
                placeholder: `Còn ${productMachine[i].amount} sản phẩm`,
                label: productName
            })
        }
        form.metadata.submit_button.url = urlRoot + "/buy" + `?information=${machineId}:::${publicKey}`
        return form
    },

    QR: async (qrBase64, machineId, publicKey) => {
        let form = {
            "metadata": {
                "app_name": "bitZero",
                "title": "bitZero",
                "submit_button": {
                    "label": "Gửi thông tin",
                    "background_color": "#6666ff",
                    "cta": "request",
                    "url": urlRoot + "/open-app"
                },
                "reset_button": {
                    "label": "Xoá bản ghi",
                    "background_color": "#669999"
                },
                "elements": []
            },
            "machine_id": "",
            "public_key": ""
        }
        form.machine_id = machineId
        form.public_key = publicKey
        form.metadata.elements.push({
            type: 'web',
            content: `<html><body><h2>QR Code<h2><img src=${qrBase64} alt="QR Code" width="300" height="300"><body><html>`
        })
        return form
    }
}
