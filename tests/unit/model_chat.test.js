/* eslint-disable no-undef */
process.env.TEST_DB = 'test_chat';
const Chat = require('../../database/model/Chat');

describe('Chat DB Test', async () => {
    const oneMessage = {
        time: new Date(),
        from: 'user1',
        to: 'user2',
        type: '0',
        content: 'For Chat Test',
        status: 'ok',
        read: false,
        chatId: -1
    };
    const newMessage = {
        time: new Date(),
        from: 'user2',
        to: 'user1',
        type: '0',
        content: 'For Chat Test, New Message',
        status: 'ok',
        read: false,
        chatId: -1
    };
    const oneChat = {
        type: 'private',
        from: 'user1',
        to: 'user2',
        latestMessage: oneMessage
    };
    test('test add chat', async () => {
        const resultObj = (await Chat.insertOne(oneChat)).res;
        console.log('ChatId: ', resultObj && resultObj.chatId);
        const chatId = resultObj.chatId;
        expect(resultObj).toEqual(expect.objectContaining(oneChat));
        const updateResult = (await Chat.updateLatestMessage(chatId, newMessage)).res;
        expect(updateResult.latestMessage).toEqual(expect.objectContaining(newMessage));
    });

    const userName = 'testUser';
    const chatList = [];
    for (let i = 0; i < 5; i++) {
        chatList.push({
            type: 'private',
            from: userName,
            to: `user${i}`,
            latestMessage: oneMessage
        });
        await Chat.insertOne(chatList[i]);
    }
    test('test related chat', async () => {
        const related = (await Chat.related(userName)).res;
        expect(related.length).toEqual(chatList.length);
    });
});
