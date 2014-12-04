(function nocss(window) {

    //var _attrList = ['animate','animate-click']

    var _attrList = {
        'janimate': {
            'active': 'onmouseover',
            'inactive': 'onmouseout'
        },
        'janimate-click': {
            'active': 'onclick',
            'inactive': 'onmouseout'
        }
    };


    $compile();



    //**************************************************************
    //* begin framework
    //**************************************************************

    function $compile() {

        var elems = document.getElementsByTagName('*'),
            i = 0;

        for (i = 0; i < elems.length; i++) {

            findElementsWithAnimateAttr(elems[i]);
        }

    }

    function findElementsWithAnimateAttr(el) {

        //loop through our attribute array to see if the current element has one of our attributes
        for (var attr in _attrList) {

            if (el.hasAttribute(attr)) {

                //only if we haven't already stored the original style settings for this element, store them
                if (!el.hasAttribute('animate')) storeOrigElemStyle(el);

                storeFunctionsToCallForElem(el, attr);

            }
        } // end for

        // after the functions have been stored in the element's animate object for each event type, attach
        // the function calls to the actual event for elements where we've attached an animate object
        if (el.animate) {

            //set the base transtion for all properties
            setBaseTransitionProperties(el, '.5s');

            for (var eventType in el.animate.events) {

                if (el.animate.events[eventType].length) {

                    //attach the event type to the element
                    el[eventType] = function(e) {

                        attachFunctionsToElementEvents(e.target, 'on' + e.type)
                    }

                }
            }

        }

    }


    // store the current style for the element during the compile stage
    function storeOrigElemStyle(el) {

        var style = window.getComputedStyle(el);

        el.animate = {};

        el.animate.events = {};
        el.animate.events.onmouseover = [];
        el.animate.events.onmouseout = [];
        el.animate.events.onclick = [];

        el.animate.active = false;
        el.animate.origHeight = el.clientHeight;
        el.animate.origWidth = el.clientWidth;
        el.animate.origMarginTop = parseInt(style.marginTop.replace("px", ""));
        el.animate.origBackgroundColor = el.style.backgroundColor;

    }

    //for each matched attribute in the attribute array for the current element, store the associated function
    function storeFunctionsToCallForElem(el, attr) {

        el.animate.events[(_attrList[attr]['active'])]['attrType'] = attr;
        el.animate.events[(_attrList[attr]['inactive'])]['attrType'] = attr;
        el.animate.events[(_attrList[attr]['active'])]['exitType'] = 'active';
        el.animate.events[(_attrList[attr]['inactive'])]['exitType'] = 'inactive';

        var val = el.getAttribute(attr).split(";");

        for (i = 0; i < val.length; i++) {

            el.animate.events[(_attrList[attr]['active'])].push(val[i].replace(/ /g, ''));
            el.animate.events[(_attrList[attr]['inactive'])].push(val[i].replace(/ /g, ''));

        }
    }




    function attachFunctionsToElementEvents(el, eventType) {

        for (i = 0; i < el.animate.events[eventType].length; i++) {

            callAnimateFn(el, eventType)

        }

    }





    function callAnimateFn(el, eventType) {


        var fnToCall = el.animate.events[eventType][i];
        var attrType = el.animate.events[eventType]['attrType'];
        var exitType = el.animate.events[eventType]['exitType'];

        // if attribute has an argument capture what's between the parens
        var argList = (/\(([^)]+)\)/).exec(fnToCall);



        if (argList) {

            //remove the parens
            fnToCall = fnToCall.replace(/ *\([^)]*\) */g, "");

            //pass argument to function
            eval(fnToCall)(exitType, el, argList[1].split(','))

        } else {

            eval(fnToCall)(exitType, el)
        }

    }




    function spin(method, el, args) {

        if (args) {

            var deg = args[0];

            if (args[1]) var duration = args[1];

        }

        if (deg) {

            el.animate.spinDeg = deg;

        } else {

            if (!el.animate.spinDeg) el.animate.spinDeg = '180deg'
        }

        if (duration) el.style.setProperty('-webkit-transition-duration', duration);


        if (method === 'active') {
            el.style.transform = "rotate(" + el.animate.spinDeg + ")";
            el.style.webkitTransform = "rotate(" + el.animate.spinDeg + ")";
        }

        if (method === 'inactive') {
            el.style.transform = "rotate(0deg)";
            el.style.webkitTransform = "rotate(0deg)";
        }

    }





    function grow(method, el, args) {

        expand(method, el, args);

    }




    function expand(method, el, args) {

        if (args) {

            var pct = args[0];

            if (args[1]) var duration = args[1];

        }

        if (duration) el.style.setProperty('-webkit-transition-duration', duration);

        if (pct) {

            //convert the string to an integer and remove the percent sign
            el.animate.growPercentage = (100 + parseInt(pct.replace('%', ''))) / 100;

        } else {

            if (!el.animate.growPercentage) el.animate.growPercentage = 1.5
        }

        if (method === 'active') {
            el.style.setProperty('width', el.animate.origHeight * el.animate.growPercentage + 'px');
            el.style.setProperty('height', el.animate.origWidth * el.animate.growPercentage + 'px');
        }

        if (method === 'inactive') {
            el.style.setProperty('width', el.animate.origWidth + 'px');
            el.style.setProperty('height', el.animate.origHeight + 'px');
        }


    }

    function pulsate(method, el, args) {

        if (args) {

            var pct = args[0];

            if (args[1]) var duration = args[1];

        }

        if (duration) el.style.setProperty('-webkit-transition-duration', duration);

        if (pct) {

            //convert the string to an integer and remove the percent sign
            el.animate.growPercentage = (100 + parseInt(pct.replace('%', ''))) / 100;

        } else {

            if (!el.animate.growPercentage) el.animate.growPercentage = 1.5
        }

        if (method === 'active') {
            el.style.setProperty('width', el.animate.origHeight * el.animate.growPercentage + 'px');
            el.style.setProperty('height', el.animate.origWidth * el.animate.growPercentage + 'px');

            setTimeout(function() {
                el.style.setProperty('width', el.animate.origWidth + 'px');
                el.style.setProperty('height', el.animate.origHeight + 'px');

            }, duration || 400);

        };


    }



    function expandRight(method, el, args) {

        if (args) {

            var pct = args[0];

            if (args[1]) var duration = args[1];

        }

        if (duration) el.style.setProperty('-webkit-transition-duration', duration);

        if (pct) {

            //convert the string to an integer and remove the percent sign
            el.animate.growPercentage = (100 + parseInt(pct.replace('%', ''))) / 100;

        } else {

            if (!el.animate.growPercentage) el.animate.growPercentage = 1.5
        }

        if (method === 'active') {
            el.style.setProperty('width', el.animate.origHeight * el.animate.growPercentage + 'px');
        };

        if (method === 'inactive') {
            el.style.setProperty('width', el.animate.origWidth + 'px');
        };


    }




    function bounceup(method, el, args) {

        if (args) {

            var pixels = args[0];

            if (args[1]) var duration = args[1];

        }

        if (duration) el.style.setProperty('-webkit-transition-duration', duration);


        if (pixels) {

            //convert the string to an integer and remove the percent sign
            el.animate.bounceUpPixels = pixels.replace("px", "");

        } else {

            if (!el.animate.bounceUpPixels) el.animate.bounceUpPixels = '20';
        }

        if (method === 'active') {

            el.style.marginTop = (el.animate.origMarginTop - el.animate.bounceUpPixels) + 'px';

        };

        if (method === 'inactive') {
            el.style.marginTop = el.animate.origMarginTop + 'px';
        };


    }

    function turnBackground(method, el, args) {

        if (args) {

            var color = args[0];

            if (args[1]) var duration = args[1];

        }

        if (duration) el.style.setProperty('-webkit-transition-duration', duration);


        if (color) {

            el.animate.bgColor = color;

        } else {

            if (!el.animate.bgColor) el.animate.bgColor = 'red'
        }

        if (duration) el.style.setProperty('-webkit-transition-duration', duration);


        if (method === 'active') {
            el.style.backgroundColor = el.animate.bgColor;
        }

        if (method === 'inactive') {
            el.style.backgroundColor = el.animate.origBackgroundColor;
        }

    }

    function duration(method, el, args) {

        if (args) {

            var elapsedTime = args[0];

        }

        if (elapsedTime) el.style.setProperty('-webkit-transition-duration', elapsedTime);

    }

    function setBaseTransitionProperties(el, duration) {

        el.style.webkitTransition = "width " + duration + ", left " + duration + ", height " + duration + ", background-color " + duration + ", margin " + duration + ", -webkit-transform " + duration;
        el.style.transition = "width " + duration + ", left " + duration + ", height " + duration + ", background-color " + duration + ", margin " + duration + ", -webkit-transform " + duration;
    }


})(window);