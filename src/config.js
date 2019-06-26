

const config = {
//SIT
  microserviceUrl: 'https://readygo-dit.fwdtech.cn/readygoplan',
  wsServer: 'wss://s2.odainfra.com/connectors1/botconnector/ws',
    botName: 'AI_Trainer_Design',
    mapUrl: 'https://s2.odainfra.com/',

//UAT
//     microserviceUrl: 'https://readygo-uat.fwdtech.cn/readygoplan',
//     wsServer: 'wss://s2.odainfra.com/connectors2/botconnector/ws',
//     botName: 'AI_Trainer_UAT',
//     mapUrl: 'http://s2.odainfra.com/uat/',

  removeAskFeedback: true,
  hideHotQuestions: false,
    //global vars
  TpID: {},
  IsGetATPByTpIdOrSetTPByTptId: "set",
  TpDetail: [],
  TpChanged: "0",
    botMessage: {},
    matchID: "",
    matchAvator:"",
    matchUrl: ""
}


module.exports = config
