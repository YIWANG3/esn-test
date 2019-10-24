import dateFormat from "./dateFormat";

function processMessage(messages) {
    if(Object.prototype.toString.call(messages) === "[object Array]") {
        for(let i = 0; i < messages.length; i++) {
            messages[i].fromMe = messages[i].from === window.state.user.username;
            messages[i].time = dateFormat(messages[i].time, "mm/dd HH:MM");
            messages[i].status = (messages[i].status && messages[i].status.toLowerCase()) || "ok";
            messages[i].avatar = window.state.userMap[messages[i].from].avatar;
        }
        return messages;
    } else {
        messages.fromMe = messages.from === window.state.user.username;
        messages.time = dateFormat(messages.time, "mm/dd HH:MM");
        messages.status = (messages.status && messages.status.toLowerCase()) || "ok";
        messages.avatar = window.state.userMap[messages.from].avatar;
        return messages;
    }
}

export default processMessage;
