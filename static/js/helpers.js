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
	
	
	// recursive function, get 10 numbers between 1..20 that add up to remainder trials (NSPairCountSum)
	// pre: NSCountArray is an array of integers
	function calcNSPairs(NSCountArray, NSPairCountSum) {
		var total = 0;
		$.each(arr,function() {
		    total += this;
		});
		if (total == NSPairCountSum) {
			return NSCountArray;
		}
		
		var addPos = Math.floor(Math.random() * NSCountArray);
		NSCountArray[addPos]++;
		return calcNSPairs(NSCountArray, NSPairCountSum);
	}
	
	/**
	* Randomize array element order in-place.
	* Using Fisher-Yates shuffle algorithm.
	*/
	function shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	    return array;
	}

	