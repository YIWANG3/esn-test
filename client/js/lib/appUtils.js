function renderStatusColor(userStatus, statusElement) {
    if (userStatus) {
        switch (userStatus.toLowerCase()) {
        case 'ok':
            statusElement.setAttribute('style', 'background-color: #7ED321');
            break;
        case 'emergency':
            statusElement.setAttribute('style', 'background-color: #F41C3B');
            break;
        case 'help':
        case 'need help':
            statusElement.setAttribute('style', 'background-color: #FFCC00');
            break;
        case 'no status':
            statusElement.setAttribute('style', 'background-color: #999');
            break;
        default:
            statusElement.setAttribute('style', 'background-color: #7ED321');
        }
    }
}

const Utils = {
    renderStatusColor
};

export default Utils;
