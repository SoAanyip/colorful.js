colorful.js
===================================
让HTML元素具有自定义的颜色变幻背景
----------------------------------- 
[观看演示页面](http://soaanyip.github.io/#/colorful)
----------------------------------- 
### v0.3.0  
### author by So Aanyip

		colorful.js可以通过用户自定义关键帧的颜色，通过css3的transition实现颜色渐变功能。在低版本浏览器会通过javascript来实现。

		最简单用法：
		startLoop(document.getElementById('page'));


		function startLoop(element,array,msec,attr)
		@param  {HTMLElement} element 接受变色的元素
		@param  {array} array   变色依赖的关键颜色的二维数组，按rgb传入，ex: [[255,255,0],[0,220,220],[220,0,220]]	
		@param  {number} msec    完成一个变色阶段的时间（毫秒），即从array[i]变色到array[i+1]的时间。为了避免
		                         闪烁伤害眼睛，msec不能小于400
		@param  {string} attr   如果要变色的是css的其他属性，传入属性的名字，如'color'
	
