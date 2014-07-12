
	/** Load a pair or single stimulus */
	// left = word on left
	// right = word on right (may be null)
	// position = position relative to viewport
	
	successArr = [];
	
		function loadTrial(index, blocktype, word1, cat1, word2, cat2){
		var wrapper_label = blocktype+"_"+index;
		var stimbox = $("<div></div>").addClass("stimBox "+wrapper_label);
		$("#wrapper").append(stimbox);
		var boxwidth = 0;
		var boxheight = 0;
		if (word1 == null && word2 == null) {
			// do nothing
		} else if (word2 == null) {
			var newspan = $("<span></span>").text(word1).addClass("center").css("fontSize", randomSize());
			stimbox.append(newspan);
			boxwidth = newspan.width();
			boxheight = newspan.height();
		} else if (word1 == null) {
			var newspan = $("<span></span>").text(word2).addClass("center").css("fontSize", randomSize());
			stimbox.append(newspan);
			boxwidth = newspan.width();
			boxheight = newspan.height();
		}else{
			var leftspan = $("<span></span>").addClass("left");
			var rightspan = $("<span></span>").addClass("right");
			stimbox.append(leftspan);
			stimbox.append(rightspan);
			var leftword = Math.random() < .5 ? word1 : word2;
			var rightword = leftword == word1 ? word2 : word1;
			var leftcat = leftword == word1 ? cat1 : cat2;
			var rightcat = leftcat == cat1 ? cat2 : cat1;
			
			var leftword_is_img = leftword.substring(leftword.length,4)==".JPG";
			var rightword_is_img = rightword.substring(rightword.length,4)==".JPG";
			
			if (leftword_is_img && rightword_is_img) {
				leftword_img = "<img src=\'../static/images/"+leftword+"\'>";
				rightword_img = "<img src=\'../static/images/"+rightword+"\'>";
				leftspan.html(leftword_img); 
				rightspan.html(rightword_img);
			}else if (leftword_is_img) {
				leftword_img = "<img src=\'../static/images/"+leftword+"\'>";
				leftspan.html(leftword_img);
				rightspan.text(rightword).css("fontSize", randomSize());
			}else if (rightword_is_img) {
				leftspan.text(leftword).css("fontSize", randomSize());
				rightword_img = "<img src=\'../static/images/"+rightword+"\'>";
				rightspan.html(rightword_img);
			}else{
				if (leftcat == "NS" || rightcat == "NS") {
					leftspan.text(leftword).css("fontSize", randomSize());
					rightspan.text(rightword).css("fontSize", randomSize());
				}else{
					var sizepair = randomSizePair();
					var leftsize = leftcat == "US" ? sizepair.smallSize : sizepair.largeSize;
					var rightsize = rightcat == "CS" ? sizepair.largeSize : sizepair.smallSize;
					leftspan.text(leftword).css("fontSize", leftsize);
					rightspan.text(rightword).css("fontSize", rightsize);
				}
			}
			boxwidth = leftspan.width() + rightspan.width() + 50;
			boxheight = leftspan.height() + rightspan.height() + 100;
		}
		
		var position = randomPos(boxwidth, boxheight);
		var newPos = new Object();
			newPos.left = position.x;
			newPos.top = position.y;
			stimbox.offset(newPos).css("display", "none"); // if word goes off of window, set right to window width

		
		successArr.push(index);

	}
	
	/** Running conditions */
	// params: condition (0,1,2)
	// CSpos; // cond1: walking, cond2: hearing
	// CSneut; // cond1: hearing, cond2: walking
	
	// 1. copy lists into local vars
	// 2. randomize lists
	// 3. preset random coords
	// 4. set onKeyDown listeners
	function runPractice(cond){
		us_pos_list = US_POS_LIST.slice(0);
		us_neut_list = US_NEUT_LIST.slice(0);
		ns_list = NS_LIST.slice(0);
		targetCount = 2; // may not be necessary
		CSPosCount = 2;
		CSNeutCount = 2;
		
	}
	
	function runCondition(cond){
		CSPos = cond == 1 ? "walking" : "hearing";
		CSNeut = cond == 1 ? "hearing" : "walking";
		
		//runPractice(cond);
		
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
			StimOrder.push(BLANK);
		}
		for (var i = 0; i < USNSposCount; i++){
			StimOrder.push(US_NS_POS_PAIR);
		}
		for (var i = 0; i < USNSneutCount; i++){
			StimOrder.push(US_NS_NEUT_PAIR);
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
		
		alert(StimOrder + "   number of total trials: "+totalTrialCount+",   number of blanks: "+blankCount+",   number of NSNS: "+NSPairCountSum);

		
		
	for (var i = 0; i < StimOrder.length; i++){
		var stim_type = StimOrder[i];
		switch (stim_type){
			case CS_POS_PAIR:
				var pos = Math.floor(Math.random() * us_pos_list.length);
				var usPosStim = us_pos_list[pos];
				us_pos_list.splice(pos1, 1);
				StimOrder[i] = new TrialItem(CSPos, "CS", usPosStim, "US");
				break;
			case CS_NEUT_PAIR:
				var pos = Math.floor(Math.random() * us_neut_list.length);
				var usNeutStim = us_neut_list[pos];
				us_neut_list.splice(pos, 1);
				StimOrder[i] = new TrialItem(CSNeut, "CS", usNeutStim, "US");
				break;
			case BLANK:
				StimOrder[i] = new TrialItem();
				break;
			case DISP_TARGET:
				if (Math.random() < .5) {
					StimOrder[i] = new TrialItem(TARGET, "target");
				}else{
					var pos = Math.floor(Math.random() * ns_list.length);
					var nsStim = ns_list[pos];
					StimOrder[i] = new TrialItem(TARGET, "target", nsStim, "NS");
				}
				break;
			case NS_NS_PAIR:
				var pos1 = Math.floor(Math.random() * ns_list.length);
				var nsStim1 = ns_list[pos1];
				var pos2 = Math.floor(Math.random() * ns_list.length);
				while (pos2 == pos1) {
					pos2 = Math.floor(Math.random() * ns_list.length);
				}
				var nsStim2 = ns_list[pos2];
				StimOrder[i] = new TrialItem(nsStim1, "NS", nsStim2, "NS");
				break;
			case US_NS_POS_PAIR:
				var pos1 = Math.floor(Math.random() * us_pos_list.length);
				var usPosStim = us_pos_list[pos1];
				us_pos_list.splice(pos1, 1);
				var pos2 = Math.floor(Math.random() * ns_list.length);
				var nsStim2 = ns_list[pos2];
				StimOrder[i] = new TrialItem(usPosStim, "US", nsStim2, "NS");
				break;
			case US_NS_NEUT_PAIR:
				var pos1 = Math.floor(Math.random() * us_neut_list.length);
				var usNeutStim = us_pos_list[pos1];
				us_neut_list.splice(pos1, 1);
				var pos2 = Math.floor(Math.random() * ns_list.length);
				var nsStim2 = ns_list[pos2];
				StimOrder[i] = new TrialItem(usNeutStim, "US", nsStim2, "NS");
				break;
		}
		
	}
	
	
	for (var i = 0; i < StimOrder.length; i++){
		var trial = StimOrder[i];
		var block_type = "C"+cond;
		loadTrial(i, block_type, trial.stim1, trial.cat1, trial.stim2, trial.cat2);
	}
	
	
	k = 0;
	setInterval(function(){
		var wrapper_label = ".C"+cond+"_"+k;
		$(".stimBox").css("display", "none");
		$(wrapper_label).css("display","block");
		k++;
	
	}, 1200);

	}


$(document).ready(function(){
	
// MAIN //
runCondition(1);
alert(StimOrder);

});

