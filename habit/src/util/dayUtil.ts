import dayjs from 'dayjs';

export function format(theDate: Date, format: string = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(theDate).format(format);
}

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

export function fillClockDaysDesc(habit: any) {
    // 获取近两周的日期
    const recentDates = getRecentWeeks({weeks: 2});
    const allDateFormats = recentDates.map(item => item.dateFormat).reverse();

    // 解析现有的日期和数字
    const existingDates = habit.clock_days ? habit.clock_days.split(',') : [];
    const existingNumbers = habit.numbers ? habit.numbers.split(',') : [];

    // 创建日期到数字的映射
    const dateNumberMap = new Map<string, string>();
    existingDates.forEach((date: string, index: number) => {
        if (existingNumbers[index]) {
            dateNumberMap.set(date.trim(), existingNumbers[index].trim());
        }
    });

    // 为所有日期分配数字，缺失的用0填充
    const finalNumbers: string[] = [];

    allDateFormats.forEach(dateFormat => {
        finalNumbers.push(dateNumberMap.get(dateFormat) || '0');
    });

    // 返回更新后的对象
    return {
        ...habit,
        clock_days: allDateFormats.join(','),
        numbers: finalNumbers.join(',')
    };
}

export function batchFillClockDaysDesc(habits: any[]) {
    return habits.map(habit => fillClockDaysDesc(habit));
}
