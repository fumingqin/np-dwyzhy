var globalData = {
    noSearchData: '没有符合的数据!',
    timeoutMsg: '加载超时，请检查网络是否畅通！',
    loadTimeOut: 20000,
}
//保存对象类型的数据到本地,传入的是对象类型
function SetSessionStorageObjectData(key,object) {

    sessionStorage.setItem(key, JSON.stringify(object));

}

//读取对象类型的数据，得到的是对象
function GetSessionStorageObjectData(key) {

    return JSON.parse(sessionStorage.getItem(key));

}


//保存对象类型的数据到本地,传入的是对象类型
function SetLocalStorageObjectData(key, object) {

    localStorage.setItem(key, JSON.stringify(object));

}

//读取对象类型的数据，得到的是对象
function GetLocalStorageObjectData(key) {

    return JSON.parse(localStorage.getItem(key));

}

function CheckHaveSecret_Key() {

    if (!GetLocalStorageObjectData('AirportInfo')) {
        location.href = "insertSecret_Key.htm";
    }

}

function CheckHavedLogin() {

    if (!GetLocalStorageObjectData('userMap')) { //得到登录用户的信息
        location.href = "Login.htm";
    }

}

//这是为了实现列表界面点击li后返回的时候回到上次点击的位置
function RememberScrollTopPosition() {

    //        alert($('.content').scrollTop());
    //        $('.content').scrollTop(0);

    //记住当前content的滚动条滚动的位置，目的是为了点击li后返回到当前页面时定位到上次点击的li的位置
    sessionStorage.setItem("lastClickLiPosition", $('.content').scrollTop());

}

function SetScrollTopPosition() {

    //得到上次content的滚动条滚动的位置，定位到上次点击的li的位置
    $('.content').scrollTop(sessionStorage.getItem("lastClickLiPosition"));
}

function ReSetScrollTopPosition() {

    //设置content的滚动条滚动的位置为0
    sessionStorage.setItem("lastClickLiPosition", 0);
}


function Push_Last_IndexHtml(index) {

    var last_IndexHtml_Arr;

    last_IndexHtml_Arr = GetLocalStorageObjectData('last_IndexHtml_Arr');

    if (!last_IndexHtml_Arr) { //保存上一个访问界面的数组为空
        last_IndexHtml_Arr = new Array(); //创建一个数组
    }
    last_IndexHtml_Arr.push(index);

    SetLocalStorageObjectData('last_IndexHtml_Arr', last_IndexHtml_Arr);
}

function Pop_Last_IndexHtml() {

    var last_IndexHtml_Arr;

    last_IndexHtml_Arr = GetLocalStorageObjectData('last_IndexHtml_Arr');

    if (last_IndexHtml_Arr) { //保存上一个访问界面的数组不为空
        return last_IndexHtml_Arr.pop();
    }
    return null;
}



function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}

//var AndroidCallJsFunction = {
//    funFromjs: function () {
//        //alert('点击了返回键');
//        var currentUrl = window.location.pathname;  //得到当前页面的url

//        if (currentUrl.indexOf('Home/Index') > -1 || currentUrl.indexOf('Station/Import') > -1
//             || currentUrl.indexOf('LPR/LPRList') > -1 || currentUrl.indexOf('Driver/DriverSearch') > -1
//              || currentUrl.indexOf('Vehicle/VehicleSearch') > -1 || currentUrl.indexOf('Home/SwitchOff') > -1
//            || currentUrl.indexOf('Seat/Seat1') > -1) {
        
//            location.href = "/Home/Home";
//        }
//        else if (currentUrl.indexOf('FlightDynamics_Modify3.htm') > -1) {
//            location.href = "FlightDynamics.htm";
//        }
    
//    },
//    init: function () {

//    }

//}
//AndroidCallJsFunction.init();

