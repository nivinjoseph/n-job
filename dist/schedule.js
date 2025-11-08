import { ensureExhaustiveCheck, given } from "@nivinjoseph/n-defensive";
import { DateTime } from "luxon";
import { InvalidScheduleException } from "./invalid-schedule-exception.js";
import { ScheduleDateTimeZone } from "./schedule-date-time-zone.js";
// public
export class Schedule {
    constructor() {
        this._timeZone = ScheduleDateTimeZone.local;
        this._minute = null;
        this._hour = null;
        this._dayOfWeek = null;
        this._dayOfMonth = null;
        this._month = null;
    }
    get timeZone() { return this._timeZone; }
    get minute() { return this._minute; }
    get hour() { return this._hour; }
    get dayOfWeek() { return this._dayOfWeek; }
    get dayOfMonth() { return this._dayOfMonth; }
    get month() { return this._month; }
    setTimeZone(value) {
        given(value, "value").ensureHasValue().ensureIsString().ensureIsEnum(ScheduleDateTimeZone);
        this._timeZone = value;
        return this;
    }
    /**
     * @param value [0-59]
     */
    setMinute(value) {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0 && t <= 59);
        this._minute = value;
        return this;
    }
    /**
     * @param value [0-23]
     */
    setHour(value) {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0 && t <= 23);
        this._hour = value;
        return this;
    }
    /**
     *
     * @param value [1-7] where 1 is Monday and 7 is Sunday
     */
    setDayOfWeek(value) {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 1 && t <= 7)
            .ensure(_ => this._dayOfMonth === null, "Can not set dayOfWeek when dayOfMonth is set");
        this._dayOfWeek = value;
        return this;
    }
    /**
     * @param value [1-31]
     */
    setDayOfMonth(value) {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 1 && t <= 31)
            .ensure(_ => this._dayOfWeek === null, "Can not set dayOfMonth when dayOfWeek is set");
        this._dayOfMonth = value;
        return this;
    }
    /**
     * @param value [1-12]
     */
    setMonth(value) {
        given(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 1 && t <= 12, "months should be between 1-12");
        this._month = value;
        return this;
    }
    /**
     * @param referenceDateTime epoch time
     */
    calculateNext(referenceDateTimeMs) {
        const referenceDate = this._createDateTime(referenceDateTimeMs);
        let nextDate = referenceDate.set({
            millisecond: 0,
            second: 0
        }).plus({ minutes: 1 }); // now + 1 min assuming checks are done every min.
        if (this._dayOfMonth != null && this._month != null)
            this._validateDayOfMonthAndMonth();
        while (true) {
            if (this._month != null && nextDate.month !== this._month) {
                nextDate = nextDate.plus({ months: 1 }).set({
                    day: 1,
                    hour: 0,
                    minute: 0
                });
                continue;
            }
            if (this._dayOfMonth != null && nextDate.day !== this._dayOfMonth) {
                nextDate = nextDate.plus({ day: 1 }).set({
                    hour: 0,
                    minute: 0
                });
                continue;
            }
            if (this._dayOfWeek != null && nextDate.weekday !== this._dayOfWeek) {
                nextDate = nextDate.plus({ day: 1 }).set({
                    hour: 0,
                    minute: 0
                });
                continue;
            }
            if (this._hour != null && nextDate.hour !== this._hour) {
                nextDate = nextDate.plus({ hour: 1 }).set({ minute: 0 });
                continue;
            }
            if (this._minute != null && nextDate.minute !== this._minute) {
                nextDate = nextDate.plus({ minute: 1 });
                continue;
            }
            break;
        }
        return nextDate.valueOf();
    }
    _validateDayOfMonthAndMonth() {
        given(this, "this").ensure(t => t._month != null).ensure(t => t._dayOfMonth != null);
        if (this._month === 2 && this._dayOfMonth === 29) // this is leap year edge case
            return;
        // shouldn't this be <= ?
        // no it shouldn't since it is checking the failed case
        // This if condition is true, if the dayOfMonth > daysInMonth (check invalid config tests)
        if (this._createDateTime().set({ month: this._month }).daysInMonth < this._dayOfMonth) {
            throw new InvalidScheduleException(`${this._month} does not have ${this._dayOfMonth} day.`);
        }
    }
    _createDateTime(dateTimeInMs) {
        given(dateTimeInMs, "dateTimeInMs").ensureIsNumber().ensure(t => t > 0);
        let result = dateTimeInMs ? DateTime.fromMillis(dateTimeInMs) : DateTime.now();
        switch (this._timeZone) {
            case ScheduleDateTimeZone.utc:
                result = result.setZone("utc");
                break;
            case ScheduleDateTimeZone.local:
                result = result.setZone("local");
                break;
            case ScheduleDateTimeZone.est:
                result = result.setZone("America/New_York");
                break;
            case ScheduleDateTimeZone.pst:
                result = result.setZone("America/Los_Angeles");
                break;
            default:
                ensureExhaustiveCheck(this._timeZone);
        }
        return result;
    }
}
//# sourceMappingURL=schedule.js.map