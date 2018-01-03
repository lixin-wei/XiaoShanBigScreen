export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max + 1);
    return Math.floor(Math.random() * (max - min)) + min; //[a,b]
}
export function clipString(str, len) {
    if(!str) str = "";
    str = str.replace(/ /g, "");
    if(str.length <= len) return str;
    return str.substr(0, len-1) + "...";
}
export function getNodeCenter($node) {
    // console.log(`width: ${$node.outerWidth()}, height: ${$node.outerHeight()}`);
    let res = {};
    res.x = $node.offset().left + $node.outerWidth()/2;
    res.y = $node.offset().top + $node.outerHeight()/2;
    return res;
}

//曼哈顿距离
/**
 * @return {number}
 */
export function MhtDis(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}


//Array的比较函数
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length !== array.length)
        return false;

    for (let i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] !== array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});