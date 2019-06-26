import Smooch from 'smooch'
import ko from 'knockout'
import format from 'date-fns/format'
import axios from 'axios'
import store from 'store'
import uuidv4 from 'uuid/v4'
import botTemplate from '../templates/bot.html'
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

            Smooch.sendMessage(self.question())
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

        self.appendQuestion = async function (question) {
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

        self.initSmooch = async function () {
            Smooch.on('ready', () => {
                self.botInitialized(true)
                console.log('Bot initialized')
                console.log(Smooch)
            });

            Smooch.on('message:received', message => {
                if (!self.botInitialized()) {
                    console.warn("Connection is not ready for communication yet!")
                    return
                }
                self.loading(false)
                console.log('Message received:', message)
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
                } else if (message.type === 'text') {

                    const pair = message.text.split('\n\n\n')
                    const answer = pair[pair.length - 1]
                    var comingMessage;
                    if (message.actions) {

                        if(message.text.startsWith("handson")){
                            comingMessage = {
                                type: 'text-mz',
                                timestamp: format(new Date(), 'HH:mm'),
                                body: answer,
                                actions: message.actions
                            }
                        }else{
                            comingMessage = {
                                type: 'text',
                                timestamp: format(new Date(), 'HH:mm'),
                                body: answer,
                                actions: message.actions
                            }
                        }

                        self.appendMessageNoWait(comingMessage)
                    } else {

                    console.log("no binding templates")
                    const pair = message.text.split('\n\n\n')
                    const answer = pair[pair.length - 1]
                    var comingMessage;
                    comingMessage = {
                        type: 'text',
                        timestamp: format(new Date(), 'HH:mm'),
                        body: answer
                    }
                    self.appendMessageNoWait(comingMessage)
                    syncScrollDown()

                    return
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
            });

            await Smooch.init({
                appId: config.botAppId,
                userId: self.userID
            });
        }





        self.initialize = async function () {
            if (store.get('userId')) {
                self.userId = store.get('userId')
            } else {
                self.userId = uuidv4()
                store.set('userId', self.userId)
            }

            self.initSmooch();

            // self.loading(true)
            //const checkPromise = axios.post(`${config.botGateway}/bot/blacklist/check`, { user_id: self.userId })
            // const settingPromise = axios.get(`${config.botGateway}/bot/settings`)
            // const topicPromise = axios.get(`${config.botGateway}/bot/trendingTopics`)
            // const categoryPromise = axios.get(`${config.botGateway}/bot/categories`)
            // const [settingResponse, topicResponse, categoryResponse] = await Promise.all([settingPromise, topicPromise, categoryPromise])
            // if (checkResponse.data === 'BLOCKED') {
            //   self.blocked(true)
            //   self.loading(false)
            //   await self.youAreBlocked()
            //   return
            // }
            // self.settings = settingResponse.data.payload

            // self.loading(false)

            // self.trendingMessage = {
            //   type: 'trending',
            //   timestamp: format(new Date(), 'HH:mm'),
            //   topics: topicResponse.data.payload,
            //   categories: categoryResponse.data.payload
            // }

            // self.messageList([{
            //     type: 'text',
            //     timestamp: format(now, 'HH:mm'),
            //     body: `${hello}，` + '我是智能客服小马，有什么我能够帮您的吗？'
            // }])
            // await self.sayHello()

            // await self.appendQuestion('hi')
            while (!self.botInitialized()) {
                console.log("Waiting to connection be ready...");
                await sleep(500);
            }

            self.userID = GetQueryString("userid");
            console.log("self.userID" + self.userID);

            // const conversation = Smooch.getConversation();
            //
            // console.log(conversation.messages);
            // console.log(Smooch.getUser());
            //
            // Smooch.updateUser({
            //     givenName: 'self.userID',
            //     surname: 'self.userID',
            //     email: 'steveb@channel5.com',
            //     signedUpAt: Date.now(),
            //     properties: {
            //         premiumUser: true,
            //         numberOfPurchases: 20,
            //         itemsInCart: 3,
            //         couponCode: 'PREM_USR'
            //     }
            // });

            await deferedScrollDown()
        }




        self.initialize()
    }
}


function GetQueryString(name)
{
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
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
