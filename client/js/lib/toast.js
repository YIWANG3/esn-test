export default function toast(text, bgColor = "#1983FF", color = "#fff", delay = 1000) {
    const node = document.createElement("div");
    node.setAttribute("class", "toast");
    node.innerHTML = text;
    if(bgColor) {
        node.style.backgroundColor = bgColor;
    }
    if(color) {
        node.style.color = color;
    }
    document.body.appendChild(node);
    setTimeout(() => {
        document.body.removeChild(node);
    }, delay);
}
