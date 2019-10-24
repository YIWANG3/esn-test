import '../style/chats.less';
import Chats from '../view/chats.html';
import axios from 'axios';
import { API_PREFIX, SERVER_ADDRESS } from './constant/serverInfo';
import dateFormat from './lib/dateFormat';
import Utils from './lib/appUtils';

function sortChats() {
    function compare(chatA, chatB) {
        return (new Date(chatB.latestMessage.time)) - (new Date(chatA.latestMessage.time));
    }

    window.state.chats.sort(compare);
}

async function fetchData() {
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/chats`);
    if (res.status === 200 && res.data.success && res.data.chats) {
        window.state.chats = res.data.chats;
        const chats = window.state.chats;
        const chatsMap = {};
        for (const chat of chats) {
            chatsMap[chat.otherUser] = chat;
        }
        window.state.chatsMap = chatsMap;
        sortChats();
    }
    if (res.status === 200 && res.data.success && res.data.public) {
        window.state.latestPublic = res.data.public;
    }
}

async function render() {
    const app = document.getElementById('app');
    app.innerHTML = Chats;
    const allChats = document.getElementById('all-chats');
    if (!window.state.chats) {
        await fetchData();
    }
    if (window.state.chats && allChats) {
        document.getElementById('public-chat-entrance').addEventListener('click', function () {
            window.location.hash = '/chat/public';
        });
        const latestPublicMessage = window.state.latestPublic && window.state.latestPublic.latestMessage;
        if (latestPublicMessage) {
            document.getElementById('latest-public-message-content').innerText = latestPublicMessage.content;
            document.getElementById('latest-public-message-time').innerText = dateFormat(latestPublicMessage.time, 'mm/dd HH:MM');
        }
        allChats.innerHTML = '';
        const chats = window.state.chats;
        chats.forEach((chat, index) => {
            const otherUser = window.state.userMap[chat.otherUser];
            const chatListItem = document.createElement('div');
            const userName = document.createElement('div');
            const userAvatar = document.createElement('div');
            const userStatus = document.createElement('div');
            const latestMessage = document.createElement('div');
            const latestMessageContent = document.createElement('div');
            const latestMessageTime = document.createElement('div');
            const chatInfo = document.createElement('div');
            const bottomThinLine = document.createElement('div');
            chatListItem.className = 'single-chat common-list-item';
            chatListItem.id = 'chat-' + chat.otherUser;
            chatListItem.addEventListener('click', function () {
                window.location.hash = '/chat/' + chat.otherUser;
            });
            chatInfo.className = 'chat-info';
            userName.className = 'username';
            userAvatar.className = 'avatar';
            userStatus.className = 'status-circle';
            Utils.renderStatusColor(otherUser.status, userStatus);
            bottomThinLine.className = 'right-thin-line';
            latestMessage.className = 'latest-message';
            latestMessageContent.className = 'latest-message-content';
            latestMessageTime.className = 'latest-message-time';
            userName.innerText = otherUser.username;
            userAvatar.innerText = otherUser.username.charAt(0);
            latestMessageContent.innerText = chat.latestMessage.content;
            latestMessageTime.innerText = dateFormat(chat.latestMessage.time, 'mm/dd HH:MM');
            userAvatar.setAttribute('style', `background-color: ${otherUser.avatar || '#CCC'};`);
            chatListItem.appendChild(userAvatar);
            chatListItem.appendChild(userStatus);
            chatInfo.appendChild(userName);
            latestMessage.appendChild(latestMessageContent);
            latestMessage.appendChild(latestMessageTime);
            chatInfo.appendChild(latestMessage);
            chatListItem.appendChild(chatInfo);
            if (!otherUser.online) {
                chatListItem.classList.add('offline');
            }
            if (index !== chats.length - 1) {
                allChats.appendChild(chatListItem);
                allChats.appendChild(bottomThinLine);
            } else {
                allChats.appendChild(chatListItem);
            }
        });
    }
}

const chats = {
    render,
    fetchData,
    sortChats
};

export default chats;
