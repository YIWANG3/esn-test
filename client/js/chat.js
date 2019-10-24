import socket from './socket/config';
import axios from 'axios';
import { SERVER_ADDRESS, API_PREFIX } from './constant/serverInfo';
import processMessage from './lib/processMessage';
import lodash from 'lodash';
import '../style/chat.less';
import Chat from '../view/chat.html';

const pageSize = 20;

async function getHistoryMessage() {
    window.state.isLoading = true;
    console.log(window.state.user.username);
    console.log(window.location.href.split('/').pop());
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/historyMessage`, {
        params: {
            smallestMessageId: window.state.smallestMessageId,
            pageSize: pageSize,
            from: window.state.user.username,
            to: window.location.href.split('/').pop()
        }
    });
    window.state.isLoading = false;
    return processMessage(res.data.messages);
}

function createAvatar(msg) {
    const avatar = document.createElement('div');
    avatar.className = 'bubble-avatar';
    avatar.innerText = msg.from[0];
    avatar.style.backgroundColor = msg.avatar;
    const statusDot = document.createElement('div');
    statusDot.className = `bubble-status-dot ${msg.status}`;
    const avatarContainer = document.createElement('div');
    avatarContainer.className = 'avatar-container';
    avatarContainer.appendChild(avatar);
    avatarContainer.appendChild(statusDot);
    return avatarContainer;
}

function createMessageContainer(msg) {
    const message = document.createElement('div');
    message.className = `bubble-message ${msg.status}`;
    const nameTimeContainer = document.createElement('div');
    nameTimeContainer.className = 'bubble-name-time';
    const name = document.createElement('div');
    name.className = 'name';
    name.innerText = msg.from;
    const time = document.createElement('div');
    time.className = 'time';
    time.innerText = msg.time;
    nameTimeContainer.appendChild(name);
    nameTimeContainer.appendChild(time);
    const content = document.createElement('div');
    content.className = 'content';
    content.innerText = msg.content;
    message.appendChild(nameTimeContainer);
    message.appendChild(content);
    return message;
}

function createSingleBubble(msg) {
    const singleBubble = document.createElement('div');
    singleBubble.className = 'single-bubble';
    singleBubble.id = `message-${msg.id}`;
    if (msg.fromMe) {
        singleBubble.classList.add('from-me');
    }
    const avatarContainer = createAvatar(msg);
    const messageContainer = createMessageContainer(msg);
    singleBubble.appendChild(avatarContainer);
    singleBubble.appendChild(messageContainer);
    return singleBubble;
}

function sendMessage() {
    const content = document.getElementById('message-input').value;
    if (content && content.length > 0) {
        const toUser = window.location.href.split('/').pop();
        const chatId = (window.state.chatsMap[toUser] && window.state.chatsMap[toUser].chatId) || (toUser === 'public' ? -1 : null);
        socket.emit('MESSAGE', {
            content: content,
            type: 0,
            from: window.state.user.username,
            to: toUser,
            status: (window.state && window.state.user && window.state.user.status) || 'ok',
            chatId: chatId
        });
        document.getElementById('message-input').value = '';
    }
}

function renderOneMessage(msg) {
    const bubbleWrap = document.getElementById('bubble-wrap');
    const blankBubble = document.getElementById('blank-bubble');
    bubbleWrap.insertBefore(createSingleBubble(msg), blankBubble);
    if (msg.from === window.state.user.username && !window.state.bubbleIsBottom) {
        scrollToBottom();
    }

    if (window.state.bubbleIsBottom) {
        scrollToBottom();
    }

    if (!window.state.bubbleIsBottom) {
        window.state.showMessageTip = true;
    }
    if (window.state.showMessageTip) {
        setMessageTipVisible(true);
    } else {
        setMessageTipVisible(false);
    }
}

function setMessageTipVisible(visible) {
    document.getElementById('new-message-tip').style.visibility = (visible ? 'visible' : 'hidden');
}

function renderMessages(msgList) {
    const bubbleWrap = document.getElementById('bubble-wrap');
    const smallestMessageId = window.state.smallestMessageId || Infinity;
    let beforeNode;
    if (window.state.smallestMessageId === Infinity) {
        beforeNode = document.getElementById('blank-bubble');
    } else {
        beforeNode = document.getElementById(`message-${smallestMessageId}`);
    }
    for (let i = 0; i < msgList.length; i++) {
        bubbleWrap.insertBefore(createSingleBubble(msgList[i]), beforeNode);
    }
    window.state.smallestMessageId = (msgList[0] && msgList[0].id) || 0;
}

function handleScroll() {
    return lodash.debounce(async function () {
        const container = document.getElementById('bubble-wrap');
        const scrollTop = container.scrollTop;
        // console.log(container.scrollTop, container.clientHeight, container.scrollHeight);
        if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
            window.state.bubbleIsBottom = true;
            window.state.showMessageTip = false;
            setMessageTipVisible(false);
        } else {
            window.state.bubbleIsBottom = false;
        }
        if (scrollTop === 0 && !window.state.isLoading) {
            renderMessages(await getHistoryMessage());
        }
    }, 100);
}

function scrollToBottom() {
    const container = document.getElementById('bubble-wrap');
    container.scrollTop = container.scrollHeight;
}

async function render() {
    const app = document.getElementById('app');
    app.innerHTML = Chat;
    window.state.smallestMessageId = Infinity;
    window.state.isLoading = false;
    window.state.bubbleIsBottom = true;
    window.state.showMessageTip = false;
    document.getElementById('single-chat-navbar-title').innerText = window.location.href.split('/').pop();
    document.getElementById('navbar-back-arrow').addEventListener('click', function () {
        window.history.go(-1);
    });
    renderMessages(await getHistoryMessage());
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    document.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    document.getElementById('bubble-wrap').addEventListener('scroll', handleScroll());
    document.getElementById('new-message-tip').addEventListener('click', scrollToBottom);
    scrollToBottom();
}

const chat = {
    render,
    getHistoryMessage,
    renderOneMessage
};

export default chat;
