let app = require('../../server/server')
let to = require('await-to-js').to
template = {
    "metadata": {
        "app_name": "bitZero",
        "title": "bitZero",
        "submit_button": {
            "label": "Gửi thông tin",
            "background_color": "#6666ff",
            "cta": "request",
            "url": "https://teambit.tech/api/send-response"
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

module.exports = {
    errorForm: async () => {
        let form = template
        template.metadata.elements.push({
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
        let form = template
        form.machine_id = machineId
        form.public_key = publicKey
        let Product = app.models.Product
        for (let i in productMachine) {
            productName = Product.findOne({where: {productId: productMachine[i].productId}})
            form.metadata.elements.push({
                type: 'input',
                input_type: 'number',
                name: `${productMachine[i].productId}_${productMachine[i].machineId}`,
                placeholder: `Còn ${productMachine[i].amount} sản phẩm`,
                label: productName
            })
        }
        return form
    },

    QR: async (qrBase64, machineId, publicKey) => {
        let form = template
        form.machine_id = machineId
        form.public_key = publicKey
        form.metadata.elements.push({
            type: 'web',
            content: ''
        })
        return form
    }
}