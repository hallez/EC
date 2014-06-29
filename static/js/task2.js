$(document).ready(function(){
        var CSlist = ["walking", "hearing"];
	var USlist = [["useful",
	       "calming",
	       "desirable",
		"appealing",
		"relaxing",
		"beneficial",
		"worthwhile",
		"valuable",
		"terrific",
		"commendable"],
	      ["table",
	       "magazine",
	       "lamp",
	       "room",
	       "door",
	       "window",
	       "wall",
	       "paper",
	       "sideways",
	       "front"]];
	
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