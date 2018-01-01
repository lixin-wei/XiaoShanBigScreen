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