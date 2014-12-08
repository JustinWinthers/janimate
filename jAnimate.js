
(function(window, document, factory){

    "use strict";

    function Factory(el){
        this.repeatVal = false;
        this.context = el
    }

    Factory.prototype = factory.api;

    window.jAnimate = function(el){

        if (typeof el === 'string') el = document.querySelector(el);

        return new Factory(el);

    };

    factory.private.compile(document);


})(window, document, (function(){

        "use strict";

        //local vars

        var _eventTypes = {
                hover: ['onmouseover'],
                leave: ['onmouseout'],
                click: ['onclick','ontouchstart'],
                drag: ['ondrag'],
                dragStart: ['ondragstart', 'ontouchstart'],
                dragEnd: ['ondragend', 'ontouchend']
            },


        // local api

            _api = {

                compile: function compile(document) {

                    var nodelist = document.querySelectorAll("div[janimate]");

                    Array.prototype.forEach.call(nodelist,function(el){

                        var el = jAnimate(el), eventList = {};

                        //el.repeat = el.repeat || false;

                        var eventList = _api.buildEventList(el);

                        Object.keys(eventList).forEach(function(key){

                            var animationName = key + '_' +  Math.floor((Math.random() * 10000000000) + 1)
                                ,eventType = (key==='immediate') ? undefined : key;

                            el.newAnimation(animationName, eventList[key]);
                            el[animationName]( eventType );
                        });

                    });
                },


                buildEventList: function(el){
                    //this function requires an jAnimate object element

                    var eventList = {};

                    el.context.getAttribute("jAnimate").split(').').sort().forEach(function(func){

                        var prop = func.split('(')[0];                        // get list of functions defined
                        var val = func.split('(')[1].replace(/\)/g,'');
                        var args = val.split(',');                            // get the first parameter to
                        var eventType = args[0].replace(/'/g,'').toString();  // get string value of first parm to see

                        if (!_eventTypes.hasOwnProperty(eventType)) eventType = 'immediate';

                        if (!eventList[eventType]) eventList[eventType] = {};

                        eventList[eventType][prop] = (eventType === 'immediate') ? args[0] : args[1];
                        eventList[eventType][prop] = eventList[eventType][prop].replace(/'/g,'');
                    });

                    return eventList;

                },

                animate: function (objVal) {

                    var el = this;

                    Object.keys(objVal).forEach(function(key){

                        if (objVal.hasOwnProperty(key)) {
                            el[key](objVal[key]);
                        }
                    });
                },

                assignEvents: function(func, eventType) {

                    if (!eventType) {
                        // if we don't have an eventType then execute the transform
                        func.call(this.context);
                        return;
                    }

                    var el = this;

                    for (var i=0; i < _eventTypes[eventType].length; i++){

                        el.context[_eventTypes[eventType][i]] = function(){func.call(el);};
                    }

                },

                setDuration: function(duration) {

                    this.context.style.webkitTransitionDuration = duration;
                    this.context.style.mozTransitionDuration = duration;
                    this.context.style.msTransitionDuration = duration;
                    this.context.style.oTransitionDuration = duration;
                    this.context.style.transitionDuration = duration;

                    return this;
                },

                setTransform: function(transform) {

                    if (this.repeatVal) {
                        this.context.style.webkitTransform += transform;
                        this.context.style.mozTransform += transform;
                        this.context.style.msTransform += transform;
                        this.context.style.oTransform += transform;
                        this.context.style.transform += transform;

                    } else {

                        this.context.style.webkitTransform = transform;
                        this.context.style.mozTransform = transform;
                        this.context.style.msTransform = transform;
                        this.context.style.oTransform = transform;
                        this.context.style.transform = transform;
                    }

                },

                transform: function(eventType, val, transform) {

                    var func = function(){

                        var jAnimateClosure = this;

                        return function(){

                            _api[transform].call(jAnimateClosure, val);

                        }

                    }.call(this);

                    _api.assignEvents.call(this, func, eventType);

                },

                backgroundColor: function(color){

                    this.context.style.backgroundColor = color;
                },

                scaleTransform: function(amount){

                    return _api.setTransform.call(this, "scale("+ amount + "," + amount + ")");
                },

                translateX: function(px){

                    return _api.setTransform.call(this, "translateX("+ px + ")");
                },

                translateY: function(px){

                    return _api.setTransform.call(this, "translateY("+ px + ")");
                },

                opacity: function(amount){

                    this.context.style.opacity = amount;
                },

                spinTransform: function(deg){

                    return _api.setTransform.call(this, "rotate("+ deg + ")");
                },

                translateZ: function(z){

                    return _api.setTransform.call(this, "translateZ(" + z + ")");
                }
            },


        // public api

            api = {

                duration: function(duration) {

                    _api.setDuration.call(this,duration);

                    return this;

                },

                repeat: function(bool) {

                    this.repeatVal = (bool.toString() === 'true');

                    return this;

                },

                grow: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], growthMultiplier = helpers.getNum(args[1]);

                    _api.transform.call(this, eventType, growthMultiplier, 'scaleTransform');

                    return this;

                },

                opacity: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], amount = args[1];

                    _api.transform.call(this, eventType, amount, 'opacity');

                    return this;

                },

                spin: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], deg = helpers.getNum(args[1]);

                    _api.transform.call(this, eventType, deg + 'deg', 'spinTransform');

                    return this;

                },

                turnBackground: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], color = args[1];

                    _api.transform.call(this, eventType, color, 'backgroundColor');

                    return this;
                },

                moveUp: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], px = '-' + helpers.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateY');

                    return this;

                },

                moveDown: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], px = helpers.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateY');

                    return this;

                },

                moveLeft: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], px = '-' + helpers.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateX');

                    return this;

                },

                moveRight: function() {

                    var args = helpers.validateArgList(arguments, 2);

                    var eventType = args[0], px = helpers.getNum(args[1]) + 'px';

                    _api.transform.call(this, eventType, px, 'translateX');

                    return this;

                },

                zoomOut: function() {

                    var args = helpers.validateArgList(arguments, 3);

                    var eventType = args[0],
                        scale = helpers.getNum(args[1]),
                        spinDegrees = helpers.getNum(args[2]);

                    _api.transform.call(this, eventType, scale, 'scaleTransform');
                    _api.transform.call(this, eventType, spinDegrees, 'spinTransform');

                    return this;

                },

                newAnimation: function(name, obj){

                    this[name] = function(eventType){

                        var objVal = eval ( "(" + JSON.stringify(obj) + ")" );

                        //this.repeat = this.repeat || (objVal.repeat && objVal.repeat.toString() === 'true');

                        //delete objVal.repeat;

                        if (eventType) {

                            var func = function(){_api.animate.call(this, objVal)};

                            _api.assignEvents.call(this, func, eventType);

                        } else {
                            _api.animate.call(this, objVal);
                        }

                        return this;

                    };

                }

            },

            helpers = {

                validateArgList: function(args, signature){

                    if (args.length !== signature) Array.prototype.unshift.call(args, null);

                    return args;
                },

                getNum: function(val){

                    if (typeof val === 'string') return val.replace(/[^0-9.]/g, "");

                    return val;
                }

            };

        return {
            api: api,
            private: _api
        };

    })());