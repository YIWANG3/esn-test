import io from 'socket.io-client';
import chat from '../chat';
import processMessage from '../lib/processMessage';
import directory from '../directory';
import chats from '../chats';
import { SERVER_ADDRESS } from '../constant/serverInfo';
import Toast from '../lib/toast';

const socket = io(SERVER_ADDRESS);

socket.on('UPDATE_MESSAGE', function (msg) {
    const user = window.location.href.split('/').pop();
    if (user === msg.from || user === msg.to) {
        chat.renderOneMessage(processMessage(msg));
    } else {
        if (msg.to === 'public') {
            msg.from = '(Public Board) ' + msg.from;
        }
        const newMessage = msg.from + ':\r\n' + msg.content;
        Toast(newMessage, null, null, 5000);
    }
});

socket.on('AUTH_FAILED', function () {
    if (window.location.hash !== '#/') {
        console.log('Socket Auth Failed, Redirect');
        window.location.hash = '/join';
    }
});

socket.on('UPDATE_DIRECTORY', async function () {
    await directory.fetchData();
    if (window.location.hash === '#/directory') {
        await directory.render();
    } else if (window.location.hash === '#/chats') {
        await chats.render();
    }
});

socket.on('UPDATE_CHATS', async function (chat) {
    if (chat.to !== 'public') {
        if (!window.state.chatsMap[chat.otherUser]) {
            window.state.chats.push(chat);
            window.state.chatsMap[chat.otherUser] = chat;
        } else {
            window.state.chatsMap[chat.otherUser].latestMessage = chat.latestMessage;
        }
        chats.sortChats();
    } else {
        window.state.latestPublic = chat;
    }
    if (window.location.hash === '#/chats') {
        await chats.render();
    }
});

export default socket;
