const code = require('../../common/utils/code');
const bodyParser = require('body-parser')
module.exports = function(app) {
    app.use(bodyParser.urlencoded({ extended: false }))

    // parse application/json
    app.use(bodyParser.json())
    app.post('/api/decrypt', async function(req, res) {
        let cipher = req.body.cipher;
        let pri_key = `-----BEGIN RSA PRIVATE KEY-----
            MIIBOwIBAAJBAJEQ4DedOewYLSpL4voJYoJa2JjZGTfd3XTuDASnWIamvlhG0htr
            Eh33aq2U57aYj646J3KUuLjVp7jTxe5Em3ECAwEAAQJAfedXsu0SyIZzLLKQXNKo
            XNrcAkzqRkKZYlL4u1FC1Bmz47P9/Hphf/cDQxlmIRMsRn5bV5+2HnQa6FLubLRl
            wQIhANXttdmPBUTWOwiRg+SsZAKx5lGmoOFmsWDI/UnObC1DAiEArZhCCfkY1LkL
            E7dEBrzAViQ+8ZDs8CxKL1VPuK//zzsCIDNh5gS8SlqvTfyP3usE0PyouBYyfH/H
            B6GkhNm+X9M7AiEAkbHkWzJxoLfdkCKUOYNZefLZ0Sztb3X8nVVgn4U3kdkCIQDD
            OZ8t6A4cmjJFOkLx+GxNwiCV/o/qfXm6p5hQqplFYA==
            -----END RSA PRIVATE KEY-----`
        let result = await code.decryptRSA(cipher, pri_key);
        return res.json({data: result});
    });
}
