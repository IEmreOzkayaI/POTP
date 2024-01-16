function getTimestamp() {
	const timestamp = new Date().toLocaleString("en-US", {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: true,
		timeZone: "Europe/Istanbul",
	});
	return timestamp;
}

export default getTimestamp;
