/**
 *	colorful.js v0.1.0
 *	author by So Aanyip
 *  10th Jan 2015
 */

/**
 * 启动方法
 * @param  {HTMLElement} element 接受变色的元素
 * @param  {array} array   变色依赖的关键颜色的二维数组，按rgb传入，ex: [[255,255,0],[0,220,220],[220,0,220]]
 * @param  {number} msec    完成一个变色阶段的时间（毫秒），即从array[i]变色到array[i+1]的时间。为了避免
 *                          闪烁伤害眼睛，msec不能小于400
 * @param  {string} isColor   如果要变色的是css的color属性，传入'color'
 * 
 */
function startLoop(element,array,msec,isColor){
	if(!element) return;
	if(!Number(msec)) msec=3000;
	if(msec<400) msec=400;
	var second = msec/1000;
	array = array || [[255,255,0],[0,220,220],[153,51,0]];
	for (var i = array.length - 1; i >= 0; i--) {
		array[i].length<3? array[i].length<2? array[i].length<1? array[i][0]=0:array[i][1]=0:array[i][2]=0:'';
		array[i][0]>255?array[i][0]=255:'';
		array[i][1]>255?array[i][1]=255:'';
		array[i][2]>255?array[i][2]=255:'';
		array[i][0]<0?array[i][0]=0:'';
		array[i][1]<0?array[i][1]=0:'';
		array[i][2]<0?array[i][2]=0:'';
	};
	var msg = {
		"array": array,
		"pointer":0,
		"len": array.length,
		"page":element,
		"msec":msec,
		"second":second
	}
	if(isColor === 'color'){
		msg.color = 'color';
	}
	var IEver = getIEVer();
	if(IEver <10 && IEver !== 0){
		loopColorForIe(msg);
	}else{
		loopColor(msg);
	}
}
/**
 * 进行颜色渐变。使用css3的transition属性。
 * @param  {Object} msg 包转好的所需属性
 * 
 */
function loopColor(msg){
	msg.page.style['transition']='all '+msg.second+'s linear';
	msg.page.style['-o-transition']='all '+msg.second+'s linear';
	msg.page.style['-webkit-transition']='all '+msg.second+'s linear';
	msg.page.style['-moz-transition']='all '+msg.second+'s linear';
	if(!msg.color){
		msg.page.style.backgroundColor='rgb('+msg.array[msg.pointer]+')';
		var interval = setInterval(function(){
			msg.pointer===msg.array.length-1? msg.pointer=0:msg.pointer++;
			msg.page.style.backgroundColor='rgb('+msg.array[msg.pointer]+')';
		},msg.msec);
	}else{
		msg.page.style.color='rgb('+msg.array[msg.pointer]+')';
		var interval = setInterval(function(){
			msg.pointer===msg.array.length-1? msg.pointer=0:msg.pointer++;
			msg.page.style.color='rgb('+msg.array[msg.pointer]+')';
		},msg.msec);
	}
}
/**
 * 为低版本浏览器进行颜色渐变。使用javascript定时器进行。
 * @param  {Object} msg 包转好的所需属性
 * 
 */
function loopColorForIe(msg){
	var pointer = msg.pointer;
	var r = msg.array[pointer][0];
	var g = msg.array[pointer][1];
	var b = msg.array[pointer][2];
	if(!msg.page.style.backgroundColor && !msg.color){
		toBGColor(0,0,0,msg.page);
	}else if(!msg.page.style.color && msg.color){
		toColor(0,0,0,msg.page);
	}
	if(!msg.color){
		var oldColor = msg.page.style.backgroundColor.substring(4);
	}else{
		var oldColor = msg.page.style.color.substring(4);
	}
	oldColor=oldColor.substring(0,oldColor.indexOf(')'));
	var old_rgb = oldColor.split(',');
	var old_r = parseInt(old_rgb[0]);
	var old_g = parseInt(old_rgb[1]);
	var old_b = parseInt(old_rgb[2]);

	var count=0;
	var max = 0;
	Math.abs(r-old_r)>Math.abs(g-old_g)?
		Math.abs(r-old_r)>Math.abs(b-old_b)? max=Math.abs(r-old_r) : max=Math.abs(b-old_b) :
		Math.abs(g-old_g)>Math.abs(b-old_b)? max=Math.abs(g-old_g) : max=Math.abs(b-old_b) ;

	var msec = msg.msec/max;
	var interval = setInterval(function(){
		if(count==max){
			clearInterval(interval);
			msg.pointer===msg.len-1? msg.pointer=0:msg.pointer++;
			loopColorForIe(msg);
		}
		if(!msg.color){
			toBGColor(old_r,old_g,old_b,msg.page);
		}else{
			toColor(old_r,old_g,old_b,msg.page);
		}

		r>old_r? old_r++: r<old_r?old_r--:'';
		g>old_g? old_g++: g<old_g?old_g--:'';
		b>old_b? old_b++: b<old_b?old_b--:'';
		count++;
	},msec);
}
/**
 * 改变背景颜色
 * @param  {number} r    red
 * @param  {number} g    green
 * @param  {number} b    blue
 * @param  {HTMLElement} page 进行变色的元素
 * 
 */
function toBGColor(r,g,b,page){
	page.style.backgroundColor='rgb('+r+','+g+','+b+')';
}
/*改变color颜色*/
function toColor(r,g,b,page){
	page.style.color='rgb('+r+','+g+','+b+')';
}
/*判断浏览器版本*/
function getIEVer() {
	var ua = navigator.userAgent;
	var b = ua.indexOf("MSIE"); 
	if (b < 0) {
		return 0;
 	}
	return parseFloat(ua.substring(b + 5, ua.indexOf(";", b)));
}