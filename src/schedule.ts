import { given } from "@nivinjoseph/n-defensive";
import * as moment from "moment-timezone";
import { InvalidScheduleException } from "./InvalidScheduleException";
import { ScheduleDateTimeZone } from "./schedule-date-time-zone";

// public
export class Schedule
{
    private _timeZone: ScheduleDateTimeZone = ScheduleDateTimeZone.local;
    private _minute: number | null = null;
    private _hour: number | null = null;
    private _dayOfWeek: number | null = null;
    private _dayOfMonth: number | null = null;
    private _month: number | null = null;


    public get timeZone(): ScheduleDateTimeZone { return this._timeZone; }
    public get minute(): number | null { return this._minute; }
    public get hour(): number | null { return this._hour; }
    public get dayOfWeek(): number | null { return this._dayOfWeek; }
    public get dayOfMonth(): number | null { return this._dayOfMonth; }
    public get month(): number | null { return this._month; }
    
    
    public setTimeZone(value: ScheduleDateTimeZone): this
    {
        given(value, "value").ensureHasValue().ensureIsString().ensureIsEnum(ScheduleDateTimeZone);
        this._timeZone = value;
        return this;
    }
    // 0-59
    public setMinute(value: number): this
    {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0 && t <= 59);
        this._minute = value;
        return this;
    }
    // 0-23
    public setHour(value: number): this
    {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0 && t <= 23);
        this._hour = value;
        return this;
    }
    // 0-6
    public setDayOfWeek(value: number): this
    {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0 && t <= 6)
            .ensure(_ => this._dayOfMonth === null, "Can not set dayOfWeek when dayOfMonth is set");
        this._dayOfWeek = value;
        return this;
    }
    // 1-31
    public setDayOfMonth(value: number): this
    {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 1 && t <= 31)
            .ensure(_ => this._dayOfWeek === null, "Can not set dayOfMonth when dayOfWeek is set");
        this._dayOfMonth = value;
        return this;
    }
    // 0-11
    public setMonth(value: number): this
    {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0 && t <= 11);
        this._month = value;
        return this;
    }

    public calculateNext(referenceDateTime: number): number
    {
        const referenceDate = this.createMoment(referenceDateTime);

        const nextDate = referenceDate.clone().millisecond(0).second(0).add(1, "minute"); // now + 1 min assuming checks are done every min.

        if (this._dayOfMonth != null && this._month != null)
            this.validateDayOfMonthAndMonth();
        

        while (true)
        {
            if (this._month != null && nextDate.month() !== this._month)
            {
                nextDate.add(1, "month").date(1).hour(0).minute(0);
                continue;
            }
            if (this._dayOfMonth != null && nextDate.date() !== this._dayOfMonth)
            {
                nextDate.add(1, "day").hour(0).minute(0);
                continue;
            }
            if (this._dayOfWeek != null && nextDate.day() !== this._dayOfWeek)
            {
                nextDate.add(1, "day").hour(0).minute(0);
                continue;
            }
            if (this._hour != null && nextDate.hour() !== this._hour)
            {
                nextDate.add(1, "hour").minute(0);
                continue;
            }
            if (this._minute != null && nextDate.minute() !== this._minute)
            {
                nextDate.add(1, "minute");
                continue;
            }
            break;
        }
        return nextDate.valueOf();
    }


    private validateDayOfMonthAndMonth(): void
    {
        if (this._month === 1 && this._dayOfMonth === 29) // this is leap year edge case
            return;

        if (this.createMoment().month(this._month as number).daysInMonth() < (<number>this._dayOfMonth))
        {
            throw new InvalidScheduleException(`${this._month} does not have ${this._dayOfMonth} day.`);
        }
    }
    
    private createMoment(dateTime?: number): moment.Moment
    {
        given(dateTime as number, "dateTime").ensureIsNumber();
        
        let result = dateTime ? moment(dateTime) : moment();
        
        switch (this._timeZone)
        {
            case ScheduleDateTimeZone.utc:
                result = result.utc();
                break;
            case ScheduleDateTimeZone.local:
                result = result;
                break;
            case ScheduleDateTimeZone.est:
                result = result.tz("America/New_York");
                break;
            case ScheduleDateTimeZone.pst:
                result = result.tz("America/Los_Angeles");
                break;
            default:
                throw new InvalidScheduleException("Invalid ScheduleDateTimeZone");
        }
        
        return result;
    }
}