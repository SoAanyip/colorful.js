/**
 * colorful.js v0.3.0
 * author by So Aanyip
 * 11th Feb 2015
 */
(function(window){
    /*支持AMD规范*/
    if ( typeof define === "function" && define.amd) {
        define(function () { return startLoop; } );
    }else{
        window.startLoop = startLoop;
    }
    /**
     * 启动方法
     * @param  {HTMLElement} element 接受变色的元素
     * @param  {array} array   变色依赖的关键颜色的二维数组，按rgb传入，ex: [[255,255,0],[0,220,220],[220,0,220]]
     * @param  {number} msec    完成一个变色阶段的时间（毫秒），即从array[i]变色到array[i+1]的时间。为了避免
     *                          闪烁伤害眼睛，msec不能小于400
     * @param  {string} attr   如果要变色的是css的其他属性，传入属性的名字，如'color'
     * 
     */
    function startLoop(element,array,msec,attr){
        /*检测用户输入*/
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
        /*包装必要的信息*/
        var msg = {
            'array': array,
            'pointer':0,
            'len': array.length,
            'page':element,
            'msec':msec,
            'second':second,
            'sign':'backgroundColor'
        }
        /*如果改变的不是背景颜色*/
        if(attr) msg.sign = attr;
        /*判断是不是低版本(IE9-)浏览器*/
        var IEver = getIEVer();
        if(IEver <10 && IEver !== 0){
            msg.first = true;
            loopColorForIE(msg);
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
    /*初始化元素style中的transition属性*/
    if( !msg.page.style ) msg.page.style = {};
    msg.page.style['transition']='all '+msg.second+'s linear';
    msg.page.style['-o-transition']='all '+msg.second+'s linear';
    msg.page.style['-moz-transition']='all '+msg.second+'s linear';
    msg.page.style['-webkit-transition']='all '+msg.second+'s linear';

    /*起始色为array[0]*/
    msg.page.style[msg.sign]='rgb('+msg.array[msg.pointer]+')';
    /*设置定时器，每一个变色周期为定时器间隔，直接设置元素背景色为array[i+1]使transition属性生效*/
    var interval = setInterval(function(){
        msg.pointer===msg.array.length-1? msg.pointer=0:msg.pointer++;
        msg.page.style[msg.sign]='rgb('+msg.array[msg.pointer]+')';
    },msg.msec);
}
/**
 * 为低版本浏览器进行颜色渐变。使用javascript定时器进行。
 * @param  {Object} msg 包转好的所需属性
 * 
 */
function loopColorForIE(msg){
    /*现在时刻的颜色*/
    var old_r,old_g,old_b;
    /*进行ForIE的初始化*/
    if(msg.first){
        msg.first = false;
        /*如果没有设置行内起始色，设置起始色为黑色*/
        var oldColor = msg.page.style[msg.sign] || 'rgb(0,0,0)';
        /*拿到现在时刻的颜色*/
        oldColor = oldColor.substring(4,oldColor.indexOf(')'));
        var old_rgb = oldColor.split(',');
        old_r = parseInt(old_rgb[0]);
        old_g = parseInt(old_rgb[1]);
        old_b = parseInt(old_rgb[2]);
    }else{
        /*拿到现在时刻的颜色*/
        var lastPointer;
        msg.pointer === 0? lastPointer = msg.len-1 : lastPointer = msg.pointer-1;
        old_r = msg.array[lastPointer][0];
        old_g = msg.array[lastPointer][1];
        old_b = msg.array[lastPointer][2];
    }
    /*拿到这一变色周期最终颜色*/
    var r = msg.array[msg.pointer][0];
    var g = msg.array[msg.pointer][1];
    var b = msg.array[msg.pointer][2];

    var count=0; //每个变色周期定时器运行次数
    var max = 0; //每个变色周期定时器最大运行次数
    /*以三色中差值最大的一种颜色的差值作为最大运行次数*/
    Math.abs(r-old_r)>Math.abs(g-old_g)?
        Math.abs(r-old_r)>Math.abs(b-old_b)? max=Math.abs(r-old_r) : max=Math.abs(b-old_b) :
        Math.abs(g-old_g)>Math.abs(b-old_b)? max=Math.abs(g-old_g) : max=Math.abs(b-old_b) ;
    /*确定定时器运行间隔*/
    var msec = msg.msec/max;
    var interval = setInterval(function(){
        /*loopColorForIE的递归*/
        if(count==max){
            clearInterval(interval);
            msg.pointer===msg.len-1? msg.pointer=0:msg.pointer++;
            return loopColorForIE(msg);
        }
        /*改变颜色的函数调用*/
        msg.page.style[msg.sign]='rgb('+old_r+','+old_g+','+old_b+')';
        /*对现在时刻的rbg进行+-1*/
        r>old_r? old_r++: r<old_r?old_r--:'';
        g>old_g? old_g++: g<old_g?old_g--:'';
        b>old_b? old_b++: b<old_b?old_b--:'';
        count++;
    },msec);
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
})(window);
