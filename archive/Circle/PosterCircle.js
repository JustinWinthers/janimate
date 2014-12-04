/* Each ring of the cylinder contains 12 posters */
const POSTERS_PER_RING = 6;

/*
   Implements each ring of the cylinder that. Applies translation
   and rotation transformations to each poster.  
*/
function setup_posters(ring)
{
	/* We create a ring by creating and dividing a 360 degrees circle into 12 equal parts
	   that each contains a poster */
	/* posterAngle has a value of 30 degrees */   
	var posterAngle = 360 / POSTERS_PER_RING;
	for (var index = 0; index < POSTERS_PER_RING; index ++) 
	{
		/* Each poster is a div element */
		var poster = document.createElement('div');
	
	    /* Applies the CSS "poster" class to the poster */
		poster.className = 'poster';
		
		/* Compute and assign a transform to the poster */
		var transform = ['rotate3d(0,1,0,', (posterAngle * index), 'deg) translateZ(200px)'].join('');
		poster.style.webkitTransform = transform;
		
		/* Create a placeholder for the number on each number */
		var content = poster.appendChild(document.createElement('p'));
		
		/* Add a number to the poster */
		content.textContent = '';
		/* Add the poster to this ring */
		ring.appendChild(poster);
	}
}


/*
	Called when the "Poster Circle" page loads. Calls the setup_posters
    function to implement all three rings of the cylinder.
*/
function init()
{
	setup_posters(document.getElementById('ring-1'));
	setup_posters(document.getElementById('ring-2'));
	setup_posters(document.getElementById('ring-3'));
}

/* Call the init function when the "Poster Circle" page is fully loaded */
window.addEventListener('load', init, false);