export function isMoreThan24Hours(dateString: string): boolean {
    const inputDate = new Date(dateString); // Convert the string to a Date object
    const currentDate = new Date(); // Get the current date and time

    const differenceInMilliseconds = currentDate.getTime() - inputDate.getTime(); // Calculate the difference in milliseconds
    const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60); // Convert milliseconds to hours
    const differenceInMinutes = differenceInHours * 60; // Convert hours to minutes

    // Log the difference in hours and minutes
    console.log(`The Image Cache is: ${differenceInMinutes.toFixed(2)} minutes old -- (${differenceInHours.toFixed(2)} hours)`);

    return differenceInHours > 23; // Return true if the difference is more than 24 hours
}