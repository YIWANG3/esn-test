function createNavHeader(title) {
    const header = document.createElement("div");
    header.className = "navbar-header";
    const backArrow = document.createElement("div");
    backArrow.className = "navbar-back-arrow";
    const navTitle = document.createElement("div");
    navTitle.className = "navbar-title";
    navTitle.innerText = title || "";
    header.appendChild(backArrow);
    header.appendChild(navTitle);
    return header;
}

function render() {
    const understandBtn = document.getElementById("understand-btn");
    understandBtn.parentElement.removeChild(understandBtn);
    const welcomeTitle = document.getElementById("welcome-title");
    welcomeTitle.innerText = "Get start with ESN now!";
    const navHeader = createNavHeader("User Guide");
    document.getElementById("page-welcome").insertBefore(navHeader, welcomeTitle);
    navHeader.addEventListener("click", () => {
        window.history.go(-1);
    });
}

const guide = {
    render
};

export default guide;
