const mongoose = require('mongoose');
const MessageSchema = new mongoose.Schema({
    text: String,
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

const Message = mongoose.model('message', MessageSchema);
module.exports = Message;