/**
 * Created by Razvan on 08-Feb-17.
 */







class ClassHelper{

    constructor(){}

    /**
     *
     * @param {Object} object
     * @param {String|int}key
     * @param {Boolean} shouldNullify
     * @returns {*|String|int}
     */
    static getValue(object, key, shouldNullify = false){
        if(ClassHelper.isDataSetInObject(key, object)) {
            let value = object[key];
            if(shouldNullify) object[key]  = null;
            return value;
        }
        return null;
    };

    /**
     *
     * @param {Object} object
     * @param {String|int}key
     * @param {Boolean} shouldNullify
     * @returns {*|Object}
     */

    static getObject(object, key,shouldNullify = false){
        if(ClassHelper.isObjectSetInObject(key,object)){
            let value = object[key];
            if(shouldNullify) object[key]  = null;
            return value;
        }
        return null;
    };

    /**
     *
     * @param {Object} object
     * @param {String|int}key
     * @param {Boolean} shouldNullify
     * @returns {*|Array}
     */
    static getArray(object, key,shouldNullify = false){
        if(this.isArraySetInObject(key,object)){
            let value = object[key];
            if(shouldNullify) object[key]  = null;
            return value;
        }
        return null;
    };

    /**
     *
     * @param array
     * @param {Function} creator - will be a action that will create an object from the variables (e.g. return new Person(someNotParsedObject))
     * @returns {Array}
     */

    static parseArrayElementWithClass(array, creator = function(element, position){return element;}){
        if(array === null || array.length === 0) return [];
        let result = [];
        for(let i = 0; i < array.length; i++){
            result.push(creator(array[i],i));
        }
        return result;
    };


    static isEmpty(value) {
        try {
            if (typeof value === 'undefined' || value === null) return true; //first check if value is defined and !null

            if (typeof value === 'action' && value !== null) {return false; } //first check if value is defined and !null

            //case : object
            if (typeof value === 'object') {
                for(let key in value) if(key !== undefined) return false; //check if the object has any values
            }
            //case : array
            else if ( value.constructor === Array) {
                if (value.length !== 0) return false;  //check if the array has positive length
            }
            //case : string/number
            else {
                if (value === "0" || value === 0 || value === false || value === true) return false;
                return (!value || /^\s*$/.test(String(value)));
            }
        }
        catch (err){console.error(err);}

        return true;
    }
    static isDataSetInObject(key, object){
        if(object === null || object === undefined || object.length === 0) return false;
        if(!object.hasOwnProperty(key)) return false;
        return !ClassHelper.isEmpty(object[key]);
    }
    static isObjectSetInObject(key, object) {
        if(object === null || object === undefined || object.length === 0) return false;
        if(!object.hasOwnProperty(key)) return false;
        return object[key] !== null;
    }
    static isArraySetInObject(key, object) {
        if(object === null || object === undefined || object.length === 0) return false;
        if(!object.hasOwnProperty(key)) return false;
        return object[key] !== null && object[key].length > 0;
    }

    static isFunctionSetInObject(key,object){
        if(object === null || object === undefined || object.length === 0) return false;
        return !ClassHelper.isEmpty(object[key]);
    }

    static isInAPI(key){
        if ("API" in window && typeof API !== "undefined" && API !== null){
            if(API.hasOwnProperty(key)) return true;
        }

        return false;
    }

    static getFromAPI(key){
        if(ClassHelper.isInAPI(key)) return API.key;
        return null;
    }

    static sanitize(value, fallback = ""){
        return ClassHelper.isEmpty(value) ? fallback : value;
    }






    static bindPicture(parent, url, defaultURL = PATH_DEFAULT_PICTURE, callbackSuccessful = null){
    try {
        if (!parent || !parent.length > 0 || !url) {
            parent.attr("src", defaultURL).fadeIn(100);
            return;
        }
        let self = this;
        imageExists(url, function (callback) {
            if (!callback || ClassHelper.isEmpty(url)) url = defaultURL;
            parent.attr("src", url).fadeIn(100,function(){
                parent.parent().addClass("done");
                if(typeof callbackSuccessful === 'action') callbackSuccessful();
            });
        });
    }
    catch(err){
        console.error(err);
    }
}


}

const GLOBAL_REQUEST_KEY_URL = "url";
const GLOBAL_REQUEST_KEY_TYPE = "type";
const GLOBAL_REQUEST_KEY_DATA = "data";

class Request{

    get data() {
        return this._data;
    }
    set data(value) {
        this._data = value;
    }

    get type() {
        return this._type;
    }
    set type(value) {
        if(value === undefined || value === null) value = "POST";
        this._type = value;
    }

    get url() {
        return this._url;
    }
    set url(value) {
        this._url = value;
    }

    //--------------

    get result() {
        return this._result;
    }
    set result(value) {
        this._result = value;
    }

    get response() {
        return this._response;
    }
    set response(value) {
        this._response = value;
    }

    constructor(object){
        this.url = ClassHelper.getValue(object, GLOBAL_REQUEST_KEY_URL);
        this.type = ClassHelper.getValue(object, GLOBAL_REQUEST_KEY_TYPE);
        this.data = ClassHelper.getObject(object, GLOBAL_REQUEST_KEY_DATA);
        this.result = null;

        return this;
    }

    make(object,force_log = false){

        let callbackOk = isDataSetInObject("ok",object) ? object["ok"] : null;
        let callbackNegative = isDataSetInObject("negative",object) ? object["negative"] : null;
        let callbackAlways = isDataSetInObject("always",object) ? object["always"] : null;
        let callbackFail = isDataSetInObject("fail",object) ? object["fail"] : null;
        let sendingFiles = isDataSetInObject("sendingFiles",object) ? object["sendingFiles"] : false;

        let self = this;
        let header = {
            url : self.url,
            type : self.type,
            data : ClassHelper.isEmpty(self.data) ? [] : self.data,
            dataType : 'json'
        };
        if(sendingFiles){
            header.contentType = false;
            header.cache = false;
            header.processData = false;

            let formData = new FormData();
            for(let key in header.data) if(header.data.hasOwnProperty(key)) formData.append(key, header.data[key]);
            header.data = formData;

        }
        let request = $.ajax(header);

        request.done(function(delivery){

            if(force_log) console.log(delivery);

            if(callbackOk === null && callbackNegative === null && callbackAlways === null && callbackFail === null) return self;
            try{

                self.response = ClassHelper.isDataSetInObject("response",delivery) ? String(delivery["response"]) : null;
                self.result = ClassHelper.isDataSetInObject("result",delivery) ? delivery["result"] : null;

                if(self.response === kResponseOk ){
                    if(typeof callbackOk === 'action') callbackOk(self.result);
                    else return self;
                }
                else if(self.response === kResponseNegative ){
                    if(typeof callbackNegative === 'action') callbackNegative(self.result);
                    else return self;
                }

            }
            catch(err){
                console.error(err);
            }
        });

        request.always(function(delivery = null){
            if(typeof callbackAlways === 'action') callbackAlways(delivery);
        });
        request.fail(function(delivery = null){
            if(typeof callbackFail === 'action') callbackFail(delivery);
            else {
                showAlert("Connection error.");
                console.error(delivery);
            }
        });


        return this;
    }


}





/**
 * SECURITY
 */


function secureString(str){
    str = str.trim();
    str=str.replace(/<br>/gi, "\n");
    str=str.replace(/<p.*>/gi, "\n");
    str=str.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 (Link->$1) ");
    str=str.replace(/<(?:.|\s)*?>/g, "");
    str = str.replace(/<[^>]+>/g, '');
    return str.replace(/\&/g, '&amp;')
        .replace(/\</g, '&lt;')
        .replace(/\>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/\'/g, '&#x27')
        .replace(/\//g, '&#x2F');
}



/**
 * Function used for determining when user has scrolled close to bottom of page
 * Great for "Load More" tricks
 */
function lazyLoadNewsFeed(nearToBottom, element, parent){

    console.log("DocHeight : "+ $(document).height());
    console.log("E Scroll Top : "+ element.scrollTop());
    console.log("E Height : "+ element.height() );
    console.log("W InnerHeight : "+ parent.height());
    return (element.scrollTop() >= (parent.height() - nearToBottom));
}


function lazyLoadElement(nearToBottom, element, parent){
    return (element.height()+ element.scrollTop() >= (parent.height() - nearToBottom));
}

function lazyLoadDocument(nearToBottom){
    return (window.innerHeight+ $(window).scrollTop() >= ($(document).height() - nearToBottom));
}
/**
 console.log("DocHeight : "+ $(document).height());
 console.log("W Scroll Top : "+ $(window).scrollTop());
 console.log("W Height : "+ $(window).height());
 console.log("W InnerHeight : "+ window.innerHeight);
 */


/**
 * Function used for determining if an image is or not on the server
 */
function imageExists(url, callback) {
    var img = new Image();
    img.onload = function() { callback(true); };
    img.onerror = function() { callback(false); };
    img.src = url;
}

const options = { year: 'numeric', month: 'long', day: 'numeric' };


function convertDate(date){

    date = date.toDate("dd/mm/yyyy");
    var day = date.getDate(); if(day <= 9) day = "0"+day;
    var month = date.getMonth()+1; if(month <= 9) month = "0"+month;
    var year = date.getFullYear();
    date = year+"-"+month+"-"+day;
    return date;
}



String.prototype.toDate = function(format)
{

    var normalized      = this.replace(/[^a-zA-Z0-9]/g, '-');
    var normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    var formatItems     = normalizedFormat.split('-');
    var dateItems       = normalized.split('-');

    var monthIndex  = formatItems.indexOf("mm");
    var dayIndex    = formatItems.indexOf("dd");
    var yearIndex   = formatItems.indexOf("yyyy");
    var hourIndex     = formatItems.indexOf("hh");
    var minutesIndex  = formatItems.indexOf("ii");
    var secondsIndex  = formatItems.indexOf("ss");

    var today = new Date();

    var year  = yearIndex>-1  ? dateItems[yearIndex]    : today.getFullYear();
    var month = monthIndex>-1 ? dateItems[monthIndex]-1 : today.getMonth()-1;
    var day   = dayIndex>-1   ? dateItems[dayIndex]     : today.getDate();

    var hour    = hourIndex>-1      ? dateItems[hourIndex]    : today.getHours();
    var minute  = minutesIndex>-1   ? dateItems[minutesIndex] : today.getMinutes();
    var second  = secondsIndex>-1   ? dateItems[secondsIndex] : today.getSeconds();

    return new Date(year,month,day,hour,minute,second);
};



/**
 Global PRINTS
 printHelper()helps show the blue info-box with custom text inside.
 */

function printHelper(parent, content, html){

    let print = '<div class="HELPERContentContainer doNotSelect"> ' +
        '<div class="HELPERFilterInfoContainer"> ';
    if(html) print+='<span>'+content+'</span>';
    else print+=content;
    print+='</div>';
    parent.append(print);
}



function printHelperWithButton(ID,parent, content, button = {"title" : "Click me!", "callback" : function(){ showToast("Button click!",600); }}){


    let print =
        '<div class="HELPERContentContainer doNotSelect"> ' +
        '<div class="HELPERFilterInfoContainer"> '+
        '<span class="HELPERFilterInfoContent">'+content+'</span>'+
        '<a id="HELPER-'+ID+'" class="HELPERFilterInfoButton"><span>'+button.title+'</span></a>'+
        '</div>'+
        '</div>';
    parent.append(print);

    if(button['callback']){
        let callback = button['callback'];
        $("#HELPER-"+ID).on("click",function(){
            callback();
        })
    }

}


function labelThis(parent, text){
    var print = '<div style="height: 100%; display: flex; align-items: center;"><span>' + text + '</span></div>';
    parent.append(print);
}

function getFirstWord(str) {
    if (str.indexOf(' ') === -1)
        return str;
    else
        return str.substr(0, str.indexOf(' '));
}



function showToast(text, timeout,callback = null,sync = true){
    $(function(residual = null){
        let container = $("#toast");
        if(!container.length) {
            let toast = '<div id="toast"> ' +
                '<div  id="toastInnerContainer"> ' +
                '<span  style="color: #04befe" id="toast-text"></span> ' +
                '</div> ' +
                '</div>';

            $("body").append(toast)
        }
        $("#toast-text").text(text);
        container.show();
        if(timeout!== null && timeout!=false) {
            if (callback !== null && !sync){
                if(residual) callback(residual);
                else callback();
            }
            setTimeout(function () {
                $("#toast").fadeOut('slow');
                if (callback !== null && sync) {
                    if(residual) callback(residual);
                    else callback();
                }
            }, timeout);
        }
    });
}

function hideToast(){
    var container = $("#toast");
    container.fadeOut(50);
}





function showLoadingToast(text = "Loading...", timeout = 1000, callback = null){
    let container = $(".vanLoadingToast");
    if(!container.length > 0) {
        let toast = '<div class="vanLoadingToast" style="">' +
            '<span></span>' +
            '</div>';
        $("body").append(toast);
        container = $(".vanLoadingToast");
    }
    container.find("span").text(text);
    if(!container.is(":visible")) container.fadeIn(150);
    setTimeout(function(){
        if(container.is(":visible"))  container.fadeOut(150);
        if(callback && typeof callback === "action") callback();
    },timeout);
}
function hideLoadingToast(){
    let container = $(".vanLoadingToast");
    if(container.length > 0 && container.is(":visible"))  container.fadeOut(150);
}




function compareDates(dateTimeA, dateTimeB) {
    var momentA = moment(dateTimeA,"YYYY/MM/DD");
    var momentB = moment(dateTimeB,"YYYY/MM/DD");
    if (momentA > momentB) return 1;
    else if (momentA < momentB) return -1;
    else return 0;
}





function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function validatePhone(phone){
    re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
    if(re.test(phone)){
        if(phone.trim().length < 10) return false;
    }
    else return false;
    return true;
}


function validateString(str){
    return !(str == null || str.length == 0 || str.trim().length == 0 || str === '');

}


function validateURL(str) {
    var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
    if(!regex .test(str)) {
        return false;
    } else {
        return true;
    }
}


/**
 * FAVICON
 */

function favicon(){
    var favRoot = "image/fav";
    var printFav = '<link rel="apple-touch-icon" sizes="57x57" href="'+favRoot+'/apple-icon-57x57.png"> ' +
        '<link rel="apple-touch-icon" sizes="60x60" href="'+favRoot+'/apple-icon-60x60.png"> ' +
        '<link rel="apple-touch-icon" sizes="72x72" href="'+favRoot+'/apple-icon-72x72.png"> ' +
        '<link rel="apple-touch-icon" sizes="76x76" href="'+favRoot+'/apple-icon-76x76.png"> ' +
        '<link rel="apple-touch-icon" sizes="114x114" href="'+favRoot+'/apple-icon-114x114.png"> ' +
        '<link rel="apple-touch-icon" sizes="120x120" href="'+favRoot+'/apple-icon-120x120.png"> ' +
        '<link rel="apple-touch-icon" sizes="144x144" href="'+favRoot+'/apple-icon-144x144.png"> ' +
        '<link rel="apple-touch-icon" sizes="152x152" href="'+favRoot+'/apple-icon-152x152.png"> ' +
        '<link rel="apple-touch-icon" sizes="180x180" href="'+favRoot+'/apple-icon-180x180.png"> ' +
        '<link rel="icon" type="image/png" sizes="192x192"  href="'+favRoot+'/android-icon-192x192.png"> ' +
        '<link rel="icon" type="image/png" sizes="32x32" href="'+favRoot+'/favicon-32x32.png"> ' +
        '<link rel="icon" type="image/png" sizes="96x96" href="'+favRoot+'/favicon-96x96.png"> ' +
        '<link rel="icon" type="image/png" sizes="16x16" href="'+favRoot+'/favicon-16x16.png"> ' +
        '<link rel="manifest" href="'+favRoot+'/manifest.json"> ' +
        '<meta name="msapplication-TileColor" content="#ffffff"> ' +
        '<meta name="msapplication-TileImage" content="'+favRoot+'/ms-icon-144x144.png"> ' +
        '<meta name="theme-color" content="#ffffff">';
    $("head").append(printFav);
};


function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}



function transitionPageLeave(newLocation = null){
    setTimeout(function(){window.location.href = newLocation }, 100);
}




function transitionPageEnter(){
    setTimeout(function(){  $(".transitionContainer").fadeOut(200); }, 100);
}

function transitionPageEnterLoad(depthToRoot){
    //no more
}

function transitionPageEnterLoadEnd(){
    $(".transitionContainer").fadeOut(200);
}

function updatePlaceholders(){
    $('[placeholder]').focus(function() {
        var input = $(this);
        if (input.val() === input.attr('placeholder')) {
            input.val('');
            input.removeClass('placeholder');
        }
    }).blur(function() {
        var input = $(this);
        if (input.val() === '' || input.val() === input.attr('placeholder')) {
            input.addClass('placeholder');
        }
    }).blur();
}





const MODAL_HEADER_TYPE_DELETE = 1;
const MODAL_HEADER_TYPE_COMPLEMENTARY = 2;
const MODAL_HEADER_TYPE_DONE = 3;

const MODAL_BUTTON_COLOR_TYPE_DELETE = "#F44336";

function bootstrapButton(title, color, callback, bClass = "modalButton"){
    return {
        "title" : title,
        "color" : color,
        "callback" : callback,
        "class" : bClass
    }
}

function showBootstrapModal(headerType = 2, title, content, buttons = null, closable = true, specialClass = "", onShow = null){

    let modal = $("#utilCustomModal");
    /** If modal code was not yet printed, check and print */
    if(! modal.length > 0) {
        let print = '<div class="modal fade" id="utilCustomModal"  tabindex="-1" role="dialog" aria-labelledby="utilCustomModalTitle"> ' +
            '<div class="modal-dialog '+specialClass+'" role="document" > ' +
            '<div class="modal-content" > ' +
            '<div class="modal-header"> ' +
            '<div  style="-webkit-appearance: none" href="#"  class="close" data-dismiss="modal"  aria-label="Close"> <span aria-hidden="true">&times;</span></div> ' +
            '<h4 class="modal-title" id="utilCustomModalTitle"></h4> ' +
            '</div> ' +
            '<div class="modal-body"> ' +

            '</div> ' +
            '<div class="modal-footer" > ' +

            '</div> ' +
            '</div> ' +
            '</div> ' +
            '</div>';

        $("body").append(print);
        modal = $("#utilCustomModal");
    }

    if(!closable) modal.attr("data-keyboard","false").attr("data-backdrop","static");

    modal.find(".modal-title").html(title);
    modal.find(".modal-body").html(content);
    if(modal.find(".modal-header").hasClass("modal-headerDelete"))modal.find(".modal-header").removeClass("modal-headerDelete");
    if(modal.find(".modal-header").hasClass("modal-headerComplementary"))modal.find(".modal-header").removeClass("modal-headerComplementary");

    switch (headerType){
        case MODAL_HEADER_TYPE_DELETE :   modal.find(".modal-header").addClass("modal-headerDelete"); break;
        case MODAL_HEADER_TYPE_COMPLEMENTARY : modal.find(".modal-header").addClass("modal-headerComplementary"); break;
        default : break;
    }

    modal.find(".modal-footer").html("");
    if(buttons === null || closable) modal.find(".modal-footer").append('<div data-dismiss="modal" class="modalButtonCancel" ><span>Close</span></div>');
    if(buttons !== null){
        for(let i = 0; i < buttons.length; i++){
            let title = buttons[i]['title'];
            let callback = buttons[i]['callback'];
            let bClass = buttons[i].hasOwnProperty("class") ? buttons[i]["class"] : "modalButton";
            let color = buttons[i].hasOwnProperty('color') ? buttons[i]['color'] : "#4ebefe";
            modal.find(".modal-footer").prepend('<div style="color: '+color+' ;" id="utilCustomModalButton-'+i+'" class="'+bClass+'"><span>'+title+'</span></div>');
            if(callback) $("#utilCustomModalButton-"+i).unbind().on("click",function(){callback('#utilCustomModalButton-'+i, $("#utilCustomModal"));});
        }
    }


    if(onShow && typeof  onShow === "action")
        modal.on("show.bs.modal",onShow(modal));
    modal.modal('show');

    return modal;



}






const MODAL_TYPE_NORMAL = 1;
const MODAL_TYPE_DELETE = 2;
const MODAL_TYPE_EDIT = 3;
const MODAL_TYPE_SUCCESS = 4;


const COLOR_RED = "#F44336";
const COLOR_BLUE = "#157EFB";
const COLOR_GREEN = "#43e97b";
const COLOR_GREY = "#AAAAAA";

function showModal(ID,title, content, buttons = null, type = MODAL_TYPE_NORMAL, closable = true, onShow = null, onHide = null, reprint = false){

    let modal = $(".vanModal[data-id='"+ID+"']");
    /** If modal code was not yet printed, check and print */
    if(! modal.length > 0 || reprint === true) {

        if(modal.length > 0) modal.remove();

        let print = '<div class="modal fade vanModal" tabindex="-1" role="dialog" data-id="'+ID+'"> ' +
            '<div class="modal-dialog" role="document" > ' +
            '<div class="modal-content" > ' +
            '<div class="modal-header"> ' +
            '<div  style="-webkit-appearance: none" href="#"  class="close" data-dismiss="modal"  aria-label="Close"> <span aria-hidden="true">&times;</span></div> ' +
            '<h4 class="modal-title" ></h4> ' +
            '</div> ' +
            '<div class="modal-body"> ' +

            '</div> ' +
            '<div class="modal-footer" > ' +

            '</div> ' +
            '</div> ' +
            '</div> ' +
            '</div>';


        $("body").append(print);
        modal = $(".vanModal[data-id='"+ID+"']");


        let modalCount = $(".vanModal").length;
        modal.css("z-index", parseInt(modal.css("z-index")) + modalCount );


        if(!closable) modal.attr("data-keyboard","false").attr("data-backdrop","static");

        switch (type) {
            case MODAL_TYPE_NORMAL :
                modal.find(".modal-title").css("color", "#000000"); break;
            case MODAL_TYPE_DELETE :
                modal.find(".modal-title").css("color", "#F44336"); break;
            case MODAL_TYPE_EDIT :
                modal.find(".modal-title").css("color", "#157EFB"); break;
            case MODAL_TYPE_SUCCESS :
                modal.find(".modal-title").css("color", "#43e97b"); break;
        }

        modal.find(".modal-title").text(title);
        modal.find(".modal-body").html(content);

    }

    /**
     * Make sure to "reprint" every item that may have a dynamic callback
     * There are cases when the action of the button can change if the modal is called from different places (e.g. same modal, for each different item in a list)
     */

    if(onShow !== null && typeof  onShow === "action")
        modal.on("show.bs.modal",onShow(modal));

    if(onHide !== null && typeof  onHide === "action")
        modal.on("hide.bs.modal",onHide(modal));

    modal.find(".modal-footer").html("");
    if(buttons === null || closable) modal.find(".modal-footer").append('<div data-dismiss="modal" class="modalButton cancel" ><span>Close</span></div>');
    if(buttons !== null){
        for(let i = 0; i < buttons.length; i++){
            let title = buttons[i]['title'];
            let callback = buttons[i]['callback'];
            let bClass = buttons[i].hasOwnProperty("class") ? buttons[i]["class"] : "modalButton";
            let color = buttons[i].hasOwnProperty('color') ? buttons[i]['color'] : "#4ebefe";

            modal.find(".modal-footer").prepend('<div style="color: '+color+' ;" data-button-id="'+i+'" class="vanModalButton '+bClass+'"><span>'+title+'</span></div>');
            if(callback) $(".vanModalButton[data-button-id='"+i+"']").unbind().on("click",function(){callback($(".vanModalButton[data-button-id='"+i+"']"), modal);});
        }
    }

    modal.modal('show');


    return modal;



}












function buildPrePath(depthToRoot){
    let prePath=""; for (let i = 0; i < depthToRoot; i++) prePath += "../";
    return prePath;
}







function disableButtonClick(element, loader = false){
    if(!element.length){
        console.log("Element missing on disable.");
        console.log(element);
        return;
    }
    if(!element.hasClass("disableClick")) element.addClass("disableClick");
    if(loader) {
        if(! element.find(".loader").length > 0){
            element.append("<div class='loader'><i class='material-icons'>autorenew</i></div>")
        }
        element.find(".loader").show(150);
    }
    else{
        if(element.find(".loader").length < 0){
            element.find(".loader").hide();
        }
    }
}

function enableButtonClick(element,loader = false){
    if(!element.length){
        console.log("Element missing on disable.");
        console.log(element);
        return;
    }
    if(element.hasClass("disableClick")) element.removeClass("disableClick");
    if(loader) {
        if(! element.find(".loader").length > 0){
            element.append("<div class='loader'><i class='material-icons'>autorenew</i></div>")
        }
        element.find(".loader").hide(150);
    }
    else{
        if(! element.find(".loader").length > 0){
            element.find(".loader").hide();
        }
    }
}



/**
 *
 * @param child jQuery Element
 */
function stopParentScroll(child){
    child.on('DOMMouseScroll mousewheel', function(ev) {
        let $this = $(this),
            scrollTop = this.scrollTop,
            scrollHeight = this.scrollHeight,
            height = $this.height(),
            delta = (ev.type == 'DOMMouseScroll' ?
                ev.originalEvent.detail * -40 :
                ev.originalEvent.wheelDelta),
            up = delta > 0;

        let prevent = function() {
            ev.stopPropagation();
            ev.preventDefault();
            ev.returnValue = false;
            return false;
        };

        if (!up && -delta > scrollHeight - height - scrollTop) {
            // Scrolling down, but this will take us past the bottom.
            $this.scrollTop(scrollHeight);
            return prevent();
        } else if (up && delta > scrollTop) {
            // Scrolling up, but this will take us past the top.
            $this.scrollTop(0);
            return prevent();
        }
    });
}

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};


String.prototype.beginsWith = function (string) {
    return(this.indexOf(string) === 0);
};




function initAlert(){
    let print = '<div id="customAlertContainer"></div>';
    $("main").after(print);
}

const ALERT_TYPE_SUCCESS = 1;
const ALERT_TYPE_FAILURE = 2;

let ALERT_INDEX = 0;



function showAlert(text,type = ALERT_TYPE_FAILURE, timeout = 1400,callback = null){
    ALERT_INDEX ++;

    if($("#customAlertContainer").length === 0) initAlert();
    let parent = $("#customAlertContainer");

    let print_success = '<div data-index = "'+ALERT_INDEX+'" class="customAlert success" role="alert" style="display: none" ><span></span></div> '
    let print_failure = '<div data-index = "'+ALERT_INDEX+'" class="customAlert failure" role="alert" style="display: none" ><div class="warnContainer"><i class="material-icons">warning</i></div><span></span></div> ';

    let element = null;

    if(type === ALERT_TYPE_SUCCESS){
        parent.append(print_success);
        element = parent.find(".customAlert.success[data-index='"+ALERT_INDEX+"']");
    }
    else if (type === ALERT_TYPE_FAILURE){
        parent.append(print_failure);
        element = parent.find(".customAlert.failure[data-index='"+ALERT_INDEX+"']");
    }


    if(!element.length) return;
    element.find("span").text(text);
    element.fadeIn('normal');
    setTimeout(function () {element.fadeOut('slow',function(){ element.remove();});}, timeout);

    if(callback !== null) setTimeout(function () {callback();}, timeout);
}


function isEmpty(value) {
    return ClassHelper.isEmpty(value);
}

function isDataSetInObject(key, object){
    return ClassHelper.isDataSetInObject(key,object);
}

function isObjectSetInObject(key, object) {
    return ClassHelper.isObjectSetInObject(key,object);
}

function isArraySetInObject(key, object) {
    return ClassHelper.isArraySetInObject(key,object);
}

function getParsedDate(date, includeHour = true){
    let dateCopy = date;
    try{
        moment.locale('en-gb');
        return includeHour ?  moment(date).format('DD MMMM YYYY HH:mm') : moment(date).format('DD MMMM YYYY');
    }
    catch(e){console.log(e);}
    return dateCopy;
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};




function bindPicture(parent, url, defaultURL = PATH_DEFAULT_PICTURE, callbackSuccessful = null){
    ClassHelper.bindPicture(parent, url, defaultURL = PATH_DEFAULT_PICTURE, callbackSuccessful);

}

function findIndexByIDInArray(ID, array){
    for(let i = 0; i < array.length; i++){
        if(array[i].ID === ID) return i;
    }
    return null;
}





let countryCodes = [
    {
        "country_code" : "GB",
        "country_en" : "United Kingdom",
        "country_cn" : "英国",
        "phone_code" : 44
    },
    {
        "country_code" : "RO",
        "country_en" : "Romania",
        "country_cn" : "罗马尼亚",
        "phone_code" : 40
    },
    {
        "country_code" : "AL",
        "country_en" : "Albania",
        "country_cn" : "阿尔巴尼亚",
        "phone_code" : 355
    },
    {
        "country_code" : "DZ",
        "country_en" : "Algeria",
        "country_cn" : "阿尔及利亚",
        "phone_code" : 213
    },
    {
        "country_code" : "AF",
        "country_en" : "Afghanistan",
        "country_cn" : "阿富汗",
        "phone_code" : 93
    },
    {
        "country_code" : "AR",
        "country_en" : "Argentina",
        "country_cn" : "阿根廷",
        "phone_code" : 54
    },
    {
        "country_code" : "AE",
        "country_en" : "United Arab Emirates",
        "country_cn" : "阿联酋",
        "phone_code" : 971
    },
    {
        "country_code" : "AW",
        "country_en" : "Aruba",
        "country_cn" : "阿鲁巴",
        "phone_code" : 297
    },
    {
        "country_code" : "OM",
        "country_en" : "Oman",
        "country_cn" : "阿曼",
        "phone_code" : 968
    },
    {
        "country_code" : "AZ",
        "country_en" : "Azerbaijan",
        "country_cn" : "阿塞拜疆",
        "phone_code" : 994
    },
    {
        "country_code" : "EG",
        "country_en" : "Egypt",
        "country_cn" : "埃及",
        "phone_code" : 20
    },
    {
        "country_code" : "ET",
        "country_en" : "Ethiopia",
        "country_cn" : "埃塞俄比亚",
        "phone_code" : 251
    },
    {
        "country_code" : "IE",
        "country_en" : "Ireland",
        "country_cn" : "爱尔兰",
        "phone_code" : 353
    },
    {
        "country_code" : "EE",
        "country_en" : "Estonia",
        "country_cn" : "爱沙尼亚",
        "phone_code" : 372
    },
    {
        "country_code" : "AD",
        "country_en" : "Andorra",
        "country_cn" : "安道尔",
        "phone_code" : 376
    },
    {
        "country_code" : "AO",
        "country_en" : "Angola",
        "country_cn" : "安哥拉",
        "phone_code" : 244
    },
    {
        "country_code" : "AI",
        "country_en" : "Anguilla",
        "country_cn" : "安圭拉",
        "phone_code" : 1264
    },
    {
        "country_code" : "AG",
        "country_en" : "Antigua",
        "country_cn" : "安提瓜岛",
        "phone_code" : 1268
    },
    {
        "country_code" : "AT",
        "country_en" : "Austria",
        "country_cn" : "奥地利",
        "phone_code" : 43
    },
    {
        "country_code" : "AU",
        "country_en" : "Australia",
        "country_cn" : "澳大利亚",
        "phone_code" : 61
    },
    {
        "country_code" : "MO",
        "country_en" : "Macau",
        "country_cn" : "中国澳门特别行政区",
        "phone_code" : 853
    },
    {
        "country_code" : "BB",
        "country_en" : "Barbados",
        "country_cn" : "巴巴多斯",
        "phone_code" : 1246
    },
    {
        "country_code" : "PG",
        "country_en" : "Papua New Guinea",
        "country_cn" : "巴布亚新几内亚",
        "phone_code" : 675
    },
    {
        "country_code" : "BS",
        "country_en" : "The Bahamas",
        "country_cn" : "巴哈马",
        "phone_code" : 1242
    },
    {
        "country_code" : "PK",
        "country_en" : "Pakistan",
        "country_cn" : "巴基斯坦",
        "phone_code" : 92
    },
    {
        "country_code" : "PY",
        "country_en" : "Paraguay",
        "country_cn" : "巴拉圭",
        "phone_code" : 595
    },
    {
        "country_code" : "PS",
        "country_en" : "Palestine",
        "country_cn" : "巴勒斯坦",
        "phone_code" : 970
    },
    {
        "country_code" : "BH",
        "country_en" : "Bahrain",
        "country_cn" : "巴林",
        "phone_code" : 973
    },
    {
        "country_code" : "PA",
        "country_en" : "Panama",
        "country_cn" : "巴拿马",
        "phone_code" : 507
    },
    {
        "country_code" : "BR",
        "country_en" : "Brazil",
        "country_cn" : "巴西",
        "phone_code" : 55
    },
    {
        "country_code" : "BY",
        "country_en" : "Belarus",
        "country_cn" : "白俄罗斯",
        "phone_code" : 375
    },
    {
        "country_code" : "BM",
        "country_en" : "Bermuda",
        "country_cn" : "百慕大",
        "phone_code" : 1441
    },
    {
        "country_code" : "BG",
        "country_en" : "Bulgaria",
        "country_cn" : "保加利亚",
        "phone_code" : 359
    },
    {
        "country_code" : "MP",
        "country_en" : "Northern Mariana Islands",
        "country_cn" : "北马里亚纳群岛",
        "phone_code" : 1670
    },
    {
        "country_code" : "BJ",
        "country_en" : "Benin",
        "country_cn" : "贝宁",
        "phone_code" : 229
    },
    {
        "country_code" : "BE",
        "country_en" : "Belgium",
        "country_cn" : "比利时",
        "phone_code" : 32
    },
    {
        "country_code" : "IS",
        "country_en" : "Iceland",
        "country_cn" : "冰岛",
        "phone_code" : 354
    },
    {
        "country_code" : "PR",
        "country_en" : "Puerto Rico",
        "country_cn" : "波多黎各",
        "phone_code" : 1
    },
    {
        "country_code" : "PL",
        "country_en" : "Poland",
        "country_cn" : "波兰",
        "phone_code" : 48
    },
    {
        "country_code" : "BA",
        "country_en" : "Bosnia and Herzegovina",
        "country_cn" : "波斯尼亚和黑塞哥维那",
        "phone_code" : 387
    },
    {
        "country_code" : "BO",
        "country_en" : "Bolivia",
        "country_cn" : "玻利维亚",
        "phone_code" : 591
    },
    {
        "country_code" : "BZ",
        "country_en" : "Belize",
        "country_cn" : "伯利兹",
        "phone_code" : 501
    },
    {
        "country_code" : "PW",
        "country_en" : "Palau",
        "country_cn" : "帛琉",
        "phone_code" : 680
    },
    {
        "country_code" : "BW",
        "country_en" : "Botswana",
        "country_cn" : "博茨瓦纳",
        "phone_code" : 267
    },
    {
        "country_code" : "BT",
        "country_en" : "Bhutan",
        "country_cn" : "不丹",
        "phone_code" : 975
    },
    {
        "country_code" : "BF",
        "country_en" : "Burkina Faso",
        "country_cn" : "布基纳法索",
        "phone_code" : 226
    },
    {
        "country_code" : "BI",
        "country_en" : "Burundi",
        "country_cn" : "布隆迪",
        "phone_code" : 257
    },
    {
        "country_code" : "KP",
        "country_en" : "North Korea",
        "country_cn" : "朝鲜",
        "phone_code" : 850
    },
    {
        "country_code" : "GQ",
        "country_en" : "Equatorial Guinea",
        "country_cn" : "赤道几内亚",
        "phone_code" : 240
    },
    {
        "country_code" : "DK",
        "country_en" : "Denmark",
        "country_cn" : "丹麦",
        "phone_code" : 45
    },
    {
        "country_code" : "DE",
        "country_en" : "Germany",
        "country_cn" : "德国",
        "phone_code" : 49
    },
    {
        "country_code" : "TL",
        "country_en" : "Timor-Leste",
        "country_cn" : "东帝汶",
        "phone_code" : 670
    },
    {
        "country_code" : "TG",
        "country_en" : "Togo",
        "country_cn" : "多哥",
        "phone_code" : 228
    },
    {
        "country_code" : "DM",
        "country_en" : "Dominica",
        "country_cn" : "多米尼加",
        "phone_code" : 1767
    },
    {
        "country_code" : "DO",
        "country_en" : "Dominican Republic",
        "country_cn" : "多米尼加共和国",
        "phone_code" : 1809
    },
    {
        "country_code" : "RU",
        "country_en" : "Russia",
        "country_cn" : "俄罗斯",
        "phone_code" : 7
    },
    {
        "country_code" : "EC",
        "country_en" : "Ecuador",
        "country_cn" : "厄瓜多尔",
        "phone_code" : 593
    },
    {
        "country_code" : "ER",
        "country_en" : "Eritrea",
        "country_cn" : "厄立特里亚",
        "phone_code" : 291
    },
    {
        "country_code" : "FR",
        "country_en" : "France",
        "country_cn" : "法国",
        "phone_code" : 33
    },
    {
        "country_code" : "FO",
        "country_en" : "Faroe Islands",
        "country_cn" : "法罗群岛",
        "phone_code" : 298
    },
    {
        "country_code" : "PF",
        "country_en" : "French Polynesia",
        "country_cn" : "法属波利尼西亚",
        "phone_code" : 689
    },
    {
        "country_code" : "GF",
        "country_en" : "French Guiana",
        "country_cn" : "法属圭亚那",
        "phone_code" : 594
    },
    {
        "country_code" : "PM",
        "country_en" : "Saint Pierre and Miquelon",
        "country_cn" : "法属圣皮埃尔和密克隆岛",
        "phone_code" : 508
    },
    {
        "country_code" : "VA",
        "country_en" : "Vatican City",
        "country_cn" : "梵蒂冈城",
        "phone_code" : 39
    },
    {
        "country_code" : "PH",
        "country_en" : "Philippines",
        "country_cn" : "菲律宾",
        "phone_code" : 63
    },
    {
        "country_code" : "FJ",
        "country_en" : "Fiji",
        "country_cn" : "斐济",
        "phone_code" : 679
    },
    {
        "country_code" : "FI",
        "country_en" : "Finland",
        "country_cn" : "芬兰",
        "phone_code" : 358
    },
    {
        "country_code" : "CV",
        "country_en" : "Cape Verde",
        "country_cn" : "佛得角",
        "phone_code" : 238
    },
    {
        "country_code" : "FK",
        "country_en" : "Falkland Islands",
        "country_cn" : "福克兰群岛",
        "phone_code" : 500
    },
    {
        "country_code" : "GM",
        "country_en" : "The Gambia",
        "country_cn" : "冈比亚",
        "phone_code" : 220
    },
    {
        "country_code" : "CG",
        "country_en" : "Republic of the Congo",
        "country_cn" : "刚果共和国",
        "phone_code" : 242
    },
    {
        "country_code" : "CD",
        "country_en" : "Democratic Republic of the Congo",
        "country_cn" : "刚果民主共和国",
        "phone_code" : 243
    },
    {
        "country_code" : "CO",
        "country_en" : "Colombia",
        "country_cn" : "哥伦比亚",
        "phone_code" : 57
    },
    {
        "country_code" : "CR",
        "country_en" : "Costa Rica",
        "country_cn" : "哥斯达黎加",
        "phone_code" : 506
    },
    {
        "country_code" : "GD",
        "country_en" : "Grenada",
        "country_cn" : "格林纳达岛",
        "phone_code" : 1473
    },
    {
        "country_code" : "GL",
        "country_en" : "Greenland",
        "country_cn" : "格陵兰",
        "phone_code" : 299
    },
    {
        "country_code" : "GE",
        "country_en" : "Georgia",
        "country_cn" : "格鲁吉亚",
        "phone_code" : 995
    },
    {
        "country_code" : "GG",
        "country_en" : "Guernsey",
        "country_cn" : "根西岛",
        "phone_code" : 44
    },
    {
        "country_code" : "CU",
        "country_en" : "Cuba",
        "country_cn" : "古巴",
        "phone_code" : 53
    },
    {
        "country_code" : "GP",
        "country_en" : "Guadeloupe",
        "country_cn" : "瓜德罗普岛",
        "phone_code" : 590
    },
    {
        "country_code" : "GU",
        "country_en" : "Guam",
        "country_cn" : "关岛",
        "phone_code" : 1671
    },
    {
        "country_code" : "GY",
        "country_en" : "Guyana",
        "country_cn" : "圭亚那",
        "phone_code" : 592
    },
    {
        "country_code" : "KZ",
        "country_en" : "Kazakhstan",
        "country_cn" : "哈萨克斯坦",
        "phone_code" : 7
    },
    {
        "country_code" : "HT",
        "country_en" : "Haiti",
        "country_cn" : "海地",
        "phone_code" : 509
    },
    {
        "country_code" : "KR",
        "country_en" : "South Korea",
        "country_cn" : "韩国",
        "phone_code" : 82
    },
    {
        "country_code" : "NL",
        "country_en" : "Netherlands",
        "country_cn" : "荷兰",
        "phone_code" : 31
    },
    {
        "country_code" : "BQ",
        "country_en" : "Bonaire, Sint Eustatius and Saba",
        "country_cn" : "荷兰加勒比区",
        "phone_code" : 599
    },
    {
        "country_code" : "ME",
        "country_en" : "Montenegro",
        "country_cn" : "黑山共和国",
        "phone_code" : 382
    },
    {
        "country_code" : "HN",
        "country_en" : "Honduras",
        "country_cn" : "洪都拉斯",
        "phone_code" : 504
    },
    {
        "country_code" : "KI",
        "country_en" : "Kiribati",
        "country_cn" : "基里巴斯",
        "phone_code" : 686
    },
    {
        "country_code" : "DJ",
        "country_en" : "Djibouti",
        "country_cn" : "吉布提",
        "phone_code" : 253
    },
    {
        "country_code" : "KG",
        "country_en" : "Kyrgyzstan",
        "country_cn" : "吉尔吉斯斯坦",
        "phone_code" : 996
    },
    {
        "country_code" : "GN",
        "country_en" : "Guinea",
        "country_cn" : "几内亚",
        "phone_code" : 224
    },
    {
        "country_code" : "GW",
        "country_en" : "Guinea-Bissau",
        "country_cn" : "几内亚比绍共和国",
        "phone_code" : 245
    },
    {
        "country_code" : "CA",
        "country_en" : "Canada",
        "country_cn" : "加拿大",
        "phone_code" : 1
    },
    {
        "country_code" : "GH",
        "country_en" : "Ghana",
        "country_cn" : "加纳",
        "phone_code" : 233
    },
    {
        "country_code" : "GA",
        "country_en" : "Gabon",
        "country_cn" : "加蓬共和国",
        "phone_code" : 241
    },
    {
        "country_code" : "KH",
        "country_en" : "Cambodia",
        "country_cn" : "柬埔寨",
        "phone_code" : 855
    },
    {
        "country_code" : "CZ",
        "country_en" : "Czech Republic",
        "country_cn" : "捷克",
        "phone_code" : 420
    },
    {
        "country_code" : "ZW",
        "country_en" : "Zimbabwe",
        "country_cn" : "津巴布韦",
        "phone_code" : 263
    },
    {
        "country_code" : "CM",
        "country_en" : "Cameroon",
        "country_cn" : "喀麦隆",
        "phone_code" : 237
    },
    {
        "country_code" : "QA",
        "country_en" : "Qatar",
        "country_cn" : "卡塔尔",
        "phone_code" : 974
    },
    {
        "country_code" : "KY",
        "country_en" : "Cayman Islands",
        "country_cn" : "开曼群岛",
        "phone_code" : 1345
    },
    {
        "country_code" : "KM",
        "country_en" : "Comoros",
        "country_cn" : "科摩罗",
        "phone_code" : 269
    },
    {
        "country_code" : "XK",
        "country_en" : "Kosovo",
        "country_cn" : "科索沃",
        "phone_code" : 381
    },
    {
        "country_code" : "CI",
        "country_en" : "Côte d'Ivoire",
        "country_cn" : "科特迪瓦",
        "phone_code" : 225
    },
    {
        "country_code" : "KW",
        "country_en" : "Kuwait",
        "country_cn" : "科威特",
        "phone_code" : 965
    },
    {
        "country_code" : "HR",
        "country_en" : "Croatia",
        "country_cn" : "克罗地亚",
        "phone_code" : 385
    },
    {
        "country_code" : "KE",
        "country_en" : "Kenya",
        "country_cn" : "肯尼亚",
        "phone_code" : 254
    },
    {
        "country_code" : "CK",
        "country_en" : "Cook Islands",
        "country_cn" : "库克群岛",
        "phone_code" : 682
    },
    {
        "country_code" : "CW",
        "country_en" : "Curaçao",
        "country_cn" : "库拉索",
        "phone_code" : 599
    },
    {
        "country_code" : "LV",
        "country_en" : "Latvia",
        "country_cn" : "拉脱维亚",
        "phone_code" : 371
    },
    {
        "country_code" : "LS",
        "country_en" : "Lesotho",
        "country_cn" : "莱索托",
        "phone_code" : 266
    },
    {
        "country_code" : "LA",
        "country_en" : "Laos",
        "country_cn" : "老挝",
        "phone_code" : 856
    },
    {
        "country_code" : "LB",
        "country_en" : "Lebanon",
        "country_cn" : "黎巴嫩",
        "phone_code" : 961
    },
    {
        "country_code" : "LT",
        "country_en" : "Lithuania",
        "country_cn" : "立陶宛",
        "phone_code" : 370
    },
    {
        "country_code" : "LR",
        "country_en" : "Liberia",
        "country_cn" : "利比里亚",
        "phone_code" : 231
    },
    {
        "country_code" : "LY",
        "country_en" : "Libya",
        "country_cn" : "利比亞",
        "phone_code" : 218
    },
    {
        "country_code" : "LI",
        "country_en" : "Liechtenstein",
        "country_cn" : "列支敦士登",
        "phone_code" : 423
    },
    {
        "country_code" : "RE",
        "country_en" : "Réunion",
        "country_cn" : "留尼汪",
        "phone_code" : 262
    },
    {
        "country_code" : "LU",
        "country_en" : "Luxembourg",
        "country_cn" : "卢森堡",
        "phone_code" : 352
    },
    {
        "country_code" : "RW",
        "country_en" : "Rwanda",
        "country_cn" : "卢旺达",
        "phone_code" : 250
    },
    {
        "country_code" : "MG",
        "country_en" : "Madagascar",
        "country_cn" : "马达加斯加",
        "phone_code" : 261
    },
    {
        "country_code" : "IM",
        "country_en" : "Isle Of Man",
        "country_cn" : "马恩岛",
        "phone_code" : 44
    },
    {
        "country_code" : "MV",
        "country_en" : "Maldives",
        "country_cn" : "马尔代夫",
        "phone_code" : 960
    },
    {
        "country_code" : "MT",
        "country_en" : "Malta",
        "country_cn" : "马耳他",
        "phone_code" : 356
    },
    {
        "country_code" : "MW",
        "country_en" : "Malawi",
        "country_cn" : "马拉维",
        "phone_code" : 265
    },
    {
        "country_code" : "MY",
        "country_en" : "Malaysia",
        "country_cn" : "马来西亚",
        "phone_code" : 60
    },
    {
        "country_code" : "ML",
        "country_en" : "Mali",
        "country_cn" : "马里",
        "phone_code" : 223
    },
    {
        "country_code" : "MK",
        "country_en" : "Macedonia",
        "country_cn" : "马其顿",
        "phone_code" : 389
    },
    {
        "country_code" : "MH",
        "country_en" : "Marshall Islands",
        "country_cn" : "马绍尔群岛",
        "phone_code" : 692
    },
    {
        "country_code" : "MQ",
        "country_en" : "Martinique",
        "country_cn" : "马提尼克",
        "phone_code" : 596
    },
    {
        "country_code" : "YT",
        "country_en" : "Mayotte",
        "country_cn" : "马约特",
        "phone_code" : 262
    },
    {
        "country_code" : "MU",
        "country_en" : "Mauritius",
        "country_cn" : "毛里求斯",
        "phone_code" : 230
    },
    {
        "country_code" : "MR",
        "country_en" : "Mauritania",
        "country_cn" : "毛里塔尼亚",
        "phone_code" : 222
    },
    {
        "country_code" : "US",
        "country_en" : "United States",
        "country_cn" : "美国",
        "phone_code" : 1
    },
    {
        "country_code" : "AS",
        "country_en" : "American Samoa",
        "country_cn" : "美属萨摩亚",
        "phone_code" : 1684
    },
    {
        "country_code" : "VI",
        "country_en" : "US Virgin Islands",
        "country_cn" : "美属维京群岛",
        "phone_code" : 1340
    },
    {
        "country_code" : "MN",
        "country_en" : "Mongolia",
        "country_cn" : "蒙古",
        "phone_code" : 976
    },
    {
        "country_code" : "MS",
        "country_en" : "Montserrat",
        "country_cn" : "蒙特塞拉特",
        "phone_code" : 1664
    },
    {
        "country_code" : "BD",
        "country_en" : "Bangladesh",
        "country_cn" : "孟加拉国",
        "phone_code" : 880
    },
    {
        "country_code" : "PE",
        "country_en" : "Peru",
        "country_cn" : "秘鲁",
        "phone_code" : 51
    },
    {
        "country_code" : "FM",
        "country_en" : "Federated States of Micronesia",
        "country_cn" : "密克罗尼西亚联邦",
        "phone_code" : 691
    },
    {
        "country_code" : "MM",
        "country_en" : "Myanmar",
        "country_cn" : "缅甸",
        "phone_code" : 95
    },
    {
        "country_code" : "MD",
        "country_en" : "Moldova",
        "country_cn" : "摩尔多瓦",
        "phone_code" : 373
    },
    {
        "country_code" : "MA",
        "country_en" : "Morocco",
        "country_cn" : "摩洛哥",
        "phone_code" : 212
    },
    {
        "country_code" : "MC",
        "country_en" : "Monaco",
        "country_cn" : "摩纳哥",
        "phone_code" : 377
    },
    {
        "country_code" : "MZ",
        "country_en" : "Mozambique",
        "country_cn" : "莫桑比克",
        "phone_code" : 258
    },
    {
        "country_code" : "MX",
        "country_en" : "Mexico",
        "country_cn" : "墨西哥",
        "phone_code" : 52
    },
    {
        "country_code" : "NA",
        "country_en" : "Namibia",
        "country_cn" : "纳米比亚",
        "phone_code" : 264
    },
    {
        "country_code" : "ZA",
        "country_en" : "South Africa",
        "country_cn" : "南非",
        "phone_code" : 27
    },
    {
        "country_code" : "SS",
        "country_en" : "South Sudan",
        "country_cn" : "南苏丹",
        "phone_code" : 211
    },
    {
        "country_code" : "NR",
        "country_en" : "Nauru",
        "country_cn" : "瑙鲁",
        "phone_code" : 674
    },
    {
        "country_code" : "NI",
        "country_en" : "Nicaragua",
        "country_cn" : "尼加拉瓜",
        "phone_code" : 505
    },
    {
        "country_code" : "NP",
        "country_en" : "Nepal",
        "country_cn" : "尼泊尔",
        "phone_code" : 977
    },
    {
        "country_code" : "NE",
        "country_en" : "Niger",
        "country_cn" : "尼日尔",
        "phone_code" : 227
    },
    {
        "country_code" : "NG",
        "country_en" : "Nigeria",
        "country_cn" : "尼日利亚",
        "phone_code" : 234
    },
    {
        "country_code" : "NU",
        "country_en" : "Niue",
        "country_cn" : "纽埃",
        "phone_code" : 683
    },
    {
        "country_code" : "NO",
        "country_en" : "Norway",
        "country_cn" : "挪威",
        "phone_code" : 47
    },
    {
        "country_code" : "NF",
        "country_en" : "Norfolk Island",
        "country_cn" : "诺福克群岛",
        "phone_code" : 672
    },
    {
        "country_code" : "PT",
        "country_en" : "Portugal",
        "country_cn" : "葡萄牙",
        "phone_code" : 351
    },
    {
        "country_code" : "JP",
        "country_en" : "Japan",
        "country_cn" : "日本",
        "phone_code" : 81
    },
    {
        "country_code" : "SE",
        "country_en" : "Sweden",
        "country_cn" : "瑞典",
        "phone_code" : 46
    },
    {
        "country_code" : "CH",
        "country_en" : "Switzerland",
        "country_cn" : "瑞士",
        "phone_code" : 41
    },
    {
        "country_code" : "SV",
        "country_en" : "El Salvador",
        "country_cn" : "萨尔瓦多",
        "phone_code" : 503
    },
    {
        "country_code" : "WS",
        "country_en" : "Samoa",
        "country_cn" : "萨摩亚",
        "phone_code" : 685
    },
    {
        "country_code" : "RS",
        "country_en" : "Serbia",
        "country_cn" : "塞尔维亚",
        "phone_code" : 381
    },
    {
        "country_code" : "SL",
        "country_en" : "Sierra Leone",
        "country_cn" : "塞拉利昂",
        "phone_code" : 232
    },
    {
        "country_code" : "SN",
        "country_en" : "Senegal",
        "country_cn" : "塞内加尔",
        "phone_code" : 221
    },
    {
        "country_code" : "CY",
        "country_en" : "Cyprus",
        "country_cn" : "塞浦路斯",
        "phone_code" : 357
    },
    {
        "country_code" : "SC",
        "country_en" : "Seychelles",
        "country_cn" : "塞舌尔",
        "phone_code" : 248
    },
    {
        "country_code" : "SA",
        "country_en" : "Saudi Arabia",
        "country_cn" : "沙特阿拉伯",
        "phone_code" : 966
    },
    {
        "country_code" : "BL",
        "country_en" : "Saint Barthélemy",
        "country_cn" : "圣巴泰勒米",
        "phone_code" : 590
    },
    {
        "country_code" : "ST",
        "country_en" : "Sao Tome and Principe",
        "country_cn" : "圣多美和普林西比民主共和国",
        "phone_code" : 239
    },
    {
        "country_code" : "SH",
        "country_en" : "Saint Helena",
        "country_cn" : "圣赫勒拿",
        "phone_code" : 290
    },
    {
        "country_code" : "KN",
        "country_en" : "Saint Kitts and Nevis",
        "country_cn" : "圣基茨和尼维斯",
        "phone_code" : 1869
    },
    {
        "country_code" : "LC",
        "country_en" : "Saint Lucia",
        "country_cn" : "圣卢西亚",
        "phone_code" : 1758
    },
    {
        "country_code" : "MF",
        "country_en" : "Saint Martin",
        "country_cn" : "法属圣马丁",
        "phone_code" : 590
    },
    {
        "country_code" : "SX",
        "country_en" : "Sint Maarten",
        "country_cn" : "荷属圣马丁",
        "phone_code" : 599
    },
    {
        "country_code" : "SM",
        "country_en" : "San Marino",
        "country_cn" : "圣马力诺",
        "phone_code" : 378
    },
    {
        "country_code" : "VC",
        "country_en" : "Saint Vincent and the Grenadines",
        "country_cn" : "圣文森特和格林纳丁斯",
        "phone_code" : 1784
    },
    {
        "country_code" : "LK",
        "country_en" : "Sri Lanka",
        "country_cn" : "斯里兰卡",
        "phone_code" : 94
    },
    {
        "country_code" : "SK",
        "country_en" : "Slovakia",
        "country_cn" : "斯洛伐克",
        "phone_code" : 421
    },
    {
        "country_code" : "SI",
        "country_en" : "Slovenia",
        "country_cn" : "斯洛文尼亚",
        "phone_code" : 386
    },
    {
        "country_code" : "SZ",
        "country_en" : "Swaziland",
        "country_cn" : "斯威士兰",
        "phone_code" : 268
    },
    {
        "country_code" : "SD",
        "country_en" : "Sudan",
        "country_cn" : "苏丹",
        "phone_code" : 249
    },
    {
        "country_code" : "SR",
        "country_en" : "Suriname",
        "country_cn" : "苏里南",
        "phone_code" : 597
    },
    {
        "country_code" : "SB",
        "country_en" : "Solomon Islands",
        "country_cn" : "所罗门群岛",
        "phone_code" : 677
    },
    {
        "country_code" : "SO",
        "country_en" : "Somalia",
        "country_cn" : "索马里",
        "phone_code" : 252
    },
    {
        "country_code" : "TJ",
        "country_en" : "Tajikistan",
        "country_cn" : "塔吉克斯坦",
        "phone_code" : 992
    },
    {
        "country_code" : "TW",
        "country_en" : "Taiwan",
        "country_cn" : "台湾",
        "phone_code" : 886
    },
    {
        "country_code" : "TH",
        "country_en" : "Thailand",
        "country_cn" : "泰国",
        "phone_code" : 66
    },
    {
        "country_code" : "TZ",
        "country_en" : "Tanzania",
        "country_cn" : "坦桑尼亚",
        "phone_code" : 255
    },
    {
        "country_code" : "TO",
        "country_en" : "Tonga",
        "country_cn" : "汤加",
        "phone_code" : 676
    },
    {
        "country_code" : "TC",
        "country_en" : "Turks and Caicos Islands",
        "country_cn" : "特克斯和凯科斯群岛",
        "phone_code" : 1649
    },
    {
        "country_code" : "TT",
        "country_en" : "Trinidad and Tobago",
        "country_cn" : "特立尼达和多巴哥",
        "phone_code" : 1868
    },
    {
        "country_code" : "TN",
        "country_en" : "Tunisia",
        "country_cn" : "突尼斯",
        "phone_code" : 216
    },
    {
        "country_code" : "TV",
        "country_en" : "Tuvalu",
        "country_cn" : "图瓦卢",
        "phone_code" : 688
    },
    {
        "country_code" : "TR",
        "country_en" : "Turkey",
        "country_cn" : "土耳其",
        "phone_code" : 90
    },
    {
        "country_code" : "TM",
        "country_en" : "Turkmenistan",
        "country_cn" : "土库曼斯坦",
        "phone_code" : 993
    },
    {
        "country_code" : "TK",
        "country_en" : "Tokelau",
        "country_cn" : "托克劳",
        "phone_code" : 690
    },
    {
        "country_code" : "WF",
        "country_en" : "Wallis and Futuna",
        "country_cn" : "瓦利斯和富图纳",
        "phone_code" : 681
    },
    {
        "country_code" : "VU",
        "country_en" : "Vanuatu",
        "country_cn" : "瓦努阿图",
        "phone_code" : 678
    },
    {
        "country_code" : "GT",
        "country_en" : "Guatemala",
        "country_cn" : "危地马拉",
        "phone_code" : 502
    },
    {
        "country_code" : "VE",
        "country_en" : "Venezuela",
        "country_cn" : "委内瑞拉",
        "phone_code" : 58
    },
    {
        "country_code" : "BN",
        "country_en" : "Brunei",
        "country_cn" : "文莱",
        "phone_code" : 673
    },
    {
        "country_code" : "UG",
        "country_en" : "Uganda",
        "country_cn" : "乌干达",
        "phone_code" : 256
    },
    {
        "country_code" : "UA",
        "country_en" : "Ukraine",
        "country_cn" : "乌克兰",
        "phone_code" : 380
    },
    {
        "country_code" : "UY",
        "country_en" : "Uruguay",
        "country_cn" : "乌拉圭",
        "phone_code" : 598
    },
    {
        "country_code" : "UZ",
        "country_en" : "Uzbekistan",
        "country_cn" : "乌兹别克斯坦",
        "phone_code" : 998
    },
    {
        "country_code" : "GR",
        "country_en" : "Greece",
        "country_cn" : "希腊",
        "phone_code" : 30
    },
    {
        "country_code" : "ES",
        "country_en" : "Spain",
        "country_cn" : "西班牙",
        "phone_code" : 34
    },
    {
        "country_code" : "EH",
        "country_en" : "Western Sahara",
        "country_cn" : "西撒哈拉",
        "phone_code" : 212
    },
    {
        "country_code" : "HK",
        "country_en" : "Hong Kong",
        "country_cn" : "中国香港特别行政区",
        "phone_code" : 852
    },
    {
        "country_code" : "SG",
        "country_en" : "Singapore",
        "country_cn" : "新加坡",
        "phone_code" : 65
    },
    {
        "country_code" : "NC",
        "country_en" : "New Caledonia",
        "country_cn" : "新喀里多尼亚",
        "phone_code" : 687
    },
    {
        "country_code" : "NZ",
        "country_en" : "New Zealand",
        "country_cn" : "新西兰",
        "phone_code" : 64
    },
    {
        "country_code" : "HU",
        "country_en" : "Hungary",
        "country_cn" : "匈牙利",
        "phone_code" : 36
    },
    {
        "country_code" : "SY",
        "country_en" : "Syria",
        "country_cn" : "叙利亚",
        "phone_code" : 963
    },
    {
        "country_code" : "JM",
        "country_en" : "Jamaica",
        "country_cn" : "牙买加",
        "phone_code" : 1876
    },
    {
        "country_code" : "AM",
        "country_en" : "Armenia",
        "country_cn" : "亚美尼亚",
        "phone_code" : 374
    },
    {
        "country_code" : "YE",
        "country_en" : "Yemen",
        "country_cn" : "也门",
        "phone_code" : 967
    },
    {
        "country_code" : "IQ",
        "country_en" : "Iraq",
        "country_cn" : "伊拉克",
        "phone_code" : 964
    },
    {
        "country_code" : "IR",
        "country_en" : "Iran",
        "country_cn" : "伊朗",
        "phone_code" : 98
    },
    {
        "country_code" : "IL",
        "country_en" : "Israel",
        "country_cn" : "以色列",
        "phone_code" : 972
    },
    {
        "country_code" : "IT",
        "country_en" : "Italy",
        "country_cn" : "意大利",
        "phone_code" : 39
    },
    {
        "country_code" : "IN",
        "country_en" : "India",
        "country_cn" : "印度",
        "phone_code" : 91
    },
    {
        "country_code" : "ID",
        "country_en" : "Indonesia",
        "country_cn" : "印度尼西亚",
        "phone_code" : 62
    },
    {
        "country_code" : "VG",
        "country_en" : "British Virgin Islands",
        "country_cn" : "英属维京群岛",
        "phone_code" : 1284
    },
    {
        "country_code" : "IO",
        "country_en" : "British Indian Ocean Territory",
        "country_cn" : "英属印度洋领地",
        "phone_code" : 246
    },
    {
        "country_code" : "JO",
        "country_en" : "Jordan",
        "country_cn" : "约旦",
        "phone_code" : 962
    },
    {
        "country_code" : "VN",
        "country_en" : "Vietnam",
        "country_cn" : "越南",
        "phone_code" : 84
    },
    {
        "country_code" : "ZM",
        "country_en" : "Zambia",
        "country_cn" : "赞比亚",
        "phone_code" : 260
    },
    {
        "country_code" : "JE",
        "country_en" : "Jersey",
        "country_cn" : "泽西岛",
        "phone_code" : 44
    },
    {
        "country_code" : "TD",
        "country_en" : "Chad",
        "country_cn" : "乍得",
        "phone_code" : 235
    },
    {
        "country_code" : "GI",
        "country_en" : "Gibraltar",
        "country_cn" : "直布罗陀",
        "phone_code" : 350
    },
    {
        "country_code" : "CL",
        "country_en" : "Chile",
        "country_cn" : "智利",
        "phone_code" : 56
    },
    {
        "country_code" : "CF",
        "country_en" : "Central African Republic",
        "country_cn" : "中非共和国",
        "phone_code" : 236
    },
    {
        "country_code" : "CN",
        "country_en" : "China",
        "country_cn" : "中国",
        "phone_code" : 86
    }
];
