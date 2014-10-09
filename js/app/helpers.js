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

function isSocialVideoUrl(url) {
  var sources = /youtube\.com|vimeo\.com|dailymotion\.com|canalplus\.fr|/g;
  return url && sources.test(url);
}

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
