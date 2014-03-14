window.addEvent = function(title, address, description, date, success, error) {
	var event = $(e);//element
	var startDate = date // must de Date obj
	var endDate = new Date(startDate);
	endDate.setHours(startDate.getHours() + 1);

	success = success ? success : function(message) { console.log("Success: " + JSON.stringify(message)); };
	error = error ? error: function(message) { console.log("Error: " + message); };

	window.plugins.calendar.createEvent(
		title,
		address,
		description,
		startDate,
		endDate,
		success,
		error);
};