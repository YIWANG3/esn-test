const jwt = require('jsonwebtoken');
const config = require('./config.js');

function exclude(url) {
    console.log(url);
    const urlTable = {
        '/heartbeat': true,
        '/api/joinCheck': true,
        '/api/join': true,
        '/': true,
        '/app': true
    };
    if (urlTable[url]) {
        return true;
    }
    if (url.indexOf('app') >= 0) {
        return true;
    }
    return false;
}

function tokenParsing(token) {
    const parsedToken = {};
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            parsedToken.error = true;
        } else {
            parsedToken.error = false;
            parsedToken.decodedInfo = decoded;
        };
    });
    return parsedToken;
}

const checkToken = (req, res, next) => {
    if (exclude(req.originalUrl)) {
        next();
    } else {
        const token = (req.cookies && req.cookies.token) || (req.headers && req.headers.token);
        if (token) {
            const parsingResult = tokenParsing(token);
            if (parsingResult.error) {
                res.status(200).json({ success: false, message: 'Auth Failed', redirect: true });
            } else {
                req.username = parsingResult.decodedInfo.username;
                next();
            }
        } else {
            res.status(200).json({ success: false, message: 'No token recieved', redirect: true });
        }
    }
};

module.exports = { checkToken, tokenParsing, exclude } ;
