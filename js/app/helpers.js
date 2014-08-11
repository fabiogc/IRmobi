var key = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";
function uncrypt(coded) {
  coded = decodeURIComponent(coded);  
  var uncoded = "";
  var chr;
  for (var i = coded.length - 1; i >= 0; i--) {
    chr = coded.charAt(i);
    uncoded += (chr >= "a" && chr <= "z" || chr >= "A" && chr <= "Z") ? String.fromCharCode(65 + key.indexOf(chr) % 26) : chr; 
  }
  return uncoded.toLowerCase();   
} 

function isYoutubeUrl(url) {
  return url && (url.indexOf('youtube.com') > -1 || url.indexOf('youtu.be') > -1);
}

function isVimeoUrl(url) {
  return url && url.indexOf('vimeo.com') > -1;
}

function getVideoId(url) {
  var videoId = '';
  if (isYoutubeUrl(url)) {
    var re = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/; 
      var matches = url.match(re);
    if (matches instanceof Array)
      videoId = matches.pop();
  } else if(isVimeoUrl(url)) {
    var re = /(videos|video|channels|\.com)\/([\d]+)/; 
    var matches = url.match(re);
    if (matches instanceof Array)
      videoId = matches.pop();;
  }
  return videoId;
};

function parseLocationSearch(location) {
  var pairs = location.substring(1).split("&");
  var obj = {};
  var pair;
  var i;
  for ( i in pairs ) {
    if ( pairs[i] === "" ) continue;
    pair = pairs[i].split("=");
    obj[ decodeURIComponent( pair[0] ) ] = decodeURIComponent( pair[1] );
  }
  return obj;
}
