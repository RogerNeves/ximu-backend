const mongoose = require("mongoose");
mongoose.connect('mongodb://XimuBackEnd:uYRRyAOjlyaoAWMc@cluster0-shard-00-00-4kipi.mongodb.net:27017,cluster0-shard-00-01-4kipi.mongodb.net:27017,cluster0-shard-00-02-4kipi.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',{ useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },()=>{
    console.log("conectado")
});
mongoose.Promise = global.Promise;

module.exports = mongoose;