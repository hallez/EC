	// get random position random int generating function + offset()
	// get random coord pair: get screen dimensions, get random number in that range
	// newPos = new Object();
	// newPos.left = "randnum1";  // (first in pair)
	// newPos.top = "randnum2"; // (second in pair)
	// $("p").offset(newPos);
	function randomPos(){
		var x = Math.floor(Math.random() * WINDOW_WIDTH); // MINUS PADDING? ALSO: MINIMUM POS
		var y = Math.floor(Math.random() * WINDOW_HEIGHT); // MINUS PADDING?
		return new Point(x, y);
	};
	
	// get random relative sizes
	function randomSizePair(){
		var largeSize = Math.floor(Math.random() * (MAX_FONT_SIZE - MIN_FONT_SIZE + 1)) + MIN_FONT_SIZE;
		var smallSize = Math.floor(Math.random() * (largeSize - MIN_FONT_SIZE + 1)) + MIN_FONT_SIZE;
		return new SizePair(largeSize, smallSize);
	}
	
	// get random size
	function randomSize(){
		return (Math.floor(Math.random() * (MAX_FONT_SIZE - MIN_FONT_SIZE + 1)) + MIN_FONT_SIZE);
	}
	
	