export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}
export function clipName(str, len) {
    if(!str) str = "";
    str = str.replace(/ /g, "");
    if(str.length <= len) return str;
    return str.substr(0, len-1) + "...";
}
export function getNodeCenter($node) {
    console.log(`width: ${$node.outerWidth()}, height: ${$node.outerHeight()}`);
    let res = {};
    res.x = $node.offset().left + $node.outerWidth()/2;
    res.y = $node.offset().top + $node.outerHeight()/2;
    return res;
}