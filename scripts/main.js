function $(e){return document.getElementById(e)}function nextElement(e){if(e.nextElementSibling)return e.nextElementSibling;do e=e.nextSibling;while(e&&1!==e.nodeType);return e}function addQAClicks(){y=document.getElementsByClassName("q");for(var e=0;e<y.length;e++)y[e].addEventListener("click",function(){var e=nextElement(this);"block"!=e.style.display?e.style.display="block":e.style.display="none"},!1)}function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:"en",includedLanguages:"ar,en,es,hi,it,pt,zh-CN",layout:google.translate.TranslateElement.InlineLayout.SIMPLE,autoDisplay:!1},"google-translate-ele")}function checkUrl(){var e="#"==location.hash[0]?location.hash.slice(1):location.hash,n=Pager.name_map.indexOf(e);n>0&&Pager.scroll(n)}function checkOpenClosed(){var e=new Date,n=e.getDay();if(0!==n)var l=e.getHours(),o=l>7&&18>l;else var o=!1;if(null==prev_open||prev_open!=o){var t=$("open-closed");t.innerHTML=o?"Open":"Closed",t.className=o?"open-hours":"closed-hours",prev_open=o}interval=interval||setInterval(checkOpenClosed,6e4)}function addNavClicks(){for(var e=$("menu-list").getElementsByTagName("span"),n=0,l=e.length;l>n;n++)e[n].addEventListener("click",_.bind(Pager.scroll,Pager,n+1),!0)}var Pager={to:0,prev:null,name_map:[null,"about","accuracy","services","faq","contact"],scroll:function(e){var n=$("menu-list");if(n.classList.add("hide-mobile"),this.prev=document.documentElement.scrollTop||document.body.scrollTop,document.body.scrollTop=1,0!=document.body.scrollTop)var l=document.body;else var l=document.documentElement;l.scrollTop=this.prev;for(var o=$("home").clientHeight,t=document.getElementsByClassName("page"),a=0,r=e-1;r>a;a++)o+=t[a].clientHeight;this.to=o;var c,s;if(clearInterval(c),clearInterval(s),l.scrollTop<o)c=setInterval(function(){l.scrollTop>=Pager.to||l.scrollHeight-l.scrollTop==l.clientHeight?clearInterval(c):l.scrollTop+=.1*(Pager.to-l.scrollTop)+3},30);else{if(!(l.scrollTop>o))return;s=setInterval(function(){l.scrollTop<=Pager.to?clearInterval(s):l.scrollTop-=.1*(l.scrollTop-Pager.to)+3},30)}}},Toggle={menu:function(){var e=$("menu-list");e.classList.toggle("hide-mobile")},openPopup:function(e,n){var l=$("service-info");$("service-name").innerHTML=e,$("service-data").innerHTML=$(n).innerHTML,l.style.display="flex"},closePopup:function(){var e=$("service-info");e.style.display="none"}},sharableUrl=_.debounce(function(){var e=document.documentElement.scrollTop||document.body.scrollTop;if(document.body.scrollTop=1,0!=document.body.scrollTop)var n=document.body;else var n=document.documentElement;n.scrollTop=e;for(var l=$("home").clientHeight,o=document.getElementsByClassName("page"),t=$("header").clientHeight,a=0,r=o.length;r>=a;a++){if(n.scrollTop+t<=l){0==a?history.replaceState?history.replaceState("",document.title,window.location.pathname):location.hash="":location.hash=Pager.name_map[a];break}l+=o[a].clientHeight}},400),prev_open,interval=null;window.addEventListener("DOMContentLoaded",function(){addNavClicks(),$("menu").addEventListener("click",Toggle.menu,!1),$("close-popup").addEventListener("click",Toggle.closePopup,!1),addQAClicks(),checkUrl(),checkOpenClosed(),window.addEventListener("scroll",sharableUrl,!1)},!1),window.addEventListener("load",function(){googleTranslateElementInit()},!1);