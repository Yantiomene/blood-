export const convertDateTime = (dateStr) => {
    const date = new Date(dateStr).toDateString();
    const time = new Date(dateStr).toLocaleTimeString();
    return `${date} at ${time}`;
}


export const calculateTimeDelta = (dateStr) => {
    const pastDate = new Date(dateStr);
    const currentDate = new Date();

    const diffMs = currentDate.getTime() - pastDate.getTime();

    const diffYears = Math.abs(currentDate.getFullYear() - pastDate.getFullYear());
    const diffMonths = Math.abs(currentDate.getMonth() - pastDate.getMonth());
    const diffDays = Math.abs(Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    const diffHours = Math.abs(Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const diffMinutes = Math.abs(Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));

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