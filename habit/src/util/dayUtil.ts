import dayjs from 'dayjs';

export function getRecentWeeks(options: any = {}) {
    const {
        weeks = 2,
        dateFormat = 'YYYY-MM-DD',
        weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        weekdayNumbers = ['日', '一', '二', '三', '四', '五', '六'],
        includeToday = true
    }: any = options;

    const dates = [];
    const today = dayjs();
    const totalDays = weeks * 7;

    // 计算开始的天数，如果包含今天就从 totalDays-1 开始，否则从 totalDays 开始
    const startDays = includeToday ? totalDays - 1 : totalDays;

    for (let i = startDays; i >= 0; i--) {
        const date = today.subtract(i, 'day');
        dates.push({
            date: date,
            dateFormat: date.format(dateFormat),
            weekdayName: weekdayNames[date.day()],
            weekdayNumberName: weekdayNumbers[date.day()],
            weekdayNumber: date.day(),
            isWeekend: date.day() === 0 || date.day() === 6,
            isToday: i === 0 && includeToday
        });
    }

    return dates;
}

