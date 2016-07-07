//onscroll in opposite direction, cancel auto scroll.

function $(id){
	return document.getElementById(id);
}

var Pager={
	to:0,
	prev:null,
	name_map: [null, 'about', 'accuracy', 'services', 'faq', 'contact'],

	scroll:function(pagenum){
		var menu_list = $('menu-list');
		menu_list.classList.add('hide-mobile');

		this.prev = document.documentElement.scrollTop || document.body.scrollTop;
		// document.documentElement.scrollTop=1;
		document.body.scrollTop = 1;

		if (document.body.scrollTop != 0)
			var ele = document.body;
		else
			var ele = document.documentElement;

		ele.scrollTop = this.prev;

		var total=$("home").clientHeight, pages=document.getElementsByClassName("page");
		for(var i=0, y=pagenum-1;i<y;i++)
			total += pages[i].clientHeight;

		this.to = total;

		// for spam clicking
		var interval1, interval2;
		clearInterval(interval1);
		clearInterval(interval2);

		if(ele.scrollTop < total){ // scroll down
			interval1 = setInterval(function(){
				if(ele.scrollTop >= Pager.to || (ele.scrollHeight - ele.scrollTop) == ele.clientHeight)
					clearInterval(interval1);
				else
					ele.scrollTop += ((Pager.to - ele.scrollTop) * 0.1) + 3;
			},30);
		}
		else if(ele.scrollTop > total){ // scroll up
			interval2=setInterval(function(){
				if(ele.scrollTop <= Pager.to)
					clearInterval(interval2);
				else
					ele.scrollTop -= ((ele.scrollTop - Pager.to) * 0.1) + 3;
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

var sharableUrl = _.debounce(function() {
	var prev = document.documentElement.scrollTop || document.body.scrollTop;
	document.body.scrollTop = 1;

	if (document.body.scrollTop != 0)
		var ele = document.body;
	else
		var ele = document.documentElement;

	ele.scrollTop = prev;

	var total=$("home").clientHeight;
	var pages=document.getElementsByClassName("page");
	var header_height = $('header').clientHeight;
	for(var i=0, y=pages.length;i<=y;i++){
		if(ele.scrollTop + header_height <= total){
			if(i == 0){
				if(history.replaceState)
					history.replaceState('', document.title, window.location.pathname);
				else
					location.hash = '';
			}
			else
				location.hash = Pager.name_map[i];

			break;
		}
		total += pages[i].clientHeight;
	}

}, 400);

function checkUrl(){
	var hash = (location.hash[0] == '#') ? location.hash.slice(1) : location.hash;
	var pagenum = Pager.name_map.indexOf(hash);
	if(pagenum > 0)
		Pager.scroll(pagenum);
}

var prev_open, interval = null
function checkOpenClosed(){
	var datetime = new Date(2016, 6, 4, 16, 0);
	var day_of_week = datetime.getDay();
	if(day_of_week !== 0){
		var hour = datetime.getHours();
		var open = hour > 7 && hour < 18;
	}
	else{
		var open = false;
	}

	if(prev_open == null || prev_open != open){
		var ele = $('open-closed');
		ele.innerHTML = (open) ? 'Open' : 'Closed';
		ele.className = (open) ? 'open-hours' : 'closed-hours';
		prev_open = open;
	}

	interval = interval || setInterval(checkOpenClosed, 60000);
}

function addNavClicks(){
	var items = $('menu-list').getElementsByTagName('span');
	for(var i=0, y=items.length;i<y;i++)
		items[i].addEventListener('click', _.bind(Pager.scroll, Pager, i+1), true);
}

window.addEventListener('DOMContentLoaded', function(){
	addNavClicks();
	$("menu").addEventListener("click", Toggle.menu, false);
	$("close-popup").addEventListener("click", Toggle.closePopup, false);
	addQAClicks();
	checkUrl();
	checkOpenClosed();
	window.addEventListener('scroll', sharableUrl, false);
}, false)

window.addEventListener('load', function(){
	googleTranslateElementInit();
}, false);
