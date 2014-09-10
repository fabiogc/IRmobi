window.addEvent = function(title, address, description, start_date, end_date) {
	var startDate = new Date(start_date * 1000); // must de Date obj
	var endDate = new Date(end_date * 1000);
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
