const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ChatSchema = new mongoose.Schema({
    type: {
        type: String
    },
    from: {
        type: String
    },
    to: {
        type: String
    },
    latestMessage: {
        type: Object
    }
});

ChatSchema.statics.insertOne = async function (chat) {
    let res = {};
    let success = true;
    try {
        res = await this.create(chat);
    } catch (e) {
        res = e._message;
        success = false;
    }
    return {
        success,
        res
    };
};

ChatSchema.statics.getByChatId = async function (chatId) {
    let res = {};
    const success = true;
    try {
        res = await this.find({ chatId: chatId });
    } catch (e) {
        res = e._message;
    }
    return {
        success,
        res
    };
};

ChatSchema.statics.updateLatestMessage = async function (chatId, msg) {
    let res = {};
    let success = true;
    try {
        await this.updateOne({ chatId: chatId }, { latestMessage: msg });
        res = (await this.getByChatId(chatId)).res[0];
    } catch (e) {
        res = e._message;
        success = false;
    }
    return {
        success,
        res
    };
};

ChatSchema.statics.related = async function (username) {
    let res = [];
    let success = true;
    try {
        res = await this.find({
            $or: [{
                from: username
            }, {
                to: username
            }]
        });
    } catch (e) {
        res = e._message;
        success = false;
    }
    return {
        success,
        res
    };
};

ChatSchema.plugin(AutoIncrement, { inc_field: 'chatId' });

const Chat = mongoose.model('Chat', ChatSchema);

module.exports = Chat;
