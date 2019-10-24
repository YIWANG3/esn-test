/* eslint-disable no-undef */

process.env.SERVER_TEST_DB = 'server_test';

const API_PREFIX = '/api';
let SERVER_ADDRESS = '';
if (!process.env.PORT) {
    process.env.PORT = 8000;
    SERVER_ADDRESS = 'http://localhost:8000';
}

require('../../server/index');
const axios = require('axios');

describe('Server Test', async () => {
    test('Heartbeat', async () => {
        const url = `${SERVER_ADDRESS}/heartbeat`;
        const res = await axios({
            method: 'get',
            url: url
        });
        expect(res.data.success).toEqual(true);
    });

    test('Join Check', async () => {
        const url = `${SERVER_ADDRESS}${API_PREFIX}/joinCheck`;
        console.log(url);
        const res = await axios({
            method: 'post',
            url: url,
            data: {
                username: 'AUser',
                password: '1234'
            },
            withCredentials: true
        });
        console.log(res.data);
        expect(res.status).toEqual(200);
        expect(res.data.success).toEqual(false);
        expect(res.data.exists).toEqual(false);
    });
});
