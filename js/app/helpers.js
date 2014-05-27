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
