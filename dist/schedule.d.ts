import { ScheduleDateTimeZone } from "./schedule-date-time-zone.js";
export declare class Schedule {
    private _timeZone;
    private _minute;
    private _hour;
    private _dayOfWeek;
    private _dayOfMonth;
    private _month;
    get timeZone(): ScheduleDateTimeZone;
    get minute(): number | null;
    get hour(): number | null;
    get dayOfWeek(): number | null;
    get dayOfMonth(): number | null;
    get month(): number | null;
    setTimeZone(value: ScheduleDateTimeZone): this;
    /**
     * @param value [0-59]
     */
    setMinute(value: number): this;
    /**
     * @param value [0-23]
     */
    setHour(value: number): this;
    /**
     *
     * @param value [1-7] where 1 is Monday and 7 is Sunday
     */
    setDayOfWeek(value: number): this;
    /**
     * @param value [1-31]
     */
    setDayOfMonth(value: number): this;
    /**
     * @param value [1-12]
     */
    setMonth(value: number): this;
    /**
     * @param referenceDateTime epoch time
     */
    calculateNext(referenceDateTimeMs: number): number;
    private _validateDayOfMonthAndMonth;
    private _createDateTime;
}
//# sourceMappingURL=schedule.d.ts.map