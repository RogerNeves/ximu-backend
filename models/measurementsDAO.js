var mongoose = require("../dataBase/mongoose");

var medicoesSchema = new mongoose.Schema({
    idDevice: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now
    }
}, { strict: false });

module.exports = mongoose.model('medicoes', medicoesSchema);