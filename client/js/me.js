import axios from 'axios';
import socket from './socket/config';
import { API_PREFIX, SERVER_ADDRESS } from './constant/serverInfo';
import Cookie from 'js-cookie';
import '../style/me.less';
import Me from '../view/me.html';
import StatusPopCard from '../components/statusPopCard';
import Utils from './lib/appUtils';
import directory from './directory';

function logout() {
    Cookie.remove('token');
    window.state = {};
    socket.close();
    window.location.hash = '/';
}

async function fetchData() {
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/user/`);
    if (res.status === 200 && res.data.success && res.data.user) {
        window.state.user = res.data.user;
    }
}

async function render() {
    const app = document.getElementById('app');
    app.innerHTML = Me;
    if (!window.state.user) {
        await fetchData();
    }
    if (window.state.user) {
        const user = window.state.user;
        if (user.avatar.indexOf('#') === 0) {
            document.getElementById('page-me-avatar').style.backgroundColor = user.avatar;
            document.getElementById('page-me-avatar').innerText = user.username[0];
        }
        document.getElementById('page-me-username').innerText = user.username;
        document.getElementById('page-me-status').innerText = user.status;
        Utils.renderStatusColor(user.status, document.getElementById('page-me-status'));
        document.getElementById('logout-menu').addEventListener('click', logout);
        document.getElementById('user-status').addEventListener('click', renderStatusPopCard);
        document.getElementById('user-guide-entrance').addEventListener('click', function () {
            window.location.hash = '/guide';
        });
    }
}

async function renderStatusPopCard() {
    StatusPopCard.init(updateStatus);
    StatusPopCard.show();
}

async function updateStatus(event) {
    const statusElement = event.currentTarget.children;
    if (statusElement && statusElement[0].id) {
        const userStatus = document.getElementById(statusElement[0].id).innerHTML;
        if (userStatus) {
            window.state.user.status = userStatus;
            axios.post(`${SERVER_ADDRESS}${API_PREFIX}/mystatus/`, {
                username: window.state.user.username,
                status: userStatus
            }).then(async (res) => {
                if (res && res.status === 200) {
                    await directory.fetchData();
                    await render();
                } else {
                    console.log('Response Invalid!');
                }
            }).catch((err) => {
                console.log(err);
            });
        }
    }
    StatusPopCard.close();
}

const me = {
    fetchData,
    render
};

export default me;
