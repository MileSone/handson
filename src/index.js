import '@babel/polyfill'
import ko from 'knockout'
import './components/bot.js'
import './style.css'
import axios from "axios";
import config from "./config";
import tpDops from "./components/trainningPlan";

class DummyIndexViewModel {
    constructor() {
        const self = this
        self.myBannerTitle = ko.observable("");
        self.spinImg= ko.observable("");
        self.spinImg2= ko.observable("");



       // Do navigation
       self.botPage = ko.observable(true);
       self.mapPage = ko.observable(false);
       self.tpPage = ko.observable(false);
       self.loadingShow = ko.observable(false);
       self.loadingShowSmall = ko.observable(false);

        var imgUrl = require('./templates/img/bannerImage.gif');
        var imgUrl1 = require('./templates/img/loadingSpin.gif');
        var imgUrl2 = require('./templates/img/loadingSvg.svg');
        self.spinImg(imgUrl1);
        self.spinImg2(imgUrl2);
       document.getElementById('banner_container').style.backgroundImage = 'url(' + imgUrl + ')';


        self.loadTpData = function (tpId,type) {
            config.TpChanged = "0";

            if(type == "set"){
                axios.get(`${config.microserviceUrl}/tptemplates/${tpId}`)
                .then(function (response) {
                    config.TpDetail = {};
                    try {
                        var JsonObj = response.data;
                        self.loadingShowSmall(false);
                        if (undefined === JsonObj.results) {
                            alert("API failling");
                        }else{
                            config.TpDetail = JsonObj.results;
                            config.TpChanged = "1";
                            tpDops.onDataChangedCheck();
                            self.goTp();
                        }
                    }catch (e) {
                        self.loadingShowSmall(false);
                        alert(e)

                    }
                })
                .catch(function (error, e) {
                    self.loadingShowSmall(false);
                    alert(error);
                });
            }else{
                axios.get(`${config.microserviceUrl}/activetp/${tpId}`)
                .then(function (response) {
                    config.TpDetail = {};
                    try {
                        self.loadingShowSmall(false);
                        var JsonObj = response.data;
                        if (undefined !== JsonObj.results) {
                            config.TpDetail = JsonObj.results;
                            config.TpChanged = "1";
                            tpDops.onDataChangedCheck();
                            self.goTp();
                        }else{
                            alert("API failling");
                        }
                    }catch (e) {
                        self.loadingShowSmall(false);
                        alert(e)
                    }
                })
                .catch(function (error) {
                    self.loadingShowSmall(false);
                    alert(error);
                });
            }
           
        }


        self.goBot = function() {
           self.hideContent();
           self.botPage(true);
           self.mapPage(false);
           self.tpPage(false);
           document.getElementById("mapiframe").innerHTML = "";
       }
       self.goMap = function() {
           self.loadingShow(true);
           self.mapPage(true);
           self.tpPage(false);
           self.botPage(false);
           document.getElementById("ifrmnameInter").src = config.matchUrl;
           document.getElementById("mapiframe").innerHTML = document.getElementById("ifrmname").innerHTML;
           setTimeout(function () {
               self.loadingShow(false);
           },8000);

       }
        self.goTp = function() {
            self.hideContent();
            self.botPage(false);
            self.mapPage(false);
            self.tpPage(true);
            document.getElementById("mapiframe").innerHTML = "";

        }


        self.callAPI = function(){
            self.loadingShowSmall(true);
            self.loadTpData(config.TpID,config.IsGetATPByTpIdOrSetTPByTptId);
        }

        self.hideContent = function(){
            addClass(document.getElementById("banner_container"),'hide_view');
            removeClass(document.getElementById("content"),'bannerOn');
        }

    }
}

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
    if (cls.replace(/\s/g, '').length == 0) return false;
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}

ko.applyBindings(new DummyIndexViewModel(), document.getElementById('app'))
