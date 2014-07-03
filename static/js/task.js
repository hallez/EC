$(document).ready(function(){
	
	MAX_FONT_SIZE = 60;
	MIN_FONT_SIZE = 10;
	PERCENT_BLANK = 0.25;
	TIME_INT = 1200;
	US_SIZE = 16;
	CS_SIZE = 48;
	PROXIMITY = "   "; // pixels? spaces?
	TARGET = "looking"; // size? in pair? by itself?
	US_POS_LIST = ["useful",
	       "calming",
	       "desirable",
		"appealing",
		"relaxing",
		"beneficial",
		"worthwhile",
		"valuable",
		"terrific",
		"commendable",
		"USp1",
		"USp2",
		"USp3",
		"USp4",
		"USp5",
		"USp6"];
	US_NEUT_LIST = ["table",
	       "magazine",
	       "lamp",
	       "room",
	       "door",
	       "window",
	       "wall",
	       "paper",
	       "sideways",
	       "front",
	       "USn1",
	       "USn2",
	       "USn3",
	       "USn4",
	       "USn5",
	       "USn6"];
	NS_LIST = ["concrete",
		       "metal",
		       "desk",
		       "weather",
		       "hallway",
		       "ceiling",
		       "air",
		       "flat",
		       "next",
		       "pencil",
		       "vent",
		       "plastic",
		       "NS1",
		       "NS2",
		       "NS3",
		       "NS4",
		       "NS5",
		       "NS6",
		       "NS7",
		       "NS9",
		       "NS10",
		       "NS11",
		       "NS12"];
	WINDOW_WIDTH = $(window).width();
	WINDOW_HEIGHT = $(window).height();
	
	/** Point class */
	function Point(x,y) {
		this.x = x || 0;
		this.y = y || 0;
	};
	
	/** Size pair class */
	//SIZE OF IMAGES???
	function SizePair(large, small){
		this.largeSize = large || MAX_FONT_SIZE;
		this.smallSize = small || MIN_FONT_SIZE;
	};
	
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
	
	
	
	/** Show a pair or single word */
	// left = word on left
	// right = word on right (may be null)
	// position = position relative to viewport
	function runTrial(word1, cat1, word2, cat2){
		var position = randomPos();
		if (word2 == null) {
			var newPos = new Object();
			newPos.left = position.x;
			newPos.top = position.y; // if word goes off of window, set right to window width
			$("#wrapper").offset(newPos).css("fontSize", randomSize());
			
			
			// add paragraph node
		}else{
			var leftword = Math.random() < .5 ? word1 : word2;
			var rightword = leftword == word1 ? word2 : word1;
			var leftcat = leftword == word1 ? cat1 : cat2;
			var rightcat = leftcat == cat1 ? cat2 : cat1;
			var sizepair = randomSizePair();
			if (cat1 == "NS" || cat2 == "NS") {
				$("#left").text(leftword).addClass(leftcat).css("fontSize", randomSize());
				$("#right").text(rightword).addClass(rightcat).css("fontSize", randomSize());
			}else{
			var leftsize = leftcat == "US" ? sizepair.smallSize : sizepair.largeSize;
			var rightsize = rightcat == "CS" ? sizepair.largeSize : sizepair.smallSize;
			$("#left").text(leftword).addClass(leftcat).css("fontSize", leftsize);
			$("#right").text(rightword).addClass(rightcat).css("fontSize", rightsize);
			}
		}
	};
	
	/** Running conditions */
	// params: condition (0,1,2)
	// CSpos; // cond1: walking, cond2: hearing
	// CSneut; // cond1: hearing, cond2: walking
	
	// 1. copy lists into local vars
	// 2. randomize lists
	// 3. preset random coords
	// 4. set onKeyDown listeners
	function runPractice(){
		targetCount = 2; // may not be necessary
		CSPosCount = 5;
		CSNeutCount = 5;
		CSPos = "walking"; // ???
		CSNeut = "hearing";
		
	};
	
	function runCondition1(){
		targetCount = 10;
		CSPosCount = 5; // CSpos USpos
		CSNeutCount = 5; // CSneut USneut
		totalTrialCount = Math.floor(Math.random() * (100 - 90 + 1)) + 90; // 90..100
		blankCount = Math.floor(totalTrialCount * PERCENT_BLANK);
		USNSposCount = US_POS_LIST.length - CSPosCount;
		USNSneutCount = US_NEUT_LIST.length - CSNeutCount;
		NSPairCountSum = totalTrialCount - (targetCount + CSPosCount + CSNeutCount + blankCount + USNSposCount + USNSneutCount);
		NSPairCountArray = []; // recursive function, get 10 numbers between 1..20 that add up to remainder trials (NSPairCountSum)
	}
	
	
	
	//var c = 0;
	//var u = 0;
	//var k = 0;
	//var hide1 = Math.random() < .5 ? "#cs" : "#us";
	//var hide2 = hide1 == "#cs" ? "#us" : "#cs";
	//
	//var flashing = setInterval(function(){
	//	$("#cs").text(CSlist[c]);
	//	$("#us").text(USlist[c][u]);
	//	$(hide1).show(0).delay(275).hide(0).delay(25).show(0);
	//	$(hide2).show(0).delay(575).hide(0).delay(25).show(0);
	//	if (k == 4) {
	//		k = 0;
	//		u++;
	//	}
	//	if (u >= USlist[c].length) {
	//		u = 0;
	//		c++;
	//	}
	//	if (c >= CSlist.length ) {
	//		clearInterval(flashing);
	//	}
	//	k++;
	//
	//}, 600);
	

});