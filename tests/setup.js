/* eslint-disable no-undef */
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
require('../database/model/User');
require('../database/model/Message');
require('../database/model/Chat');

beforeAll(async () => {
    if (process.env.TEST_DB) {
        console.log(`Connect to ${process.env.TEST_DB}`);
        const DB_URL = `mongodb+srv://f19sb2test:f19sb2test1234@cluster0-hfvai.mongodb.net/${process.env.TEST_DB}?retryWrites=true&w=majority`;
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await Promise.all(
            Object.keys(mongoose.connection.collections).map(async key => {
                if (key !== 'counters') {
                    return mongoose.connection.collections[key].remove({});
                }
            })
        );
    }
});

afterAll(async () => {
    if (process.env.TEST_DB) {
        await mongoose.disconnect();
    }
});
