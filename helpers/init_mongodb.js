const mongoose = require('mongoose');

const DB = "mychat-db";
const DBPASSWORD = "chat123view";
const DBUSER ="chatview"

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