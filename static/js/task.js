$(document).ready(function(){

	WINDOW_WIDTH = $(window).width();
	WINDOW_HEIGHT = $(window).height();
	
	/** Load a pair or single stimulus */
	// left = word on left
	// right = word on right (may be null)
	// position = position relative to viewport
	function loadTrial(index, blocktype, word1, cat1, word2, cat2){
		var wrapper_label = blocktype+"_"+index;
		var position = randomPos();
		var newPos = new Object();
			newPos.left = position.x;
			newPos.top = position.y;
			$("#wrapper").append("div").addClass("stimBox "+wrapper_label);
			$(".stimBox").offset(newPos).css("display", "none"); // if word goes off of window, set right to window width

		//if (word1.substring(word1.length, 4) == ".JPG"){
		//	$(".stimBox").append()
		//}
		if (word2 == null) {
			$(".stimBox").append("div").text(word1).addClass("center").css("fontSize", randomSize);
			
		}else{
			$(".stimBox").append("div").addClass("left");
			$(".stimBox").append("div").addClass("right");
			var leftword = Math.random() < .5 ? word1 : word2;
			var rightword = leftword == word1 ? word2 : word1;
			var leftcat = leftword == word1 ? cat1 : cat2;
			var rightcat = leftcat == cat1 ? cat2 : cat1;
			
			var leftword_is_img = leftword.substring(leftword.length,4)==".JPG";
			var rightword_is_img = rightword.substring(rightword.length,4)==".JPG";
			
			if (leftword_is_img && rightword_is_img) {
				leftword_img = "<img src=\'../images/"+leftword+"\'>";
				rightword_img = "<img src=\'../images/"+rightword+"\'>";
				$(".stimBox").append("div").addClass("left").html(leftword_img); // set size
				$(".stimBox").append("div").addClass("right").html(rightword_img); // set size.. random img size function?
			}else if (leftword_is_img) {
				leftword_img = "<img src=\'../images/"+leftword+"\'>";
				$(".stimBox").append("div").addClass("left").html(leftword_img); // set size
				$(".stimBox").append("div").addClass("right").text(rightword).css("fontSize", randomSize);
			}else if (rightword_is_img) {
				$(".stimBox").append("div").addClass("left").text(leftword).css("fontSize", randomSize);
				rightword_img = "<img src=\'../images/"+rightword+"\'>";
				$(".stimBox").append("div").addClass("right").html(righword_img); // set size
			}else{
				if (leftcat == "NS" || rightcat == "NS") {
					$(".stimBox").append("div").addClass("left").text(leftword).css("fontSize", randomSize());
					$(".stimBox").append("div").addClass("right").text(rightword).css("fontSize", randomSize());
				}else{
					var leftsize = leftcat == "US" ? sizepair.smallSize : sizepair.largeSize;
					var rightsize = rightcat == "CS" ? sizepair.largeSize : sizepair.smallSize;
					$(".stimBox").append("div").addClass("left").text(leftword).css("fontSize", leftsize);
					$(".stimBox").append("div").addClass("right").text(rightword).css("fontSize", rightsize);
				}
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
	function runPractice1(){
		us_pos_list = US_POS_LIST;
		us_neut_list = US_NEUT_LIST;
		ns_list = NS_LIST;
		targetCount = 2; // may not be necessary
		CSPosCount = 2;
		CSNeutCount = 2;
		CSPos = "walking";
		CSNeut = "hearing";
		
		
	};
	
	function runCondition1(){
		us_pos_list = US_POS_LIST.slice(0);
		us_neut_list = US_NEUT_LIST.slice(0);
		ns_list = NS_LIST.slice(0);
		targetCount = 10;
		CSPosCount = 5; // CSpos USpos
		CSNeutCount = 5; // CSneut USneut
		totalTrialCount = Math.floor(Math.random() * (100 - 90) + 1) + 90; // 90..100
		blankCount = Math.floor(totalTrialCount * PERCENT_BLANK);
		USNSposCount = US_POS_LIST.length - CSPosCount;
		USNSneutCount = US_NEUT_LIST.length - CSNeutCount;
		NSPairCountSum = totalTrialCount - (targetCount + CSPosCount + CSNeutCount + blankCount + USNSposCount + USNSneutCount);
		NSPairCountArray = []; // recursive function, get 10 numbers between 1..20 that add up to remainder trials (NSPairCountSum)
		
		for (i = 0; i < CSPosCount + CSNeutCount; i++){
			NSPairCountArray.push(1);
		}
		
		NSPairCountArray = calcNSPairs(NSPairCountArray, NSPairCountSum);
		
		// Set stim order
		StimOrder = [];
		for (var i = 0; i < CSPosCount; i++){
			StimOrder.push(CS_POS_PAIR);
		}
		for (var i = 0; i < CSNeutCount; i++){
			StimOrder.push(CS_NEUT_PAIR);
		}
		for (var i = 0; i < targetCount; i++){
			StimOrder.push(DISP_TARGET);
		}
		for (var i = 0; i < blankCount; i++){
			StimORder.push(BLANK);
		}
		for (var i = 0; i < USNSposCount; i++){
			StimORder.push(US_NS_POS_PAIR);
		}
		for (var i = 0; i < USNSneutCount; i++){
			StimORder.push(US_NS_NEUT_PAIR);
		}
		
		// shuffle StimOrder
		shuffleArray(StimOrder);
		
		NSPairPos = 0;
		
		for (var i = 0; i < StimOrder.length; i++){
			if (StimOrder[i] == CS_POS_PAIR || StimOrder[i] == CS_NEUT_PAIR) {
				// add ns pairs from NSPairCountArray
				
				for (var k = 1; k <= NSPairCountArray[NSPairPos]; k++) {
					StimOrder.splice(i+k, 0, NS_NS_PAIR);
				}
				NSPairPos++;
			}
			
		}
		
		
		
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