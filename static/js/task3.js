/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = PsiTurk(uniqueId, adServerLoc);

var mycondition = Math.random() > .5 ? 1 : 2;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"attitude.html",
	"manipulation.html",
	"contingency.html",
	"perceiveduse.html",
	"perceivedcomp.html",
	"postquestionnaire1.html",
	"postquestionnaire2.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
* EC TEST       *
********************/
var SurveillanceTask = function(mycondition) {
	
	psiTurk.finishInstructions();
	var d = new Date();
	var startDate = d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate() + "-" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
    
	psiTurk.recordUnstructuredData({'ID': uniqueId, 'condition':mycondition, 'date':startDate});
	
	var wordon, // time word is presented
	    listening = false;
	var successArr = [];
	
	var loadTrial = function(index, blocktype, word1, cat1, word2, cat2, isTargetBool){
		var wrapper_label = blocktype+"_"+index;
		var stimbox = $("<div></div>").addClass("stimBox "+wrapper_label);
		if (isTargetBool) {
			stimbox.addClass("target");
		}
		$("#wrapper").append(stimbox);
		var boxwidth = 0;
		var boxheight = 0;
		if (word1 == null && word2 == null) {
			// do nothing
		} else if (word2 == null) {
			var newspan = $("<span></span>").addClass("center");
			stimbox.append(newspan);
			var word1_is_img = word1.indexOf(".JPG") > -1;
			if (word1_is_img) {
				img_str = "<img src=\'../static/images/"+word1+"\'>";
				newspan.html(img_str);
			} else {
				newspan.text(word1).css("fontSize", randomSize());
			}
			boxwidth = newspan.width();
			boxheight = newspan.height();
		} else if (word1 == null) {
			var newspan = $("<span></span>").addClass("center");
			stimbox.append(newspan);
			var word2_is_img = word2.indexOf(".JPG") > -1;
			if (word2_is_img) {
				img_str = "<img src=\'../static/images/"+word2+"\'>";
				newspan.html(img_str);
			} else {
				newspan.text(word2).css("fontSize", randomSize());
			}
		}else{
			var leftspan = $("<span></span>").addClass("left");
			var rightspan = $("<span></span>").addClass("right");
			stimbox.append(leftspan);
			stimbox.append(rightspan);
			var leftword = Math.random() < .5 ? word1 : word2;
			var rightword = leftword == word1 ? word2 : word1;
			var leftcat = leftword == word1 ? cat1 : cat2;
			var rightcat = leftcat == cat1 ? cat2 : cat1;
			
			var leftword_is_img = leftword.indexOf(".JPG") > -1;
			var rightword_is_img = rightword.indexOf(".JPG") > -1;
			
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
			boxwidth = leftspan.width() + rightspan.width();
			boxheight = leftspan.height() + rightspan.height();
		}
		
		var position = randomPos(boxwidth, boxheight);
		var newPos = new Object();
			newPos.left = position.x < 0 ? 0 : position.x;
			newPos.top = position.y < 0 ? 0 : position.y;
			stimbox.offset(newPos).css("display", "none"); // if word goes off of window, set right to window width
				
		successArr.push(index);

	};

	var runCondition = function(cond, block){
		
		$("#stage_inst"+block).css("display", "block");
		
		if (block == 0) {
			
		}
		
		
		CSPos = cond == 1 ? "walking" : "hearing";
		CSNeut = cond == 1 ? "hearing" : "walking";
		
		if (block == 0) {
			us_pos_list = US_POS_LIST.slice(0);
			us_neut_list = US_NEUT_LIST.slice(0);
			ns_list = NS_LIST.slice(0);
			targetCount = 2; // may not be necessary
			CSPosCount = 2;
			CSNeutCount = 2;
			//CHANGE FROM HERE
			blankCount = 0;
			USNSposCount = US_POS_LIST.length - CSPosCount;
			USNSneutCount = US_NEUT_LIST.length - CSNeutCount;
			NSPairCountSum = Math.floor(Math.random() * (24 - 8) + 1) + 8;
			totalTrialCount = targetCount + CSPosCount + CSNeutCount + USNSposCount + USNSneutCount + NSPairCountSum;
			NSPairCountArray = [];
			
			for (i = 0; i < CSPosCount + CSNeutCount; i++){
				NSPairCountArray.push(2);
			}
			
			NSPairCountArray = calcNSPairs(NSPairCountArray, NSPairCountSum, 6);
			
		}else{
		
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
		
			NSPairCountArray = calcNSPairs(NSPairCountArray, NSPairCountSum, 20);
		}
		
		
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
		
		//alert(StimOrder + "   number of total trials: "+totalTrialCount+",   number of blanks: "+blankCount+",   number of NSNS: "+NSPairCountSum);

		
		
	for (var i = 0; i < StimOrder.length; i++){
		var stim_type = StimOrder[i];
		switch (stim_type){
			case CS_POS_PAIR:
				var pos = Math.floor(Math.random() * us_pos_list.length);
				var usPosStim = us_pos_list[pos];
				us_pos_list.splice(pos1, 1);
				StimOrder[i] = new TrialItem(CSPos, "CS", usPosStim, "US", false);
				break;
			case CS_NEUT_PAIR:
				var pos = Math.floor(Math.random() * us_neut_list.length);
				var usNeutStim = us_neut_list[pos];
				us_neut_list.splice(pos, 1);
				StimOrder[i] = new TrialItem(CSNeut, "CS", usNeutStim, "US", false);
				break;
			case BLANK:
				StimOrder[i] = new TrialItem();
				break;
			case DISP_TARGET:
				if (Math.random() < .5) {
					StimOrder[i] = new TrialItem(TARGET, "target", null, null, true);
				}else{
					var pos = Math.floor(Math.random() * ns_list.length);
					var nsStim = ns_list[pos];
					StimOrder[i] = new TrialItem(TARGET, "target", nsStim, "NS", true);
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
				StimOrder[i] = new TrialItem(nsStim1, "NS", nsStim2, "NS", false);
				break;
			case US_NS_POS_PAIR:
				var pos1 = Math.floor(Math.random() * us_pos_list.length);
				var usPosStim = us_pos_list[pos1];
				us_pos_list.splice(pos1, 1);
				var pos2 = Math.floor(Math.random() * ns_list.length);
				var nsStim2 = ns_list[pos2];
				if (Math.random() < .5) {
					StimOrder[i] = new TrialItem(usPosStim, "US");
				}else{
				StimOrder[i] = new TrialItem(usPosStim, "US", nsStim2, "NS", false);
				}
				break;
			case US_NS_NEUT_PAIR:
				var pos1 = Math.floor(Math.random() * us_neut_list.length);
				var usNeutStim = us_pos_list[pos1];
				us_neut_list.splice(pos1, 1);
				var pos2 = Math.floor(Math.random() * ns_list.length);
				var nsStim2 = ns_list[pos2];
				if (Math.random() < .5) {
					StimOrder[i] = new TrialItem(usNeutStim, "US");
				}else{
					StimOrder[i] = new TrialItem(usNeutStim, "US", nsStim2, "NS", false);
				}
				break;
		}
		
	}
	
	
	for (var i = 0; i < StimOrder.length; i++){
		var trial = StimOrder[i];
		var block_type = "B"+block;
		loadTrial(i, block_type, trial.stim1, trial.cat1, trial.stim2, trial.cat2, trial.isTarget);
	}
	
	//alert(StimOrder);
	
	
	$("#begin"+block).click(function(event) {
		$("#stage_inst"+block).remove();
		runThis();
	});
	
	
	var runThis = function() {
		var k = 0;
		trial_label = "";
		hasTarget = false;
		response ="";
		
		trialLoop = setInterval(function(){
			if (response.length>0) {
				var rt = new Date().getTime() - wordon;

				psiTurk.recordTrialData({'phase':"TEST",
                                     'trial':trial_label,
                                     'response':response,
                                     'rt':rt});
				//alert("rt:"+rt+", trial_label:"+trial_label+", response:"+response);
			}
			if (k > StimOrder.length) {
				if (block == 2) {
					finish();
				} else {
					nextBlock(block+1);
				}
			}else{
				trial_label = ".B"+block+"_"+k;
				$(".stimBox").css("display", "none");
				$(trial_label).css("display","block");
				wordon = new Date().getTime();
				hasTarget = $(trial_label).hasClass("target");
				response = hasTarget ? "M" : "CR" ;
				//alert(response);
				listening = true;
				k++;
			}
		
		}, TIME_INT);	
	};
	
	};

	var response_handler = function(e) {
		if (!listening) return;

		var keyCode = e.keyCode;

		switch (keyCode) {
			case 32:
				response = hasTarget ? "H" : "FA" ;
				//alert(response + " " + trial_label);
				break;
			case 90: //REMOVE LATER, for developing purposes only
				finish();
				//alert(response + " " + trial_label);
				break;
			default:
				break;

		}
		if (response.length>0) {
			listening = false;
//			var rt = new Date().getTime() - wordon;
//
//			psiTurk.recordTrialDhoata({'phase':"TEST",
//                                     'trial':trial_label,
//                                     'response':response,
//                                     'rt':rt}
                                   //);
		}
	};

	var finish = function() {
		clearInterval(trialLoop);
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    $("#wrapper").empty();
	    var csPos = mycondition == 1 ? "walking" : "hearing";
	    var csNeut = mycondition == 1 ? "hearing" : "walking";
	    currentview = new AttitudeMeasure(csPos, csNeut);
	};
	
	var nextBlock = function(blocknum) {
		clearInterval(trialLoop);
		$("#wrapper").empty();
		runCondition(mycondition, blocknum);
	};
	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');
	// Register the response handler that is defined above to handle any
	// key down events.
	$("body").focus().keydown(response_handler); 

	// Start the test
	runCondition(mycondition, 0);		
	};


/****************
 * Attitude Measure *
 * ***************/

var AttitudeMeasure = function(csPos, csNeut) {
	

	// Stimuli for a basic Stroop experiment
	var stims = [
			[csPos, "CSpos"],
			[csNeut, "CSneut"],
			[TARGET, "target"],
			["window", "USneut1"],
			["door", "USneut2"],
			["room", "USneut3"],
		];

	stims = _.shuffle(stims);

	var next = function() {
		if (stims.length===0) {
			finish();
		}
		else {
			stim = stims.shift();
			show_word( stim[0] );
		}
	};
	

	var finish = function() {
	     psiTurk.recordTrialData({'phase':'attitude', 'status':'submit'});
	    currentview = new ManipulationCheck();
	};
	
	var show_word = function(text) {
		d3.select("#stim")
			.append("div")
			.attr("id","word")
			.style("text-align","center")
			.style("font-size","60px")
			.style("font-weight","200")
			.style("margin","20px")
			.text(text);
	};

	var remove_word = function() {
		d3.select("#word").remove();
	};
	
	var record_responses = function() {

		$('input').each( function(i, val) {
			if (this.checked == true) {
				psiTurk.recordUnstructuredData(stim[1], stim[0], this.name, this.value);		

			}
		});

	};
	
	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('attitude.html');

	// Show first word
	next();
	
	$("#next").click(function () {
	    record_responses();
	    remove_word();
	    next();
	    
	});
	
};


/**************
 * Manipulation Check *
 * *************/

var ManipulationCheck = function(){
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	var record_responses = function() {

		psiTurk.recordTrialData({'phase':'manipulation', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('manipulation.html');
	psiTurk.recordTrialData({'phase':'manipulation', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    currentview = new ContingencyMemory();
	});
};

/***************
 *Contingency Memory *
 ****************/

var ContingencyMemory = function() {
	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	
	var record_responses = function() {

		psiTurk.recordTrialData({'phase':'contingency', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			if (this.id == 'contingency_positive') {
				var score = mycondition == 1 ? this.value : (parseInt(this.value) * -1) + "";
				psiTurk.recordUnstructuredData(this.id, score);
			} else if (this.id == 'contingency_neutral') {
				var score = mycondition == 2 ? this.value : (parseInt(this.value) * -1) + "";
				psiTurk.recordUnstructuredData(this.id, score);	
			}	
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('contingency.html');
	psiTurk.recordTrialData({'phase':'contingency', 'status':'begin'});
	
	$("#next").click(function () {
	     record_responses();
	    currentview = new PerceivedUse();
	});
};

/****************
 * Perceived Use *
 * **************/

var PerceivedUse = function() {
		var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	
	var record_responses = function() {

		psiTurk.recordTrialData({'phase':'perceived_use', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('perceiveduse.html');
	psiTurk.recordTrialData({'phase':'perceived_use', 'status':'begin'});
	
	$("#next").click(function () {
	     record_responses();
	    currentview = new PerceivedCompliance();
	});
};

/****************
 * Perceived Compliance *
 * **************/

var PerceivedCompliance = function() {
		var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	
	var record_responses = function() {

		psiTurk.recordTrialData({'phase':'perceived_comp', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('perceivedcomp.html');
	psiTurk.recordTrialData({'phase':'perceived_comp', 'status':'begin'});
	
	$("#next").click(function () {
	     record_responses();
	    currentview = new Questionnaire1();
	});
};

/****************
* Questionnaire 1 *
****************/

var Questionnaire1 = function() {
		var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	
	var record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire1', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});
		$('input').each( function(i, val) {
			if (this.checked == true) {
				psiTurk.recordUnstructuredData(this.name, this.value);		
			}
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire1.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire1', 'status':'begin'});
	
	$("#next").click(function () {
	     record_responses();
	    currentview = new Questionnaire2();
	});
};

/****************
* Questionnaire 2 *
****************/

var Questionnaire2 = function() {
		var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	
	var record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire2', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});
		$('input').each( function(i, val) {
			if (this.checked == true) {
				psiTurk.recordUnstructuredData(this.name, this.value);		
			}
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire2.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire2', 'status':'begin'});
	
	$("#next").click(function () {
	     record_responses();
	    currentview = new Questionnaire3();
	});
};


/****************
* Questionnaire 3 *
****************/

var Questionnaire3 = function() {
		var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	
	var record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire3', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});
		$('input').each( function(i, val) {
			if (this.checked == true) {
				psiTurk.recordUnstructuredData(this.name, this.value);		
			}
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire3.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire3', 'status':'begin'});
	
	$("#next").click(function () {
	     record_responses();
	    currentview = new Questionnaire4();
	});
};

/****************
* Questionnaire 4 *
****************/

var Questionnaire4 = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	var record_responses = function() {

		psiTurk.recordTrialData({'phase':'postquestionnaire4', 'status':'submit'});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});
		$('input').each( function(i, val) {
			if (this.checked == true) {
				psiTurk.recordUnstructuredData(this.name, this.value);		
			}
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire4.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire4', 'status':'begin'});
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
		psiTurk.completeHIT();
                //psiTurk.computeBonus('compute_bonus', function() { 
                //	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                //}); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new SurveillanceTask(mycondition); } // what you want to do when you are done with instructions
    );
});
