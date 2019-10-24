const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const http = require("http").createServer(app);
const port = process.env.PORT || 80;
const bodyParser = require("body-parser");
const validate = require("./lib/server-validation");
const User = require("../database/model/User");
const Message = require("../database/model/Message");
const Chat = require("../database/model/Chat");
const io = require("socket.io")(http);
const jwt = require("jsonwebtoken");
const config = require("./auth/config");
const randomColor = require("randomcolor");
const cookieParser = require("cookie-parser");
const parseCookies = require("./lib/parseCookies");
const { checkToken } = require("./auth/checkToken");
require("../database/connectdb");

io.set("origins", "*:*");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({
    credentials : true,
    origin :      true
}));
app.use(cookieParser());
app.use(checkToken);

// Serve static front-end files, for future use
app.use("/app", express.static(path.resolve(__dirname, "../dist")));

io.use((socket, next) => {
    const token = parseCookies(socket.request.headers.cookie).token;
    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) {
            socket.emit("AUTH_FAILED", {});
        } else {
            socket.handshake.username = decoded.username;
        }
    });
    next();
});

function processMsg(msg) {
    return {
        time :    new Date(),
        from :    msg.from,
        to :      msg.to,
        type :    msg.type,
        content : msg.content,
        status :  msg.status,
        chatId :  msg.chatId
    };
}

io.on("connection", async (socket) => {
    await User.updateOnline(socket.handshake.username, true);
    await User.updateSocketId(socket.handshake.username, socket.id);
    io.emit("UPDATE_DIRECTORY", { data: "A User Online" });
    socket.on("MESSAGE", async (msg) => {
        msg = processMsg(msg);
        if(msg.to !== "public") {
            const fromSocketId = socket.id;
            const toSocketId = (await User.getOneUserByUsername(msg.to)).res[0].socketID;
            let ChatInsert;
            if(!msg.chatId) {
                ChatInsert = await Chat.insertOne({
                    type :          "private",
                    from :          msg.from,
                    to :            msg.to,
                    latestMessage : msg
                });
            } else {
                ChatInsert = await Chat.updateLatestMessage(msg.chatId, msg);
            }
            if(ChatInsert.success) {
                const result = JSON.parse(JSON.stringify(ChatInsert.res));
                result.otherUser = msg.to;
                io.to(fromSocketId).emit("UPDATE_CHATS", result);
                result.otherUser = msg.from;
                io.to(toSocketId).emit("UPDATE_CHATS", result);
            }

            const MessageInsert = await Message.insertOne(msg);
            if(MessageInsert.success) {
                io.to(fromSocketId).emit("UPDATE_MESSAGE", MessageInsert.res);
                io.to(toSocketId).emit("UPDATE_MESSAGE", MessageInsert.res);
            }
        } else {
            io.emit("UPDATE_CHATS", {
                chatId :        -1,
                from :          msg.from,
                latestMessage : msg,
                otherUser :     "public",
                to :            "public",
                type :          "public"
            });
            const MessageInsert = await Message.insertOne(msg);
            io.emit("UPDATE_MESSAGE", MessageInsert.res);
        }
    });
    socket.on("disconnect", async () => {
        await User.updateOnline(socket.handshake.username, false);
        io.emit("UPDATE_DIRECTORY", { data: "A User Offline" });
    });
});

app.get("/heartbeat", async (req, res, next) => {
    console.log("Hello ESN!");
    res.status(200).json({
        success : true,
        message : "Hello ESN!"
    });
});

app.post("/api/joinCheck", async (req, res, next) => {
    const userObj = {
        username : req.body.username,
        password : req.body.password
    };
    console.log(userObj);
    if(validate(userObj.username, userObj.password)) {
        console.log("Before DB");
        const exist = await User.exists(userObj.username);
        console.log(exist);
        if(!exist) {
            res.status(200).json({
                success :        false,
                message :        "User Not Exists",
                exists :         false,
                validationPass : null
            });
        } else {
            // login failed
            if(!await User.validateCredentials(userObj.username, userObj.password)) {
                res.status(200).json({
                    success :        false,
                    message :        "Enter the correct username and password",
                    exists :         null,
                    validationPass : false
                });
            } else {
                // login successfully
                const token = jwt.sign({ username: userObj.username }, config.secret, { expiresIn: "24h" });
                // await User.updateOnline(userObj.username, true);
                // io.emit('UPDATE_DIRECTORY', { data: 'A User Online' });
                res.status(200).json({
                    success :        true,
                    message :        "Validation Passed",
                    exists :         true,
                    validationPass : true,
                    token :          token
                });
            }
        }
    } else {
        res.status(200).json({
            success :        false,
            message :        "Validation Failed",
            exists :         null,
            validationPass : false
        });
    }
});

// register
app.post("/api/join", async (req, res, next) => {
    const avatar = randomColor({
        luminosity : "light"
    });
    const userObj = {
        username :         req.body.username,
        password :         req.body.password,
        avatar :           avatar,
        status :           "ok",
        statusUpdateTime : new Date(),
        online :           true
    };
    if(validate(userObj.username, userObj.password)) {
        const result = await User.addOneUser(userObj);
        if(result.success) {
            // await User.updateOnline(userObj.username, true);
            // io.emit('UPDATE_DIRECTORY', { data: 'A New User Created' });
            const token = jwt.sign({ username: req.body.username }, config.secret, { expiresIn: "24h" });
            res.status(200).json({
                success : true,
                message : "Register Success",
                token :   token
            });
        } else {
            res.status(200).json({
                success : false,
                message : result.res
            });
        }
    } else {
        res.status(200).json({
            success : false,
            message : "Validate Failed"
        });
    }
});

app.get("/api/users", async (req, res) => {
    try {
        const result = await User.find().sort({
            online :   -1,
            username : 1
        });
        const all = result.map((item) => ({
            username : item.username,
            avatar :   item.avatar || "#ccc",
            status :   item.status || "ok",
            online :   item.online || false
        }));
        res.status(200).json({
            success : true,
            message : "All Directory",
            users :   all
        });
    } catch (e) {
        res.status(200).json({
            success : false,
            message : e._message
        });
    }
});

app.get("/api/user/:username?", async (req, res) => {
    const username = (req.params && req.params.username) || req.username;
    const result = await User.getOneUserByUsername(username);
    const user = result.res[0];
    res.status(200).json({
        success : result.success,
        message : result.success ? "Get User info OK" : result.res,
        user :    {
            username : user.username || null,
            avatar :   user.avatar || "#ccc",
            online :   user.online || false,
            status :   user.status || "ok"
        }
    });
});

app.get("/api/historyMessage", async (req, res) => {
    const smallestMessageId = +(req.query && req.query.smallestMessageId);
    const pageSize = +(req.query && req.query.pageSize);
    const from = (req.query && req.query.from);
    const to = (req.query && req.query.to);
    const dbResult = await Message.history(from, to, +smallestMessageId, pageSize);
    if(dbResult.success) {
        res.status(200).json({
            success :  true,
            message :  "Get Messages",
            messages : dbResult.res
        });
    } else {
        res.status(200).json({
            success : false,
            message : "Load Messages Failed"
        });
    }
});

app.get("/api/chats", async (req, res) => {
    const latestPublicMessage = (await Message.latestPublic()).res;
    const publicResult = {
        chatId :        -1,
        from :          latestPublicMessage.from,
        latestMessage : latestPublicMessage[0],
        otherUser :     "public",
        to :            "public",
        type :          "public"
    };
    const username = (req.params && req.params.username) || req.username;
    const dbResult = await Chat.related(username);
    const chats = JSON.parse(JSON.stringify(dbResult.res)); // Mongoose Result can't be modified
    const chatsWithOtherUser = [];
    for(let i = 0; i < chats.length; i++) {
        if(chats[i].from !== username || chats[i].to !== username) {
            chats[i].otherUser = chats[i].from === username ? chats[i].to : chats[i].from;
            chatsWithOtherUser.push(chats[i]);
        }
    }
    res.status(200).json({
        success : true,
        message : "Get Chats",
        chats :   chatsWithOtherUser,
        public :  publicResult
    });
});

app.post("/api/mystatus", async (req, res, next) => {
    try {
        await User.updateStatus(req.body.username, req.body.status);
        io.emit("UPDATE_DIRECTORY", { data: "User Status Change" });
        res.status(200).json({
            success : true
        });
    } catch (e) {
        console.log(e);
    }
});

http.listen(port, () => {
    console.log(`Express server start, listening on port:${port} ...`);
});

module.exports = processMsg;
