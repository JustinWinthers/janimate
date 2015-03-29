## jAnimate - A Declarative and JS friendly animation framework for you Mobile Apps

[jAnimate.js](https://github.com/JustinWinthers/janimate) is an animation library that you can use
for basic or advanced animations in your projects.  The animation functions can build on top of
each other and create awesome visualizations.  Have fun experimenting.

## The low down

jAnimate is in it's infancy and I'd love for other developers to join and help out the project.  The
idea is that animations should be declarative without having to use a ton of CSS.  It looks and feels
a lot like web components or Angular directives in it's implementation but janimate does not have any
dependencies and uses pure javascript to manipulate element styles so the developer can leverage web
transitions and transforms in a fast and easy to understand way.

## How to install

It's simple:


```
bower install janimate
```

### How do I use it?
 Coming soon...


## Using it in your HTML


```html
<div janimate="duration('4s').repeat('toggle').spin('hover',780)" style="background-color: yellow; width: 50px; height: 50px"></div>
```

## Using it in your javaScript


```js
    jAnimate('#myElement').timing('ease-in-out').spin('180deg').grow('hover',2).grow('leave',.5).repeat('true');

    jAnimate('#myElement').context.onclick = function(){
        var obj = jAnimate('#animateme');
        obj.repeat('false').duration('300ms').moveRight('200px');
    };

```


## Authors

**Justin Winthers**

+ https://github.com/JustinWinthers


## License

Copyright 2014 Digital Advisors, LLC

Licensed under the Apache License, Version 2.0: http://www.apache.org/licenses/LICENSE-2.0