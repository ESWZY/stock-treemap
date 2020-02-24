setInterval(function() {
    $(".currentTime").html(getTime())
}, 1000);

function getTime() {
    var date = new Date();
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strHour = date.getHours();
    var strMin = date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate
    }
    if (strHour >= 0 && strHour <= 9) {
        strHour = "0" + strHour
    }
    if (strMin >= 0 && strMin <= 9) {
        strMin = "0" + strMin
    }
    var currentdate = date.getFullYear() + "-" + month + "-" + strDate + " " +
        strHour + seperator2 + strMin;
    return currentdate
}