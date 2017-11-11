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