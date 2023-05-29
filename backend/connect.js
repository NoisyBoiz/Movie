const mongoose = require('mongoose');
async function connect() {
    try{
        await mongoose.connect('mongodb://localhost:27017', {
            dbName:"test",
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("connect success");
    }
    catch(e){
        console.log(e);
    }
}
module.exports = {connect};