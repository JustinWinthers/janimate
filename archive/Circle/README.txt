Overview
"PosterCircle" demonstrates how to use CSS transforms and animations to create and animate objects in 3D space. It displays a spinning cylinder made of three rings. Its first and third rings spin in the counterclockwise direction while its middle ring spins in the clockwise direction. Each ring is composed of numbered posters that are arranged, animated, and controlled in 3D space. All posters are created on the fly.

This sample contains the "index.html," "PosterCircle.css," and "PosterCircle.js" files. The "index.html" file builds the cylinder. The "PosterCircle.css" file contains all required information to arrange, animate, and control all the rings. The "PosterCircle.js" file implements each ring.


Building the Cylinder
"index.html" creates five div elements: "stage," "rotate," "ring1," "ring2," and "ring3."

"stage" contains all the above elements and controls how they appear in 3D space. It provides more depth to the rings by setting the -webkit-perspective property to 2000. Decrease that number to make the rings appear more shallow. 

"rotate" contains the "ring1," "ring2," and "ring3" elements. It controls the position of the rings by setting the -webkit-transform-style property to perspective. 

"ring1," "ring2," and "ring3"  are placeholders for each ring. "index.html" calls the "ring" class to style "ring1," "ring2," and "ring3." This class sets the -webkit-transform-style property to perspective to ensure that the content of the above elements will form a circular shape in 3D space, thus making it each of them look like a ring.

"PosterCircle.js" defines a POSTERS_PER_RING constant, which specifies how many posters should be added to each ring and determines the angle by which each poster will be rotated in 3D space. It contains the "setup_posters" and "init" functions, which respectively creates a ring and calls "setup_posters" to implement all three rings once the "Poster Circle" page is done loading.

"setup_posters" uses indexes to create a circle that contains posters at various angles. These indexes take values ranging from 0 to POSTERS_PER_RING- 1. Each angle is found using the expression (360 *index)/ POSTERS_PER_RING, where index is the current index.

The following steps describe how to create a ring:

1. Create a div element
Each poster is built using a div element. 

2. Set its classname attribute to "poster" 
This class defines the position, dimensions, and appearance of each poster. It uses the -webkit-border-radius property to provide each poster with a round layout.

3. Apply 3D translation and rotation
Each poster is translated in the Z direction and rotated clockwise in 3D space. "setup_posters" creates a list made of both rotate3d and translateZ functions, then uses the style.webkitTransform declaration to update each poster’s webkitTransform property with this list. 

4. Fill the poster with a number
Each poster's text represents its current index. Create a paragraph element, set its textContent property to the current index, and append the result to the poster. 

5. Add the poster to the ring 
6. Repeat step 1 to 5 while the current index is less than the value of  POSTERS_PER_RING.


Animating the Cylinder 
The spinning animation consists of three individual animations: "x-spin," "y-spin," and "back-y-spin." The first animation provides the rings with full rotation around the x-axis. The second and third animations allow the rings to fully rotate around the y-axis in opposite directions in an alternate manner. Use the @-webkit-keyframes rule to declare each of these animations. 

"PosterCircle.css" uses id selectors and the -webkit-animation-name property to start these animations. It applies the "x-spin" to the "rotate" div so all rings can rotate around the x-axis, "y-spin" to the first and third rings, and  "back-y-spin" to the second ring. 

"PosterCircle.css" uses the -webkit-animation-iteration-count, -webkit-animation-timing-function, and -webkit-animation-duration properties to make these rings spin continually and linearly over a certain period of time.  


Further Reading
Read the following references to learn about all the CSS properties used in this sample:
CSS Animation Proposal
CSS Transforms Proposal
Safari CSS Reference
Safari CSS Animation Guide for iPhone OS
Safari CSS Transform Guide for iPhone OS
Note: You must log into the Web Apps Dev Center to access these references.


Using the Sample
Place this sample’s files on your own webserver (eg. Mac OS X Personal Web Server). Open index.html in an iPhone or iPod touch running OS 2.0 or iPhone Simulator with iPhone OS 2.0 (/Developer/Platforms/AspenSimulator.platform/Developer/Applications). You should see a spinning cylinder.


Change from Previous Versions
The "perspective" value for the -webkit-transform-style property was changed to "preserve-3d" in Beta 3. We replaced occurrence of this value with preserve-3d in PosterCircle.css.


Feedback and Bug Reports
Please send all feedback about this sample by using the Feedback form on the bottom of the sample's webpage.
Please submit any bug reports about this sample to the Bug Reporting page.
Copyright (C) 2008 Apple Inc. All Rights Reserved.