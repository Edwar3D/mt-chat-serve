const mongoose = require('mongoose');

const DB = process.env.DB;
const DBPASSWORD = process.env.DBPASSWORD;
const DBUSER = process.env.DBUSER

const mongoDB = `mongodb+srv://${DBUSER}:${DBPASSWORD}@messages.hbzua.mongodb.net/${DB}?retryWrites=true&w=majority`


mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected to MongoDB')
    connect = false;
}).catch(err => {
    console.log(err)
});



process.on('SIGINT', async () => {
    await mongoose.connection.close();
    process.exit(0);
})