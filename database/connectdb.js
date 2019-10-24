const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useUnifiedTopology", true);
let url = "mongodb://127.0.0.1/SB2ESN";
if(process.env.SERVER_TEST_DB) {
    url = `mongodb+srv://f19sb2test:f19sb2test1234@cluster0-hfvai.mongodb.net/${process.env.SERVER_TEST_DB}?retryWrites=true&w=majority`;
}

if(process.env.MONGODB_URI) {
    url = process.env.MONGODB_URI;
}

console.log(url);
mongoose.connect(url, {
    useNewUrlParser :    true,
    useUnifiedTopology : true
});
mongoose.connection.on("connected", () => {
    console.log("Mongoose connection open to " + url);
});

mongoose.connection.on("error", (err) => {
    console.log("Mongoose connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
    console.log("Mongoose connection disconnected");
});

module.exports = mongoose;
