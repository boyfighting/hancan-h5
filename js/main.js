// JavaScript Document
/*----------------------------- 
Name: Main Js
Author: PangWei
Time: 2015-05-
-----------------------------*/
// "use strict";

!function($){
	/* H5 begin */
	window.H5 = window.H5 || {};
	window.console = window.console || {
		log: function(){}
	}

	var clickevent = 'ontouchstart' in document.documentElement ? "touchend" : "click";
	var config = {
		name:'',
		version: 1.0,
		isCss3 : typeof(Worker) !== 'undefined',	//CSS3
		isWx : /micromessenger/i.test(window.navigator.userAgent)	//微信
	};

	//运行环境
	H5.isDevice = function(){
		var ua = window.navigator.userAgent;
		if(/micromessenger/i.test(ua)){
			return 'wx';
		}else if(/netease_news/i.test(ua) || /NewsApp/gi.test(ua)){
			return 'app';
		}else if(/android.*?mobile|ipod|blackberry|bb\d+|phone/i.test(ua)){
			return 'moblie';
		}
		return 'other';
	};
	
	H5.animShow = function(){

		$('[data-animation]').css({
			'-webkit-animation': 'none',
			'visibility': 'hidden'	// 解决部分 Android 机型 DOM 不自动重绘的 bug
		});

		$('.swiper-slide-active [data-animation]').each(function(index, element){
			var that = $(element),
				delay = that.attr('data-delay') ? that.attr('data-delay') : 0,
				timing	= that.attr('data-timing-function') || 'ease',
				duration = that.attr('data-duration') || 1,
				count = that.attr('data-count') || 1,
				animation = that.attr('data-animation');

			that.css({
				//'-webkit-animation': animation +' '+ duration + 's ' + timing + ' '+ delay + 's both',
				// 'display': 'inline-block',
				'visibility': 'visible',				
				// 为了兼容不支持贝塞尔曲线的动画，需要拆开写
				// 严格模式下不允许出现两个同名属性，所以不得已去掉 'use strict'~
				'-webkit-animation-name': animation,
				'-webkit-animation-duration': duration + 's',
				'-webkit-animation-timing-function': 'ease',
				'-webkit-animation-timing-function': timing,
				'-webkit-animation-delay': delay + 's',
				'-webkit-animation-iteration-count':count,
				'-webkit-animation-fill-mode': 'both'
			})
		})
	};

	//音乐
	H5.music = function(){
		$('body').append('<div class="music"></div>');
		$('.music').bind(clickevent,function(){
			var that = $(this);
			if(that.hasClass('stop')){
				$('.music').removeClass('stop');
				$('#audio')[0].play();
			}else{
				$('.music').addClass('stop');
				$('#audio')[0].pause();
			}
		});
				
		//兼容IOS音乐播放
		$("body").bind('touchstart',function(){
			$("#audio")[0].play();
			$(this).unbind();
		});
	};

	//PC等比缩放
	H5.bodySize = function(){
		var viewW = 640,viewH = 1008;
		var winW = $(window).width(),
			winH = $(window).height();

		$('.wrapper').width(viewW/(viewH/winH));
	};

	//分享
	H5.share = function(info){
		if(config.isWx){
			$('.share').bind(clickevent,function(){
				var $shade=$( ['<div class="share_tip"></div>'].join("\r\n")).appendTo( document.body );
				$shade.bind(clickevent,function(){$shade.remove()});
			});
		}else{
			$('.share').css('height',0);
			return false;
		}

		function shareFriend() {
			WeixinJSBridge.invoke('sendAppMessage',{
				"appid": info.appid,
				"img_url": info.imgUrl,
				"img_width": "300",
				"img_height": "300",
				"link": info.lineLink,
				"desc": info.descContent,
				"title": info.shareTitle
				}, function(res) {
				_report('send_msg', res.err_msg);
			})
		}
		function shareTimeline() {
			WeixinJSBridge.invoke('shareTimeline',{
				"img_url": info.imgUrl,
				"img_width": "300",
				"img_height": "300",
				"link": info.lineLink,
				"desc": info.descContent,
				"title": info.shareTitle
				}, function(res) {
				_report('timeline', res.err_msg);
			});
		}
		function shareWeibo() {
			WeixinJSBridge.invoke('shareWeibo',{
				"content": info.descContent,
				"url": info.lineLink,
				}, function(res) {
				_report('weibo', res.err_msg);
			});
		}
		// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
		document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
			// 发送给好友
			WeixinJSBridge.on('menu:share:appmessage', function(argv){shareFriend()});
			// 分享到朋友圈
			WeixinJSBridge.on('menu:share:timeline', function(argv){shareTimeline()});
			// 分享到微博
			WeixinJSBridge.on('menu:share:weibo', function(argv){shareWeibo()});
		}, false);
	};

}(Zepto);