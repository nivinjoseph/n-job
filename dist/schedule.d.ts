export declare class Schedule {
    private readonly _timeZone;
    private _minute;
    private _hour;
    private _dayOfWeek;
    private _dayOfMonth;
    private _month;
    get minute(): number | null;
    get hour(): number | null;
    get dayOfWeek(): number | null;
    get dayOfMonth(): number | null;
    get month(): number | null;
    get timeZone(): string | null;
    setTimeZone(value: string): this;
    setMinute(value: number): this;
    setHour(value: number): this;
    setDayOfWeek(value: number): this;
    setDayOfMonth(value: number): this;
    setMonth(value: number): this;
    calculateNext(referenceDateTime: number): number;
    private validateDayOfMonthAndMonth;
}
