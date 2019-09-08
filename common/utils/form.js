let app = require('../../server/server')
let to = ('await-to-js').to
template = {
    "metadata": {
        "app_name": "bitZero",
        "title": "bitZero - Tự định nghĩa cách bạn mua hàng",
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
        for (let i in productMachine) {
            form.metadata.elements.push({
                type: 'input',
                input_type: 'number',
                name: `${productMachine[i].productId}_${productMachine[i].machineId}`,
                placeholder: `Số sản phẩm còn lại là: ${productMachine[i].amount}`
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