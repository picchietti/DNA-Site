//onscroll in opposite direction, cancel auto scroll.

function $(id){
	return document.getElementById(id);
}

var Pager={
	to:0,
	prev:null,

	scroll:function(pagenum){
		var menu_list = $('menu-list');
		menu_list.classList.add('hide-mobile');

		this.prev=document.documentElement.scrollTop || document.body.scrollTop;
		// document.documentElement.scrollTop=1;
		document.body.scrollTop=1;

		if (document.body.scrollTop!=0)
			var ele = document.body;
		else
			var ele = document.documentElement;

		ele.scrollTop=this.prev;

		var total=$("home").clientHeight, pages=document.getElementsByClassName("page");
		for(var i=0;i<pagenum-1;i++)
			total+=pages[i].clientHeight;

		this.to=total;

		// for spam clicking
		var interval1,interval2;
		clearInterval(interval1);
		clearInterval(interval2);

		if(ele.scrollTop<total){ // scroll down
			interval1=setInterval(function(){
				if(ele.scrollTop>=Pager.to || (ele.scrollHeight - ele.scrollTop) == ele.clientHeight)
					clearInterval(interval1);
				else
					ele.scrollTop+=((Pager.to-ele.scrollTop)*.1)+3;
			},30);
		}
		else if(ele.scrollTop>total){ // scroll up
			interval2=setInterval(function(){
				if(ele.scrollTop<=Pager.to)
					clearInterval(interval2);
				else
					ele.scrollTop-=((ele.scrollTop-Pager.to)*.1)+3;
			},30);
		}
		else // equal. finished.
			return;
	},
};

function nextElement(el) {
    if (el.nextElementSibling) return el.nextElementSibling;
    do { el = el.nextSibling } while (el && el.nodeType !== 1);
    return el;
}

function addQAClicks(){
	y = document.getElementsByClassName('q');
	for(var i=0;i<y.length;i++){
		y[i].addEventListener('click', function(){
			var ans = nextElement(this);
			if(ans.style.display != 'block')
				ans.style.display = 'block';
			else
				ans.style.display = 'none';
		}, false)
	}
}

var Toggle = {
	menu: function(){
		var menu = $('menu-list');
		menu.classList.toggle('hide-mobile');
	},

	openPopup: function(service, info_id){
		var popup = $('service-info');
		$('service-name').innerHTML = service;
		$('service-data').innerHTML = $(info_id).innerHTML;
		popup.style.display = "flex";
	},

	closePopup: function(){
		var popup = $('service-info')
		popup.style.display = "none";
	}
};

function googleTranslateElementInit() {
	new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'ar,en,es,hi,it,pt,zh-CN', layout: google.translate.TranslateElement.InlineLayout.SIMPLE, autoDisplay: false}, 'google-translate-ele');
}

window.addEventListener('DOMContentLoaded', function(){
	$("menu").addEventListener("click", Toggle.menu, false);
	$("close-popup").addEventListener("click", Toggle.closePopup, false);
	addQAClicks();
}, false)

window.addEventListener('load', function(){
	googleTranslateElementInit();
}, false);
