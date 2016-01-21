/* NOTES:
   There are many ways to generate values for a date and time display.  The one below is *more* customized than most people will want, but it should also give you an idea of what is possible.
*/

function renderClock() {
	/* get the date/time from the local machine */
	var currentTime = new Date();

	/* break the date/time into its constituent parts;
	   the variable names are consistent with similar naming conventions */
	var Y = currentTime.getFullYear();
	var M = currentTime.getMonth() + 1;
	var D = currentTime.getDate();
	var h = currentTime.getHours();
	var m = currentTime.getMinutes();
	
	/* if the Month, Date, hour, or minute is less than 10, prepend a 0
	   this ensures each value is two characters in length, which in turn
	   ensures the values aren't visually 'jumping' */
	if (M < 10) { M = "0" + M; }
	if (D < 10) { D = "0" + D; }
	if (h < 10) { h = "0" + h; }
	if (m < 10) { m = "0" + m; }

	/* use vanilla js to get and set the date element to a YYYY.MM.DD format */
	var myDate = document.getElementById('date') || '';
	myDate.textContent = Y + "." + M + "." + D;
	myDate.innerText = Y + "." + M + "." + D;
	
	/* use vanilla js to get and set the clock element to a HH:MM format */
	var myClock = document.getElementById('clock')|| '';
	myClock.textContent = h + ":" + m ;
	myClock.innerText = h + ":" + m ;
	
	/* once time is shown, reduce the update frequency */
	if (currentTime) { 
		config.clockTimeout = 3000; 
	}

	/* use setTimout and the startUp.config.clockTimeout to run renderClock again at the appropriate time */
	setTimeout (renderClock, config.clockTimeout);
}

renderClock();