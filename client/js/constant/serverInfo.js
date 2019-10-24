const localKeyWords = [
    "local",
    "0.0.0.0",
    "localhost",
    "127.0.0.1"
];

function getServerAddress() {
    const url = window.location.href;
    for(let i = 0; i < localKeyWords.length; i++) {
        if(url.includes(localKeyWords[i])) {
            return "http://localhost";
        }
    }
    return "";
}

export const SERVER_ADDRESS = getServerAddress();
// Replace the ip with your own pc ip, and then run it on your mobile phone!
export const API_PREFIX = "/api";
