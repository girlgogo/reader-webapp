(function(){
	var Util = (function(){
		var prefix = 'html5_reader_';
		var StorageGetter = function(key){
			return localStorage.getItem(prefix + key);
		}
		var StorageSetter = function(key,val){
			return localStorage.setItem(prefix + key,val);
		}
		return {
			StorageGetter:StorageGetter,
			StorageSetter:StorageSetter
		}
	})();

	var Dom = {
		top_nav : $("#top-nav"),
		bottom_nav: $('#bottom-nav'),
		night_day_switch_button:$('#day-botton'),
		font_container: $('#font-container'),
		font_button: $('#font-button'),
		day_button: $('#day-button'),
		night_button: $('#night-button'),
		bk_button: $('.bk-container')
	}
	var Win = $(window);
	var Doc = $(document);
	var RootContainer = $('#fiction-container');
	var initFontSize = Util.StorageGetter('font-size');
	initFontSize = parseInt(initFontSize);
	if(!initFontSize){
		initFontSize = 14;
	}
	RootContainer.css('font-size',initFontSize);



	function main(){
		//todo 整个项目的入口函数
		EventHanlder();
	}

	function ReaderModel (){
		//todo 实现和阅读器相关的数据交互的方法
	}

	function ReaderBaseFrame(){
		//todo 渲染基本的UI结构
	}

	function EventHanlder(){
		//todo 交互的事件绑定
		
		//中间唤醒操作区
		$('#action_mid').click(function(){
			// console.log('bjfbe'); 
			if(Dom.top_nav.css('display') == 'none'){
				Dom.bottom_nav.show();
				Dom.top_nav.show();
				// console.log('hjsdb');
			}else{
				Dom.bottom_nav.hide();
				Dom.top_nav.hide();
				Dom.font_container.hide();
				Dom.font_button.removeClass('current');
			}
		});

		//字体按钮点击事件
		Dom.font_button.click(function(){
			if(Dom.font_container.css('display') == 'none'){
				Dom.font_container.show();
				Dom.font_button.addClass('current');
			}else{
				Dom.font_container.hide();
				Dom.font_button.removeClass('current');
			}
		});

		//白天夜晚模式切换交互
		$('#light').click(function(){
			$(this).toggleClass('light-night-active');
			if($('#light').hasClass('light-night-active')){
				$('#root').removeClass('m-bg2').addClass('m-bg5');
			}else{
				$('#root').removeClass('m-bg5').addClass('m-bg2');
			}
		});

		//调整字体大小交互
		$('#large-font').click(function(){
			if(initFontSize > 20){
				return;
			}
			initFontSize += 1;
			RootContainer.css('font-size',initFontSize);
			Util.StorageSetter('font-size',initFontSize);
			console.log('bjkv');
		});

		$('#small-font').click(function(){
			if(initFontSize < 12){
				return;
			}
			initFontSize -= 1;
			RootContainer.css('font-size',initFontSize);
			Util.StorageSetter('font-size',initFontSize);
		});

		//切换背景
		$('#font-container .child-mod:last-child').on('click', function (e) {
			var $target =$(e.target),
				$current,
				$root,
				currentTheme,
				nextTheme;
			if ($target.attr('class').indexOf('bk-button') >= 0) {
				$current = $('.bk-container-current');
				$root = $('#root');
				currentTheme = $current.parent().data('theme');
				nextTheme = $target.data('theme');
				$root.attr('class', $root.attr('class').replace(currentTheme, nextTheme));
				$current.appendTo($target);
			}
		})
		
		//滚动事件
		Win.scroll(function(){
			Dom.bottom_nav.hide();
			Dom.top_nav.hide();
			Dom.font_container.hide();
			Dom.font_button.removeClass('current');
		});
	}
	main();
})();