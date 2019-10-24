import View from './view.html';
import './style.less';

const hashToTabItem = {
    '#/chats': 'tab-item-chats',
    '#/directory': 'tab-item-directory',
    '#/me': 'tab-item-me',
    '#/announcement': 'tab-item-announcement'
};

const tabItemToHash = {
    'tab-item-chats': '#/chats',
    'tab-item-directory': '#/directory',
    'tab-item-me': '#/me',
    'tab-item-announcement': '#/announcement'
};

function initBottomTab() {
    mountNode();
    updateBottomTab();
    window.addEventListener('hashchange', updateBottomTab);
    addNavigationListener();
}

function mountNode() {
    const body = document.body;
    const mountDom = document.createElement('div');
    mountDom.id = 'bottom-tab-node';
    mountDom.style.visibility = 'hidden';
    mountDom.innerHTML = View;
    body.appendChild(mountDom);
}

function updateBottomTab() {
    const mountDom = document.getElementById('bottom-tab-node');
    if (hashToTabItem[window.location.hash]) {
        mountDom.style.visibility = 'visible';
        for (const domId of Object.keys(tabItemToHash)) {
            document.getElementById(domId).classList.remove('current');
        }
        document.getElementById(hashToTabItem[window.location.hash]).classList.add('current');
    } else {
        mountDom.style.visibility = 'hidden';
    }
}

function hideBottomTab() {
    const bottomTabDom = document.getElementById('bottom-tab');
    bottomTabDom.style.visibility = 'hidden';
}

function showBottomTab() {
    const bottomTabDom = document.getElementById('bottom-tab');
    bottomTabDom.style.visibility = 'visible';
}

function addNavigationListener() {
    for (const item of Object.entries(tabItemToHash)) {
        document.getElementById(item[0]).addEventListener('click', () => {
            window.location.hash = item[1];
        });
    }
}

const BottomTab = {
    hideBottomTab,
    showBottomTab,
    initBottomTab
};

export default BottomTab;
