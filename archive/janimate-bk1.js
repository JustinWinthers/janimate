(function compile() {

    var elems = document.getElementsByTagName('*'), i=0;

    for (i=0; i < elems.length; i++) {

        var style = elems[i].currentStyle || window.getComputedStyle(elems[i]);
        elems[i].animate = {};
        elems[i].animate.methodArray = [];
        elems[i].animate.active = false;
        elems[i].animate.origHeight = elems[i].clientHeight;
        elems[i].animate.origWidth = elems[i].clientWidth;
        elems[i].animate.origMarginTop = parseInt(style.marginTop.replace("px",""));

        setElem(elems[i]);
    }
})();

function setElem( el ){

    setElemsWithAttribute( el, 'animate' );
    setElemsWithAttributeClick( el, 'animate-click' );

}

function setElemsWithAttribute( el, attr, eventType, exitType ){

    var eventType = 'onmouseover';
    var exitType = 'onmouseout';

    setElemsEvent( el, attr, eventType, exitType );
}

function setElemsWithAttributeClick( el, attr, eventType, exitType ){

    var eventType = 'onclick';
    var exitType = 'onmouseout';

    setElemsEvent(el, attr, eventType, exitType);
}


function setElemsEvent( el, attr, eventType, exitType ){

    if (el.hasAttribute( attr )) {


        setTransitionProperties( el,'2s' );

        var val = el.getAttribute(attr).split(" ");

        el.animate.methodArray.push(val[0]);


        if (val.length) {

            el[eventType] = function(e){

                attachEventHandlers(e.target, val, 'active' )
            }

            el[exitType] = function(e){

                //console.log(exitType, ' / ', el.animate.methodArray, '/', val);

                attachEventHandlers(e.target, val, 'inactive' );

            }


        }


    }
}

function attachEventHandlers( el, val, type){

    for (i=0; i<val.length; i++){

        // if attribute has an argument capture what's between the parens
        var arg = (/\(([^)]+)\)/).exec(val[i]);

        if (arg) {

            //remove the parens
            val[i] = val[i].replace(/ *\([^)]*\) */g, "");

            //pass argument to function
            eval(val[i]) ( type, el, arg[1] )

        } else {

            eval(val[i])( type, el )
        }
    }

}

function spin(method, el, deg){

    if (deg){

        el.animate.spinDeg = deg;

    } else {

        if (!el.animate.spinDeg) el.animate.spinDeg = '180deg'
    }

    if (method==='active'){
        el.style.transform = "rotate(" + el.animate.spinDeg + ")";
        el.style.webkitTransform = "rotate(" + el.animate.spinDeg + ")";
    }

    if (method==='inactive'){
        el.style.transform = "rotate(0deg)";
        el.style.webkitTransform = "rotate(0deg)";
    }

}

function grow(method, el, pct){

    expand(method, el, pct);
}

function expand(method, el, pct){

    if (pct){

        //convert the string to an integer and remove the percent sign
        el.animate.growPercentage = (100 + parseInt(pct.replace('%','')))/100;

    } else {

        if (!el.animate.growPercentage) el.animate.growPercentage = 1.5
    }

    if (method==='active'){
        el.style.setProperty('width', el.animate.origHeight * el.animate.growPercentage + 'px');
        el.style.setProperty('height', el.animate.origWidth * el.animate.growPercentage + 'px');
    };

    if (method==='inactive'){
        el.style.setProperty('width', el.animate.origWidth + 'px');
        el.style.setProperty('height', el.animate.origHeight + 'px');
    };


}

function bounceup(method, el, pixels){

    if (pixels){

        //convert the string to an integer and remove the percent sign
        el.animate.bounceUpPixels = pixels.replace("px","");

    } else {

        if (!el.animate.bounceUpPixels) el.animate.bounceUpPixels = '20';
    }

    if (method==='active'){

        el.style.marginTop = (el.animate.origMarginTop - el.animate.bounceUpPixels) + 'px';

    };

    if (method==='inactive'){
        el.style.marginTop = el.animate.origMarginTop + 'px';
    };


}


function $eval(condition, el){

    console.log ('eval: ', condition);

    var func = eval(condition);

    if (typeof func === 'function'){
        func(el);
    }
}


function setTransitionProperties(el, duration){

    el.style.webkitTransition = "width .5s, height .5s, background-color 2s, margin .5s, -webkit-transform .5s";
    el.style.transition = "width .5s, height .5s, background-color 2s, margin .5s, -webkit-transform .5s";

}

/*

 function findElementsWithClass(matchAttr) {

 var elems = document.getElementsByTagName('*'), i=0;

 for (i=0; i < elems.length; i++) {

 if((' ' + elems[i].className + ' ').indexOf(' ' + matchClass + ' ') > -1) {
 //do something
 }
 }
 }

 */