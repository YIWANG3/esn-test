import './style/index.less';
import './style/welcome.less';
import './style/home.less';
import './style/announcement.less';

import Navigo from 'navigo';
import Welcome from './view/welcome.html';
import Home from './view/home.html';
import Error from './view/error.html';
import Announcement from './view/announcement.html';

import guide from './js/guide';
import chats from './js/chats';
import chat from './js/chat';
import me from './js/me';
import directory from './js/directory';

import initRouter from './js/initRouter';
import initJoinPage from './js/join';
import BottomTab from './components/bottomTab';

import axios from 'axios';
import Cookie from 'js-cookie';

axios.defaults.withCredentials = true;
axios.interceptors.request.use(function (config) {
    if (!Cookie.get('token') && window.location.hash !== '#/') {
        console.log('Request Auth Failed, Redirect');
        window.location.hash = '/join';
    }
    config.headers.token = Cookie.get('token');
    return config;
});

axios.interceptors.response.use(function (response) {
    if (response.data && !response.data.success && response.data.redirect && window.location.hash !== '#/') {
        console.log('Response Auth Failed, Redirect');
        window.location.hash = '/join';
        return response;
    } else {
        return response;
    }
});

const app = document.getElementById('app');
const router = new Navigo(null, true, '#');
window.state = {};
initRouter();
BottomTab.initBottomTab();

router.hooks({
    before: async function (done, params) {
        if (!(window.location.hash === '#/' || window.location.hash === '#/join')) {
            if (!(window.state && window.state.user) && Cookie.get('token')) {
                console.log('Load My info');
                await me.fetchData();
            }
            if (!(window.state && window.state.users)) {
                console.log('Load Directory');
                await directory.fetchData();
            }
            if (!(window.state && window.state.chats)) {
                console.log('Load Chats');
                await chats.fetchData();
            }
        }
        done();
    }
});

router.on('/', function () {
    app.innerHTML = Home;
}).resolve();

router.on('/join', function () {
    initJoinPage();
}).resolve();

router.on('/welcome', function () {
    app.innerHTML = Welcome;
}).resolve();

router.on('/directory', async function () {
    await directory.render();
}).resolve();

router.on('/announcement', function () {
    app.innerHTML = Announcement;
});

router.on('/guide', function () {
    app.innerHTML = Welcome;
    guide.render();
});

router.on('/chats', async function () {
    console.log('Re render');
    await chats.render();
}).resolve();

router.on('/me', async function () {
    await me.render();
}).resolve();

router.on('/chat/:id', async function () {
    console.log(window.location.hash);
    await chat.render();
}).resolve();

router.notFound(function () {
    app.innerHTML = Error;
}).resolve();
