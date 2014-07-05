$(document).ready(function(){

	WINDOW_WIDTH = $(window).width();
	WINDOW_HEIGHT = $(window).height();
	
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