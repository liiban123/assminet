function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Helper function to calculate the number of non-Friday working days in a month
    function getWorkingDaysInMonth(year, month) {
        let workingDays = 0;
        const daysInMonth = new Date(year, month + 1, 0).getDate(); // Get total days in the month

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDay = new Date(year, month, day);
            const weekday = currentDay.getDay();
            if (weekday !== 5 && weekday !== 0) { // Exclude Fridays (5) and Sundays (0)
                workingDays++;
            }
        }
        return workingDays;
    }

    // Helper function to calculate the working days in a specific range
    function getWorkingDaysInRange(start, end) {
        let workingDays = 0;
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            const weekday = d.getDay();
            if (weekday !== 5 && weekday !== 0) { // Exclude Fridays and Sundays
                workingDays++;
            }
        }
        return workingDays;
    }

    // Arrays to hold results
    const daysExcludingFridays = [];
    const daysWorkedExcludingFridays = [];
    const monthlyTargets = [];

    let totalWorkingDays = 0;

    // Iterate through each month in the range
    for (let year = start.getFullYear(); year <= end.getFullYear(); year++) {
        const startMonth = year === start.getFullYear() ? start.getMonth() : 0;
        const endMonth = year === end.getFullYear() ? end.getMonth() : 11;

        for (let month = startMonth; month <= endMonth; month++) {
            const monthStart = new Date(year, month, 1);
            const monthEnd = new Date(year, month + 1, 0); // Last day of the month

            // Get total working days in this month (non-Friday working days)
            const totalWorkingDaysInMonth = getWorkingDaysInMonth(year, month);
            daysExcludingFridays.push(totalWorkingDaysInMonth);

            // Get working days actually worked in this month based on the provided date range
            const actualStart = month === start.getMonth() && year === start.getFullYear() ? start : monthStart;
            const actualEnd = month === end.getMonth() && year === end.getFullYear() ? end : monthEnd;

            const workingDaysInRange = getWorkingDaysInRange(actualStart, actualEnd);
            daysWorkedExcludingFridays.push(workingDaysInRange);

            totalWorkingDays += workingDaysInRange;
        }
    }

    // Proportionally distribute the total annual target based on working days
    let totalTarget = 0;
    for (let i = 0; i < daysWorkedExcludingFridays.length; i++) {
        const monthlyTarget = (daysWorkedExcludingFridays[i] / totalWorkingDays) * totalAnnualTarget;
        monthlyTargets.push(monthlyTarget);
        totalTarget += monthlyTarget;
    }

    return {
        daysExcludingFridays,
        daysWorkedExcludingFridays,
        monthlyTargets,
        totalTarget
    };
}

// Example usage:
const result = calculateTotalTarget('2024-01-01', '2024-03-31', 5220);
console.log(result);