/* eslint-disable no-undef */
process.env.TEST_DB = 'test_user';
const User = require('../../database/model/User');

describe('User DB Test', async () => {
    const TEST_USERNAME = 'test';
    const TEST_PASSWORD = '1234';
    test('test add user', async () => {
        const userObject = {
            username: TEST_USERNAME,
            password: TEST_PASSWORD,
            avatar: '#ffffff',
            status: 'ok',
            statusUpdateTime: new Date(),
            online: true
        };
        const addResult = await User.addOneUser(userObject);
        expect(addResult.success).toEqual(true);
        expect(addResult.res.username).toEqual(TEST_USERNAME);
        expect(await User.exists(TEST_USERNAME)).toEqual(true);
        expect(await User.exists('not-exist-user')).toEqual(false);
        const addResult2 = await User.addOneUser(userObject);
        expect(addResult2.success).toEqual(false);
        expect(addResult2.res).toEqual('Username already exist');
    });
    test('test update attribute', async () => {
        await User.updateStatus(TEST_USERNAME, 'help');
        let updated = await User.getOneUserByUsername(TEST_USERNAME);
        expect(updated.res[0].status).toEqual('help');
        await User.updateOnline(TEST_USERNAME, true);
        updated = await User.getOneUserByUsername(TEST_USERNAME);
        expect(updated.res[0].online).toEqual(true);
    });
});
