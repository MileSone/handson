import ko from 'knockout'
import format from 'date-fns/format'
import botTemplate from '../templates/bot.html'
import './sampleList.js'
import './mapHtml.js'
import './popUp.js'
import './tpDash.js'
import './trainningPlan.js'
import './textMz.js'
import config from '../config.js'
import VConsole from 'vconsole'

if (window.location.search.indexOf('debug=true') >= 0) {  window.vConsole = new VConsole();}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function scrollDown() {
    document.getElementById('content').scrollTo({
        top: document.getElementById('content').scrollHeight + 90,
        smooth: true
    })
}

function syncScrollDown() {
    setTimeout(scrollDown, 10)
}

async function deferedScrollDown() {
    await sleep(10)
    scrollDown()
}

function debug(msg) {
    console.log(msg);
};

class BotViewModel {
    constructor(params) {
        const self = this

        var isNotReconnect = true;
        var lastMess = ""
        // Do navigation
        self.root = params.root;

        self.hideContent= function(){
            self.root.hideContent();
        }
        self.goMap = function(){
            self.root.goMap();
        }

        self.goBot = function(){
            self.root.goBot();
        }

        self.goTp = function(){
            self.root.callAPI();
        }

        self.hideContent();

        const now = new Date()


        self.ifPoping = ko.observable(true);
        self.htmlSrc = ko.observable("http://104.218.164.101/index.html");
        self.placeholderText = ko.observable('正努力加载中...');


        self.removeAskFeedback = config.removeAskFeedback;
        self.hideHotQuestions = config.hideHotQuestions;
        self.loading = ko.observable(false)
        self.blocked = ko.observable(false)
        self.askedTimes = ko.observable(0)
        self.errorTimes = ko.observable(0)
        self.forcedToShowTransferButton = ko.observable(false)
        self.showTransferButton = ko.computed(() => {
            return false
        })

        self.showQueryCard = async function (_data, _event) {
            const queryMessage = {
                type: 'query-card',
                timestamp: format(now, 'HH:mm')
            }
            self.messageList.push(queryMessage)
            await deferedScrollDown()
        }

        self.question = ko.observable('')
        self.onEnterKey = (_data, event) => {
            if (event.keyCode === 13 && self.question()) {
                self.sendQuestion().then(function () {
                    // the only way we call an async function in sync codes
                })
                return false
            }
            return true
        }
        self.onSubmit = async function (_data, _event) {
            if (!self.question()) {
                return
            }
            await self.sendQuestion()
        }
        self.blockUser = async function () {

        }
        self.recordQuestion = async function (question) {
            self.askedTimes(self.askedTimes() + 1)

        }
        self.sendQuestion = async function () {
            await self.appendQuestion(self.question())

            self.loading(true)

            while (!self.botInitialized()) {
                console.log("Waiting for connection & initialization be ready...");
                await sleep(1000);
            }
            lastMess = self.question()
            self.sendMessage(self.question());
            console.log("*Question: ", self.question())

            await self.recordQuestion(self.question())

            self.question('')
        }

        self.messageList = ko.observableArray([])
        self.messages = ko.computed(() => {
            let timestampSet = new Set()
            let messages = self.messageList().map(message => {
                if (timestampSet.has(message.timestamp)) {
                    message.showAvatar = false
                } else if (message.type !== 'question') {
                    timestampSet.add(message.timestamp)
                    message.showAvatar = true
                } else {
                    message.showAvatar = false
                }
                return message
            })
            for (let i = 1; i < messages.length; i++) {
                const previousMessage = messages[i - 1]
                const currentMessage = messages[i]
                if (previousMessage.type === 'question' && currentMessage.type !== 'question') {
                    currentMessage.showAvatar = true
                }
            }

            return messages
        })

        botOps.appendQuestion = self.appendQuestion = async function (question) {
            const message = {
                type: 'question',
                timestamp: format(new Date(), 'HH:mm'),
                body: question
            }
            self.messageList.push(message)
            await deferedScrollDown()
        }

        self.appendMessage = async function (message) {
            self.loading(true)
            await sleep(300)
            self.loading(false)
            self.messageList.push(message)
            await deferedScrollDown()
        }

        self.appendMessageNoWait = (message) => {
            self.messageList.push(message)
            syncScrollDown()
        }

        self.loadTopics = async function (categoryId) {
        }


        self.sayHelloNoWait = () => {
        }

        self.sayHello = async function () {
            self.sayHelloNoWait()
            await deferedScrollDown()
        }

        self.youAreBlocked = async function () {
            const message = {
                type: 'text',
                timestamp: format(now, 'HH:mm'),
                body: '对不起，由于您近期请求次数异常，我暂时不能为您服务 :('
            }
            self.messageList.push(message)
            await deferedScrollDown()
        }

        self.botInitialized = ko.observable(false)
        self.wsParam = {
            "SO_SUFFIX": Math.ceil(Math.random() * 100000000),
            "MAX_RETRIES": 300,
            "retryTimes": 0,
            "SocketSessionExpire": 240,
            "LAST_ACTIVITY_TIME": Date.now() / 1000 | 0,
            "currentConnection": null,
            "ws": null,
            "isForceClosed": false,
            "initLck": false,
            "messageToBot": {
                "to": {
                    "type": "bot",
                    "id": config.botName
                }
            }
        }
        self.initWebSocket = async function () {
            if (self.wsParam["initLck"] === true) {
                console.log("Last connect is still in progress...");
                return;
            }
            debug("init websocket");
            self.wsParam["initLck"] = true;
            self.wsParam["currentConnection"] = config.wsServer + "?token="
                + self.token + "&v=" + self.wsParam["SO_SUFFIX"];
            debug("Init ws: " + self.wsParam["currentConnection"]);
            try {
                let ws = new WebSocket(self.wsParam["currentConnection"]);
                self.wsParam["ws"] = ws;
            } catch (err) {
                self.wsParam["ws"] = null;
                self.wsParam["initLck"] = false;
                console.error(err.name + ":: " + err.message);
                alert("Failed to connect to the server. " + err.name
                    + "::" + err.message + ", please try again!");
            }
            if (self.wsParam["ws"] === null) return;
            self.wsParam["isForceClosed"] = false;
            self.wsParam["ws"].onopen = function (evt) {
                self.botInitialized(true);
                self.wsParam["initLck"] = false;
                self.placeholderText('在这里提问...');
            }
            self.wsParam["ws"].onmessage = function (evt) {
                if (!self.botInitialized()) {
                    console.error("Initialization incompleted!", self.wsParam["currentConnection"]);
                    return
                }

                let resp = JSON.parse(evt.data);
                if (resp.error && resp.error.code === 103) {
                    // Got hb resp, ignore.
                    return;
                }

                let message = resp.body.messagePayload;
                self.token = encodeURIComponent(resp.from.token);
                console.log("Message received: ", message);
                isNotReconnect = true;
                self.loading(true);

                if (message.type === 'text' && message.text === '_SORRY_') {
                    if (self.errorTimes() === 0) {
                        self.appendMessageNoWait({
                            type: 'text',
                            timestamp: format(new Date(), 'HH:mm'),
                            body: '对不起，我暂时无法理解您的问题，能不能尝试换一种提问方式呢～'
                        })
                    } else {
                        self.appendMessageNoWait({
                            type: 'text',
                            timestamp: format(new Date(), 'HH:mm'),
                            body: '对不起，我暂时无法理解您的问题 :('
                        })
                    }
                    self.sayHelloNoWait()
                    self.errorTimes(self.errorTimes() + 1)
                } else if (message.type === 'text' && message.text.startsWith("@tpDash")) {


                    const pair = message.text.split('\n\n\n')
                    const answer = pair[pair.length - 1]
                    var comingMessage;
                    comingMessage = {
                        type: 'tp-dash',
                        timestamp: format(new Date(), 'HH:mm'),
                        body: answer,
                        actions: message.actions
                    }
                    self.appendMessageNoWait(comingMessage)
                } else if (message.type === 'text' && message.text.startsWith("@mapWin")) {
                    const pair = message.text.split('\n\n\n')
                    const answer = pair[pair.length - 1]

                    var comingMessage;
                    comingMessage = {
                        type: 'map-html',
                        timestamp: format(new Date(), 'HH:mm'),
                        body: answer,
                        actions: message.actions
                    }
                    self.appendMessageNoWait(comingMessage)
                } else if (message.type === 'text') {

                    const pair = message.text.split('\n\n\n')
                    const answer = pair[pair.length - 1]
                    var comingMessage;
                    if (message.actions) {

                        if(message.text.startsWith("免责声明")){
                            comingMessage = {
                                type: 'text-mz',
                                timestamp: format(new Date(), 'HH:mm'),
                                body: answer,
                                actions: message.actions
                            }
                        }else{
                            comingMessage = {
                                type: 'sample-list',
                                timestamp: format(new Date(), 'HH:mm'),
                                body: answer,
                                actions: message.actions
                            }
                        }

                        self.appendMessageNoWait(comingMessage)
                    } else {


                        if (message.text == "Your session has expired.  Please start again."){
                            isNotReconnect = false;
                            self.loading(true);
                            if (lastMess != ""){
                                self.sendMessage(lastMess);
                            } else{
                                self.sendMessage("hi");
                            }
                        }else {
                            comingMessage = {
                                type: 'text',
                                timestamp: format(new Date(), 'HH:mm'),
                                body: answer
                            }
                            self.appendMessageNoWait(comingMessage)
                        }
                    }
                } else if (message.type === 'card') {

                    const itemListMessage = {
                        type: 'item-list',
                        timestamp: format(new Date(), 'HH:mm'),
                        items: message.cards,
                        layout: message.layout,
                        actions: message.actions
                    }
                    self.appendMessageNoWait(itemListMessage)

                } else {
                    console.error('The message type is unsupported: ' + message.type);
                }


                console.log("onmessage...[end]");

                if (isNotReconnect){
                    self.loading(false);
                }

                syncScrollDown()
            }
            self.wsParam["ws"].onclose = function () {
                debug("Connection is closed...");
                self.dispose(true);
            }
            self.wsParam["ws"].onerror = function (error) {
                debug("Websocket goes to ERROR");
                self.dispose();
            }
        }

        self.initWebSocketIfNeeded = async function () {
            debug("init websocketIF");
            let connection = config.wsServer + "?token=" + self.token
                + "&v=" + self.wsParam["SO_SUFFIX"];
            if (connection !== self.wsParam["currentConnection"]) {
                await self.initWebSocket();
            }
        }

        botOps.sendMessage = self.sendMessage = async function (msgToSend, type) {
            var msgType = type || 'text';
            if (!msgToSend || /^\s*$/.test(msgToSend)) {
                console.warn("! Message to be sent is empty!");
                return;
            }
            if (msgType === 'text') {
                self.wsParam["messageToBot"].messagePayload = {
                    type: "text",
                    text: msgToSend
                };
            } else if (msgType === 'postback') {


                self.wsParam["messageToBot"].messagePayload = {
                    type: "postback",
                    postback: msgToSend
                };
            } else {
                console.error("Message type not supported yet: " + msgType);
                return;
            }

            if (!msgToSend.t || msgToSend.t !== 'hb') {
                self.loading(true);
            } else {
                self.loading(false);
            }

            await self.sendToBot(self.wsParam["messageToBot"]);
        };

        // send message to the bot
        self.sendToBot = async function (message) {
            debug("Sending message to bot", message);

            let timeSecs = Date.now() / 1000 | 0;
            if (timeSecs - self.wsParam["LAST_ACTIVITY_TIME"] >= self.wsParam["SocketSessionExpire"]) {
                debug("Socket session expired: " + self.wsParam["currentConnection"]);
                self.dispose();
            }

            let success = false;
            do {
                success = await self.waitForSocketConnection(async () => {
                    timeSecs = Date.now() / 1000 | 0;
                    self.wsParam["LAST_ACTIVITY_TIME"] = timeSecs;
                    self.wsParam["ws"].send(JSON.stringify(message));
                    // debug('Message sent: ' + JSON.stringify(message));
                });
                if(!success) {
                    await sleep(1000);
                }
            } while(!success);
        }

        self.waitForSocketConnection = async function (callback) {
            if (self.wsParam["isForceClosed"] === true) {
                debug("Previous WebSocket down. Reconnecting...");
                while (self.wsParam["ws"] === null) {
                    await self.initWebSocket();
                    if (self.wsParam["ws"] === null) {
                        await sleep(1000);
                        console.warn("Connection cannot be established, retrying...");
                    } else if(self.wsParam["ws"].readyState === 2 || self.wsParam["ws"].readyState === 3){
                        debug("WebSocket is closing or closed.");
                        // self.wsParam["ws"] = null;
                        self.dispose();
                    } else {
                        debug("WebSocket is reconnecting or reconnected.")
                    }
                }
            }

            let socket = self.wsParam["ws"];
            if(socket === null || typeof socket === 'undefined') {
                self.dispose(true);
                console.error("!!! This should never happend! Discard " +
                    "sending the message to bot!");
                return false;
            }

            while (socket.readyState === 0) { // Connecting
                let socket2 = self.wsParam["ws"];
                if(socket !== socket2) {
                    try{socket.close();}catch(err){}
                    return false;
                }
                debug("Waiting for connection open: " + self.wsParam["currentConnection"]);
                await sleep(1000);
            }
            if (socket.readyState === 1) { // Connected
                self.wsParam["retryTimes"] = 0;
                if (callback) {
                    callback();
                }
                return true;
            } else { // Closing or Closed
                self.wsParam["retryTimes"] = self.wsParam["retryTimes"] + 1;
                if (self.wsParam["retryTimes"] > self.wsParam["MAX_RETRIES"]) {
                    console.error("!!! Connection error, websocket is closing or closed! " +
                        "Discard sending the message to bot!!",self.wsParam["currentConnection"]);
                } 
                return false;
            }
        }

        self.dispose = function (closed) {
            let directRemove = closed || false;
            if(directRemove) {
                self.wsParam["ws"] = null;
            } else {
                debug("Close socket...");
            }
            if (self.wsParam["ws"]) {
                try {
                    self.wsParam["ws"].close();
                } catch (err) { }
                self.wsParam["ws"] = null;
            }
            self.loading(false);
            self.wsParam["isForceClosed"] = true;
            self.wsParam["retryTimes"] = 0;
            self.wsParam["SO_SUFFIX"] = Math.ceil(Math.random() * 100000000);
            self.botInitialized(false);
            self.wsParam["initLck"] = false;
        };

        self.initialize = async function () {
            self.token = encodeURIComponent(GetQueryString("token4ai"));
            // console.log("self.token" + self.token);
            self.initWebSocketIfNeeded();
            setInterval(() => {
                self.sendToBot({ "t": "hb" });
            }, 55000);
            self.sendMessage("hi");

        }

        self.initialize();

    }
}


function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return unescape(r[2]); return null;
}


ko.components.register('bot', {
    viewModel: BotViewModel,
    template: botTemplate
})

function addClass(elem, cls) {
    if (!hasClass(elem, cls)) {
        elem.className = elem.className == '' ? cls : elem.className + ' ' + cls;
    }
}

function removeClass(elem, cls) {
    if (hasClass(elem, cls)) {
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
        while (newClass.indexOf(' ' + cls + ' ') >= 0) {
            newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

function hasClass(elem, cls) {
    cls = cls || '';
    if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}




self.showContent = function () {
    // addClass(document.getElementById("content"), 'bannerOn');
    // removeClass(document.getElementById("banner_container"), 'hide_view');
}

const botOps = {
    sendMessage: null,
    appendQuestion: null
}
export default botOps;
