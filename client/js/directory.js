import axios from "axios";
import { SERVER_ADDRESS, API_PREFIX } from "./constant/serverInfo";
import "../style/directory.less";
import Directory from "../view/directory.html";
import Utils from "./lib/appUtils";

async function fetchData() {
    const res = await axios.get(`${SERVER_ADDRESS}${API_PREFIX}/users`);
    if(res.status === 200 && res.data.success && res.data.users) {
        const users = res.data.users;
        window.state.users = users;
        const userMap = {};
        for(let i = 0; i < users.length; i++) {
            userMap[users[i].username] = users[i];
        }
        window.state.userMap = userMap;
    }
}

async function render() {
    const app = document.getElementById("app");
    app.innerHTML = Directory;
    const directory = document.getElementById("user-directory");
    if(!window.state.users) {
        await fetchData();
    }
    if(window.state.users && directory) {
        directory.innerHTML = "";
        const users = window.state.users;
        users.forEach((user, index) => {
            const userCard = document.createElement("div");
            const userName = document.createElement("div");
            const userAvatar = document.createElement("div");
            const userStatus = document.createElement("div");
            const bottomThinLine = document.createElement("div");
            userCard.className = "single-user common-list-item";
            userCard.addEventListener("click", () => {
                window.location.hash = "/chat/" + user.username;
            });
            userName.className = "username";
            userAvatar.className = "avatar";
            userStatus.className = "status-circle";
            bottomThinLine.className = "right-thin-line";
            userName.innerText = user.username;
            userAvatar.innerText = user.username.charAt(0);
            userAvatar.setAttribute("style", `background-color: ${user.avatar || "#CCC"};`);
            Utils.renderStatusColor(user.status, userStatus);
            userCard.appendChild(userAvatar);
            userCard.appendChild(userStatus);
            userCard.appendChild(userName);
            if(!user.online) {
                userCard.classList.add("offline");
            }
            if(index !== users.length - 1) {
                directory.appendChild(userCard);
                directory.appendChild(bottomThinLine);
            } else {
                directory.appendChild(userCard);
            }
        });
    }
}

const directory = {
    fetchData,
    render
};

export default directory;
