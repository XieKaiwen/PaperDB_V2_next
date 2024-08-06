// let options = {
//   timeZone: "Asia/Singapore",
//   year: "numeric",
//   month: "2-digit",
//   day: "2-digit",
// };

// let formatter = new Intl.DateTimeFormat("en-CA", options);

// let parts = formatter.formatToParts(new Date());


// let year = parts.find((part) => part.type === "year").value;
// let month = parts.find((part) => part.type === "month").value;
// let day = parts.find((part) => part.type === "day").value;

// let formattedDate = `${year}-${month}-${day}`;

// console.log(formattedDate); // Outputs in the format YYYY-MM-DD


const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
console.log(Intl.DateTimeFormat().resolvedOptions());

console.log(timeZone); // Outputs the user's local time zone, e.g., "America/New_York"