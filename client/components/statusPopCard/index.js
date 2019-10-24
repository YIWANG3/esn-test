import statusPopCard from './view.html';
import './style.less';

function mount() {
    const app = document.getElementById('app');
    const statusPopCardNode = document.createElement('div');
    statusPopCardNode.id = 'status-pop-card-node';
    statusPopCardNode.style.visibility = 'hidden';
    statusPopCardNode.innerHTML = statusPopCard;
    app.appendChild(statusPopCardNode);
}

function show() {
    document.getElementById('status-pop-card-node').style.visibility = 'visible';
}

function close() {
    document.getElementById('status-pop-card-node').style.visibility = 'hidden';
}

function setBlackCoverClose() {
    const blackCover = document.getElementById('black-cover');
    blackCover.addEventListener('click', close);
}

function init(statusCallBack) {
    mount();
    setBlackCoverClose();
    if (statusCallBack) {
        const divs = document.getElementsByName('share-status');
        Object.entries(divs).map((object) => {
            object[1].addEventListener('click', statusCallBack);
        });
    }
}

const StatusPopCard = {
    init,
    show,
    close
};

export default StatusPopCard;
