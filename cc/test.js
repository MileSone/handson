'use strict';

// var RESTClient = require('node-rest-client').Client;
// var isEmpty = require('./util/baseUtils').isEmpty;
// var restClient = new RESTClient();
// var getToken = require('./util/tokenUtils').tokenUtils;
// var config = require('./util/config');
// var data = require("./mock-json/loadUserContext.json");
// var tpOwnerId = 1;
// var hasActivePlan = 0;
// var isTrainingDoneToday = 0;
// // restClient.get('https://private-anon-0401514b0e-readygo.apiary-mock.com/activetp/' + tpOwnerId, function(data, apiResponse) {
// var hasActivePlan = 0;
// var activeTrainingPlan = {
// 	tpId: "",
// 	tpOwnerId: "",
// 	tpOwner: "",
// 	tpStatus: "",
// 	tpStart: "",
// 	tpEnd: "",
// 	tpTargetType: "",
// 	tpTargetMatchid: "",
// 	tptId: "",
// 	tptTile: "",
// 	tptType: "",
// 	tptDescrition: ""
// };

// var activeTrainingPlanWeeksList;

// var userid = 1;
// restClient.get('https://private-anon-84fa34e4dd-readygo.apiary-mock.com/tpstatus/1', function(data, apiResponse) {
// 	console.log('---------------getTodayTrainingDoneStatus----------------');
// 	console.log(data);
// 	if (!isEmpty(data) && data.status == "inCompleted") {
// 		isTrainingDoneToday = 1;
// 		console.log(1);
// 	}
// });
// var userMatchInfo = [];
// var hasUserMatchInfo = 0;
// var matchNamesJoinStr = "";
// var matchNameList = [];


// restClient.get('http://private-anon-84fa34e4dd-readygo.apiary-mock.com/allmatch/' + userid, function(data, apiResponse) {
// 	if (!isEmpty(data)) {
// 		hasUserMatchInfo = 1;
// 	}
// 	for (var i = 0; i < data.length; i++) {
// 		var matchItem = {
// 			id: "",
// 			name: ""
// 		};
// 		matchItem.id = data[0].matchId;
// 		matchItem.name = data[0].matchName;
// 		userMatchInfo.push(matchItem);
// 		matchNameList.push(data[0].matchName);
// 	}
// 	matchNamesJoinStr = matchNameList.join("和");
// 	console.log(hasUserMatchInfo);
// 	console.log(userMatchInfo);
// 	console.log(matchNamesJoinStr);

// });

function  timeStampDayString (Ctime) {
    var datetime = new Date();
    var datetime1 = new Date().getTime();
    var datetime2 = new Date();

    datetime.setTime(datetime1);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1;
    var date = datetime.getDate();

    datetime2.setTime(Ctime);
    var year2 = datetime2.getFullYear();
    var month2 = datetime2.getMonth() + 1;
    var date2 = datetime2.getDate();

    var checker = 0;
    if (year2 >= year) {
        if (month2 >= month) {
            if (date2 >= date) {
                checker = 1;
            }
        }
    }
    console.log(year2 + '年'+month2 +'月'+ date2);
    console.log(checker);
    return checker;
};

function timeStamp2String (time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() < 10 ? '0' + (datetime.getMonth() + 1) : (datetime.getMonth() + 1);
    var date = datetime.getDate() < 10 ? '0' + datetime.getDate() : datetime.getDate();
    return year + "-" + month + "-" + date;
};

//var startdate = "1560480900000";


var startdate = "Jul 16, 2019";

//var startdate = conversation.properties().startdate;

var nowTime = new Date().getTime()



// console.log(nowTime);
// nowTime = nowTime - 18000;
// console.log(nowTime);

    var status_adtp = "success";


if (typeof startdate == "string") {
    startdate = new Date(startdate).getTime();
}
var strdate2 = timeStamp2String(startdate);

var checker = timeStampDayString(startdate);
if(checker != 1){
    status_adtp = "failure";
    console.log(1);
}



//
// var date = new Date();
// // var timestamp = date.getTime();
//
// // console.log(timestamp);
// var hasRecommendPlan = 0;
// var recommendTrainingPlan = [];
// var birthday = "5";
// var gender = "1";
// var weight = "2";
// var height = "2";
// var target = "match";
// // var trainningLvl = "2";
// var trainningLvl = "trainningLvl";
//
// var timeStampArg = new Date().getTime();
// var query = `/tptemplates?tptCategory=${target}&birthday=${birthday}&gender=${gender}&weight=${weight}&height=${height}&trainningLvl=${trainningLvl}`;
// console.log(query);
//
// var startdate = "May 16, 2019";
// var strdate2;
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
// var args2 = {
// 	headers: {
// 		"digest": "<" + encodeURI(query) + ">-<" + timeStampArg + ">-<" + config.key + ">",
// 		"negotiatetimestamp": timeStampArg
// 	}
// };
// var args = {
// 	headers: {
// 		"digest": getToken("<" + encodeURI(query) + ">-<" + timeStampArg + ">-<" + config.key + ">"),
// 		"negotiatetimestamp": timeStampArg
// 	}
// };
// console.log('---------------getRecommand----------------');
// console.log(args2);
// console.log(args);
// console.log('---------------end getRecommand----------------');
// restClient.get(config.serviceUrl + encodeURI(query), args, function(data, apiResponse) {
// 	console.log('---------------getRecommand----------------');
// 	console.log(data);
// 	console.log(apiResponse.statusCode);
// 	if (!isEmpty(data)) {
// 		hasRecommendPlan = 1;
// 		if (typeof startdate == "string") {
// 			startdate = new Date(startdate).getTime();
// 		}
// 		strdate2 = timeStamp2String(startdate);
// 	}
// 	for (var i = 0; i < data.length; i++) {
//
// 		var trainingPlanItem = {
// 			tptId: "",
// 			tptTile: "",
// 			tptType: "",
// 			tptDescrition: "",
// 			tpStartDate: "",
// 			tpEndDate: ""
// 		};
// 		trainingPlanItem.tptId = data[i].tptId;
// 		trainingPlanItem.tptTile = data[i].tptTile;
// 		trainingPlanItem.tptType = data[i].tptType;
// 		trainingPlanItem.tptDescrition = data[i].tptDescrition;
// 		trainingPlanItem.tpStartDate = strdate2;
// 		var dayCount = 0;
// 		for (var j = 0; j < data[i].weeks.length; j++) {
// 			dayCount += Object.keys(data[i].weeks[j]).length;
//
//
// 		}
// 		console.log(dayCount);
// 		console.log(dayCount * 86400000);
// 		trainingPlanItem.tpEndDate = timeStamp2String(startdate + dayCount * 86400000);
// 		recommendTrainingPlan.push(trainingPlanItem);
//
// 	}
// 	console.log(JSON.stringify(recommendTrainingPlan));
// 	console.log(hasRecommendPlan);
// 	console.log(recommendTrainingPlan.length);
// 	console.log('---------------end getRecommand----------------');
// });



// var tptid = 1;
// var hasPlanTemplate = 0;
// var trainingPlanTemplate = {
// 	tptId: "",
// 	tptTile: "",
// 	tptType: "",
// 	tptDescrition: ""
// };

// var trainingPlanTemplateWeeksList;

// restClient.get('https://private-anon-84fa34e4dd-readygo.apiary-mock.com/tptemplates/' + tptid, function(data, apiResponse) {
// 	console.log('---------------getPlanTemplateById----------------');

// 	if (!isEmpty(data)) {
// 		hasPlanTemplate = 1;
// 		trainingPlanTemplate.tptId = data.tptId;
// 		trainingPlanTemplate.tptTile = data.tptTile;
// 		trainingPlanTemplate.tptType = data.tptType;
// 		trainingPlanTemplate.tptDescrition = data.tptDescrition;

// 		trainingPlanTemplateWeeksList = data.weeks;
// 	}
// 	console.log(trainingPlanTemplate);
// 	console.log(trainingPlanTemplateWeeksList);

// });

// var userid = "100201";
// var birthday = "1";
// var gender = "1";
// var weight = "1";
// var height = "1";
// var userName = "1";
// var status_uppo = "failure";
// var timeStampArg = new Date().getTime();
// // var status_uppo = 0;
// var argsBody = {
// 	"userId": userid,
// 	"age": birthday,
// 	"gender": gender,
// 	"height": height,
// 	"weight": weight
// };
// var args = {
// 	data: argsBody,
// 	headers: {
// 		"Content-Type": "application/json",
// 		"digest": getToken("<" + JSON.stringify(argsBody) + ">-<" + timeStampArg + ">-<" + config.key + ">"),
// 		"negotiatetimestamp": timeStampArg
// 	}
// };
// var args2 = {
// 	data: argsBody,
// 	headers: {
// 		"Content-Type": "application/json",
// 		"digest": "<" + JSON.stringify(argsBody) + ">-<" + timeStampArg + ">-<" + config.key + ">",
// 		"negotiatetimestamp": timeStampArg
// 	}
// };
// console.log('---------------updateUserProfile----------------');
// console.log(args);
// console.log(args2);
// console.log('---------------end updateUserProfile----------------');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// restClient.put('https://readygo-dit.fwdtech.cn/readygoplan/userProfile/' + userid,
// 	args,
// 	function(data, apiResponse) {
// 		console.log('---------------updateUserProfile----------------');
// 		console.log(apiResponse.statusCode);
// 		// console.log('args=' + JSON.stringify(args));
// 		console.log(data);

// 		if (!isEmpty(data) && !isEmpty(data.code) && data.code == "00") {

// 			status_uppo = "success";

// 			var hasUser = 1;
// 			var userInfo = {
// 				userid: userid,
// 				birthday: birthday,
// 				gender: gender,
// 				weight: weight,
// 				height: height,
// 				userName: userName
// 			};
// 			console.log(userInfo);


// 			console.log(data.msg);
// 		} else if (!isEmpty(data) && !isEmpty(data.code) && data.code == "01") {
// 			console.log(data.msg);
// 		} else if (!isEmpty(data) && !isEmpty(data.status) && data.status == 401) {
// 			console.log(data.message);
// 		}
// 		console.log('--------------end -updateUserProfile----------------');
// 	});

// // // -----------------------

// // var hasUser = 0;
// // var userInfo = {
// // 	userid: "",
// // 	age: "",
// // 	gender: "",
// // 	weight: "",
// // 	height: "",
// // 	userName: ""
// // };


// // // [ { id: '1234567890', name: '上海马拉松' },
// // // { id: '1234567891', name: '北京马拉松' } ]
// // var userMatchInfo = [];
// // var hasUserMatchInfo = 0;
// // // 上海马拉松和北京马拉松
// // var matchNamesJoinStr = "";
// // var matchNameList = [];


// // var isTrainingDoneToday = 0;


// // var hasActivePlan = 0;
// // var activeTrainingPlan = {
// // 	tpId: "",
// // 	tpOwnerId: "",
// // 	tpOwner: "",
// // 	tpStatus: "",
// // 	tpStart: "",
// // 	tpEnd: "",
// // 	tpTargetType: "",
// // 	tpTargetMatchid: "",
// // 	tptId: "",
// // 	tptTile: "",
// // 	tptType: "",
// // 	tptDescrition: ""
// // };

// // // restClient.get('https://private-anon-84fa34e4dd-readygo.apiary-mock.com/userProfile/' + userid, function(data, apiResponse) {
// // // restClient.get('http://localhost:8080/mock-json/loadUserContext.json', function(data, apiResponse) {
// // console.log('---------------loadUserContext----------------');

// // // console.log(data);

// // data = data.results;


// // if (!isEmpty(data) && !isEmpty(data.userProfile)) {
// // 	hasUser = 1;

// // 	userInfo.userid = data.userProfile.userId;
// // 	userInfo.userName = data.userProfile.userName;
// // 	userInfo.age = data.userProfile.age;
// // 	userInfo.gender = data.userProfile.gender;
// // 	userInfo.height = data.userProfile.height;
// // 	userInfo.weight = data.userProfile.weight;
// // }

// // if (!isEmpty(data) && !isEmpty(data.registeredMatchList)) {
// // 	hasUserMatchInfo = 1;
// // 	for (var i = 0; i < data.registeredMatchList.length; i++) {
// // 		var matchItem = {
// // 			id: "",
// // 			name: "",
// // 			type: "",
// // 			startTime: "",
// // 			endTime: "",
// // 			address: ""
// // 		};
// // 		matchItem.id = data.registeredMatchList[i].matchId;
// // 		matchItem.name = data.registeredMatchList[i].matchName;
// // 		matchItem.type = data.registeredMatchList[i].matchType;
// // 		matchItem.startTime = data.registeredMatchList[i].matchStartTime;
// // 		matchItem.endTime = data.registeredMatchList[i].matchEndTime;
// // 		matchItem.address = data.registeredMatchList[i].matchAddress;
// // 		userMatchInfo.push(matchItem);
// // 		matchNameList.push(data.registeredMatchList[i].matchName);
// // 		break;
// // 	}
// // 	matchNamesJoinStr = matchNameList.join("和");
// // }


// // if (!isEmpty(data) && !isEmpty(data.isTrainingDoneToday) && data.isTrainingDoneToday.status == "completed") {
// // 	isTrainingDoneToday = 1;
// // }

// // if (!isEmpty(data) && !isEmpty(data.activeTrainingPlan)) {
// // 	console.log("enter to active");
// // 	hasActivePlan = 1;
// // 	var activeTrainingPlanTemp = data.activeTrainingPlan;
// // 	activeTrainingPlan.tpId = activeTrainingPlanTemp.tpId;
// // 	activeTrainingPlan.tpOwnerId = activeTrainingPlanTemp.tpOwnerId;
// // 	activeTrainingPlan.tpOwner = activeTrainingPlanTemp.tpOwner;
// // 	activeTrainingPlan.tpStatus = activeTrainingPlanTemp.tpStatus;
// // 	activeTrainingPlan.tpStart = activeTrainingPlanTemp.tpStart;
// // 	activeTrainingPlan.tpEnd = activeTrainingPlanTemp.tpEnd;
// // 	activeTrainingPlan.tpTargetType = activeTrainingPlanTemp.tpTargetType;
// // 	activeTrainingPlan.tpTargetMatchid = activeTrainingPlanTemp.tpTargetMatchid;
// // 	activeTrainingPlan.tptId = activeTrainingPlanTemp.tptId;
// // 	activeTrainingPlan.tptTile = activeTrainingPlanTemp.tptTile;
// // 	activeTrainingPlan.tptType = activeTrainingPlanTemp.tptType;
// // 	activeTrainingPlan.tptDescrition = activeTrainingPlanTemp.tptDescrition;

// // }
// // console.log(hasUser);
// // console.log(userInfo);

// // console.log(hasUserMatchInfo);
// // console.log(userMatchInfo);
// // console.log(matchNamesJoinStr);

// // console.log(isTrainingDoneToday);
// // console.log(hasActivePlan);
// // console.log(activeTrainingPlan);
// // console.log(getToken("something"));
// // });

// //---------------------------

// // // perform conversation tasks.
// var userid = "100201";
// var tpOwner = "1";
// var tpStart = "2019-05-22";
// var tpEnd = "2019-05-28";
// var tptId = "tpidXXX2";
// var tpTargetType = "personal";
// var tpTargetMatchid = "1";

// var status_adtp = 0;
// var argsBody = {
// 	"tpOwnerId": userid,
// 	"tpOwner": tpOwner,
// 	"tpStart": tpStart,
// 	"tpEnd": tpEnd,
// 	"tptId": tptId,
// 	"tpTargetType": tpTargetType,
// 	"tpTargetMatchid": tpTargetMatchid
// };
// var args2 = {
// 	data: argsBody,
// 	headers: {
// 		"Content-Type": "application/json",
// 		"digest": "<" + JSON.stringify(argsBody) + ">-<" + timeStampArg + ">-<" + config.key + ">",
// 		"negotiatetimestamp": timeStampArg
// 	}
// };
// var args = {
// 	data: argsBody,
// 	headers: {
// 		"Content-Type": "application/json",
// 		"digest": getToken("<" + JSON.stringify(argsBody) + ">-<" + timeStampArg + ">-<" + config.key + ">"),
// 		"negotiatetimestamp": timeStampArg
// 	}
// };
// console.log('---------------addUserTrainingPlan----------------');
// console.log(args);
// console.log(args2);
// console.log('---------------end addUserTrainingPlan----------------');
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
// restClient.post('https://readygo-dit.fwdtech.cn/readygoplan/tp',
// 	args,
// 	function(data, apiResponse) {
// 		console.log('---------------addUserTrainingPlan----------------');
// 		console.log(apiResponse.statusCode);
// 		console.log(data);

// 		if (!isEmpty(data) && !isEmpty(data.code) && data.code == "00") {


// 			console.log(data.code);
// 		} else if (!isEmpty(data) && !isEmpty(data.code) && data.code == "01") {

// 			console.log(data.code);

// 			if (!isEmpty(data.tpId)) {
// 				status_adtp = 1;

// 				var hasActivePlan = 1;
// 				var activeTrainingPlan = {
// 					tpId: "",
// 					tpOwnerId: "",
// 					tpOwner: "",
// 					tpStatus: "",
// 					tpStart: "",
// 					tpEnd: "",
// 					tpTargetType: "",
// 					tpTargetMatchid: "",
// 					tptId: "",
// 					tptTile: "",
// 					tptType: "",
// 					tptDescrition: ""
// 				};



// 				var activeTrainingPlanTemp = data;
// 				activeTrainingPlan.tpId = activeTrainingPlanTemp.tpId;
// 				activeTrainingPlan.tpOwnerId = activeTrainingPlanTemp.tpOwnerId;
// 				activeTrainingPlan.tpOwner = activeTrainingPlanTemp.tpOwner;
// 				activeTrainingPlan.tpStatus = activeTrainingPlanTemp.tpStatus;
// 				activeTrainingPlan.tpStart = activeTrainingPlanTemp.tpStart;
// 				activeTrainingPlan.tpEnd = activeTrainingPlanTemp.tpEnd;
// 				activeTrainingPlan.tpTargetType = activeTrainingPlanTemp.tpTargetType;
// 				activeTrainingPlan.tpTargetMatchid = activeTrainingPlanTemp.tpTargetMatchid;
// 				activeTrainingPlan.tptId = activeTrainingPlanTemp.tptId;
// 				activeTrainingPlan.tptTile = activeTrainingPlanTemp.tptTile;
// 				activeTrainingPlan.tptType = activeTrainingPlanTemp.tptType;
// 				activeTrainingPlan.tptDescrition = activeTrainingPlanTemp.tptDescrition;


// 				console.log(hasActivePlan);
// 				console.log(activeTrainingPlan);

// 			}

// 		}

// 		// console.log(data);
// 		console.log(apiResponse.statusCode);
// 		console.log('---------------end addUserTrainingPlan----------------');
// 	});


// conversation.variable("loadUserContextApiMsg", data.message);