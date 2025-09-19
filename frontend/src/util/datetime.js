export const convertDateTime = (dateStr) => {
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }
    const date = dateObj.toDateString();
    const time = dateObj.toLocaleTimeString();
    return `${date} at ${time}`;
}


export const calculateTimeDelta = (dateStr) => {
    const pastDate = new Date(dateStr);
    const currentDate = new Date();

    const diffMs = Math.abs(currentDate.getTime() - pastDate.getTime());

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    // Calculate months and years more accurately
    let diffMonths = (currentDate.getFullYear() - pastDate.getFullYear()) * 12;
    diffMonths += currentDate.getMonth() - pastDate.getMonth();
    const diffYears = Math.floor(diffMonths / 12);
    diffMonths = diffMonths % 12;

    let output = "";
    if (diffYears > 0) {
        output += `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    } else if (diffMonths > 0) {
        output += `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
    } else if (diffDays > 0) {
        output += `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
        output += `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMinutes > 0) {
        output += `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    } else {
        output = "Just now";
    }

    return output;
};

export const getDateFromToday = (numDays) => {
    const today = new Date();
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() - numDays);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};