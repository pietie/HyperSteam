"use strict";
var toastr = require('toastr');
var Util = (function () {
    function Util() {
    }
    Util.Info = function (msg, title) {
        toastr.info(msg, title);
    };
    Util.Success = function (msg, title) {
        toastr.success(msg, title);
    };
    Util.InfoDialog = function (msg, title) {
        if (!title)
            title = "";
        alert("Info:" + msg);
        // BootstrapDialog.alert({
        //     title: title,
        //     message: msg,
        //     type: BootstrapDialog.TYPE_INFO,
        //     closable: true,
        //     draggable: true,
        //     buttonLabel: 'Close'
        // });
    };
    Util.Confirm = function (msg, title, okayButtonLabel) {
        return new Promise(function (resolve, reject) {
            alert("Confirmation dialog:" + msg);
            // BootstrapDialog.show({
            //     title: title ? title : "Confirm action",
            //     message: msg,
            //     buttons: [{
            //         label: okayButtonLabel ? okayButtonLabel : "Confirm",
            //         cssClass: 'btn-primary',
            //         hotkey: 13,
            //         action: (dialogItself) => {
            //             dialogItself.close();
            //             resolve();
            //         }
            //     }
            //         , {
            //             label: 'Cancel',
            //             action: function (dialogItself) { dialogItself.close(); reject(); }
            //         }]
            // });
        });
    };
    return Util;
}());
var ApiResponseEndThenChain = (function () {
    function ApiResponseEndThenChain() {
    }
    return ApiResponseEndThenChain;
}());
function fetchCatch(ex) {
    if (ex instanceof ApiResponseEndThenChain) {
        ex.handled = true; //?
        // handle special case where we just threw and exception(ApiResponseEndThenChain) to end any remaining 'thens' on the promise.
        // we have to rethrow to prevent any additional '.then' callbacks from being executed
        throw ex;
    }
    alert("ALERT 1: " + ex.toString());
    // BootstrapDialog.alert({
    //     title: "fetch failed",
    //     message: ex.toString(),
    //     type: BootstrapDialog.TYPE_DANGER,
    //     closable: true,
    //     draggable: true,
    //     buttonLabel: 'Close',
    //     callback: function (result) {
    //         // result will be true if button was click, while it will be false if users close the dialog directly.
    //         //alert('Result is: ' + result);
    //     }
    // });
}
function checkHttpStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    else {
        //!            if (response.status == 0) return response;
        var error = new Error(response.statusText);
        error.response = response;
        console.dir(response);
        alert("ALERT 2:" + error.toString() + ";" + response.status);
        // BootstrapDialog.alert({
        //     title: "HTTP " + response.status,
        //     message: error.toString(),
        //     type: BootstrapDialog.TYPE_DANGER,
        //     closable: true,
        //     draggable: true,
        //     buttonLabel: 'Close',
        //     callback: function (result) {
        //         // result will be true if button was click, while it will be false if users close the dialog directly.
        //         //alert('Result is: ' + result);
        //     }
        // });
        throw new ApiResponseEndThenChain();
    }
}
function parseJSON(response) {
    return response.json().then(function (json) {
        // if still a string after parsing once...
        if (typeof (json) === "string" && json.startsWith("{"))
            return JSON.parse(json);
        return json;
    });
}
function fetchJson(url, init) {
    var ret = fetch(url, init)
        .then(checkHttpStatus)
        .then(parseJSON)
        .catch(fetchCatch);
    return ret;
}
exports.fetchJson = fetchJson;
function postJson(url, init) {
    var defaults = {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    var settings = $.extend(defaults, init);
    var ret = fetch(url, settings)
        .then(checkHttpStatus)
        .then(parseJSON)
        .catch(fetchCatch);
    return ret;
}
exports.postJson = postJson;
function putJson(url, init) {
    var defaults = {
        method: "put",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    var settings = $.extend(defaults, init);
    var ret = fetch(url, settings)
        .then(checkHttpStatus)
        .then(parseJSON)
        .catch(fetchCatch);
    return ret;
}
exports.putJson = putJson;
function deleteJson(url, init) {
    var defaults = {
        method: "delete",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };
    var settings = $.extend(defaults, init);
    var ret = fetch(url, settings)
        .then(checkHttpStatus)
        .then(parseJSON)
        .catch(fetchCatch);
    return ret;
}
exports.deleteJson = deleteJson;
var Info = Util.Info;
exports.Info = Info;
var InfoDialog = Util.InfoDialog;
exports.InfoDialog = InfoDialog;
var Success = Util.Success;
exports.Success = Success;
var Confirm = Util.Confirm;
exports.Confirm = Confirm;
