$(document).ready(function(){
	
	var TIME_INT = 1200;
	var US_SIZE = 16;
	var CS_SIZE = 48;
	
	var TARGET = "looking"; // size? in pair? by itself?
	var US_POS_LIST = ["useful",
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
	var US_NEUT_LIST = ["table",
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
	var NS_LIST = ["concrete",
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

	
	// set random position random int generating function + offset()
	// get random coord pair: get screen dimensions, get random number in that range
	// newPos = new Object();
	// newPos.left = "randnum1";  // (first in pair)
	// newPos.top = "randnum2"; // (second in pair)
	// $("p").offset(newPos);
	
	// central function:
	// params: condition (0,1,2)
	// CSpos; // cond1: walking, cond2: hearing
	// CSneut; // cond1: hearing, cond2: walking
	
	// 1. copy lists into local vars
	// 2. randomize lists
	// 3. preset random coords
	// 4. set onKeyDown listeners
	
	var c = 0;
	var u = 0;
	var k = 0;
	var hide1 = Math.random() < .5 ? "#cs" : "#us";
	var hide2 = hide1 == "#cs" ? "#us" : "#cs";
	
	var flashing = setInterval(function(){
		$("#cs").text(CSlist[c]);
		$("#us").text(USlist[c][u]);
		$(hide1).show(0).delay(275).hide(0).delay(25).show(0);
		$(hide2).show(0).delay(575).hide(0).delay(25).show(0);
		if (k == 4) {
			k = 0;
			u++;
		}
		if (u >= USlist[c].length) {
			u = 0;
			c++;
		}
		if (c >= CSlist.length ) {
			clearInterval(flashing);
		}
		k++;

	}, 600);
	

});