const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    online: {
        type: Boolean
    },
    status: {
        type: String
    },
    socketID: {
        type: String
    },
    statusUpdateTime: {
        type: Date
    }
});

UserSchema.statics.exists = async function (username) {
    const findResult = await this.findOne({ username: username });
    return !!findResult;
};

UserSchema.statics.getOneUserByUsername = async function (username) {
    let res = {};
    const success = true;
    try {
        res = await this.find({ username: username });
    } catch (e) {
        res = e._message;
    }
    return {
        success,
        res
    };
};

UserSchema.statics.updateStatus = async function (username, status) {
    const res = await this.updateOne({ username: username }, {
        status: status,
        statusUpdateTime: new Date()
    });
    return res;
};

UserSchema.statics.updateOnline = async function (username, online) {
    const res = await this.updateOne({ username: username }, { online: online });
    return res;
};

UserSchema.statics.updateSocketId = async function (username, socketID) {
    const res = await this.updateOne({ username: username }, { socketID: socketID });
    return res;
};

UserSchema.statics.addOneUser = async function (userObject) {
    let res = {};
    let success = true;
    try {
        res = await this.create(userObject);
    } catch (e) {
        if (e.errors && e.errors.username && e.errors.username.kind && e.errors.username.kind === 'unique') {
            res = 'Username already exist';
        } else {
            res = e._message;
        }
        success = false;
    }
    return {
        success,
        res
    };
};

UserSchema.statics.validateCredentials = async function (username, password) {
    const user = await this.findOne({ username: username });
    if (!user) {
        return false;
    } else {
        const isMatch = await bcrypt.compare(password, user.password);
        return isMatch;
    }
};

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

UserSchema.plugin(uniqueValidator);
const User = mongoose.model('User', UserSchema);

module.exports = User;
