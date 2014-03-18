window.addEvent = function(title, address, description, date) {
	var startDate = new Date(date * 1000); // must de Date obj
	var endDate = new Date(startDate);
	endDate.setHours(startDate.getHours() + 1);
	var success = function(message) { console.log("Success: " + JSON.stringify(message)); };
	var error = function(message) { console.log("Error: " + message); };

	window.plugins.calendar.createEvent(
		title,
		address,
		description,
		startDate,
		endDate,
		success,
		error);
};
