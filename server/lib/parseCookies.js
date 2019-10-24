function parseCookies(cookieStr) {
    const list = {};
    cookieStr && cookieStr.split(';').forEach(function (cookie) {
        const parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    return list;
}

module.exports = parseCookies;
