Array.prototype.shuffle = function() {
    for (let i = this.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [this[i - 1], this[j]] = [this[j], this[i - 1]];
    }
};
Array.prototype.findWithAttr = function( attr, value) {
    for (var i = 0; i < this.length; i += 1) {
        if (this[i][attr] === value) {
            return i;
        }
    }
    return -1;
};
Array.prototype.swap = function(pos1, pos2) {
    var temp = this[pos2];
    this[pos2] = this[pos1];
    this[pos1] = temp;
};
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function formatSecondsAsTime(secs, format) {
    let hr = Math.floor(secs / 3600);
    let min = Math.floor((secs - (hr * 3600)) / 60);
    let sec = Math.floor(secs - (hr * 3600) - (min * 60));

    if(hr < 10){
        hr = "0" + hr;
    }
    if (min < 10) {
        min = "0" + min;
    }
    if (sec < 10) {
        sec = "0" + sec;
    }
    if(hr === "00") {
        return min + ':' + sec;
    }else{
        return hr + ':' + min + ':' + sec;
    }
}

export default formatSecondsAsTime;