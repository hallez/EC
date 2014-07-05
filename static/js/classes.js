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