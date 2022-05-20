"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const moment = require("moment-timezone");
const InvalidScheduleException_1 = require("./InvalidScheduleException");
const schedule_date_time_zone_1 = require("./schedule-date-time-zone");
// public
class Schedule {
    constructor() {
        this._timeZone = schedule_date_time_zone_1.ScheduleDateTimeZone.local;
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
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsString().ensureIsEnum(schedule_date_time_zone_1.ScheduleDateTimeZone);
        this._timeZone = value;
        return this;
    }
    /**
     * @param value [0-59]
     */
    setMinute(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0 && t <= 59);
        this._minute = value;
        return this;
    }
    /**
     * @param value [0-23]
     */
    setHour(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0 && t <= 23);
        this._hour = value;
        return this;
    }
    /**
     *
     * @param value [0-6] where 0 is Sunday and 6 is Saturday
     */
    setDayOfWeek(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0 && t <= 6)
            .ensure(_ => this._dayOfMonth === null, "Can not set dayOfWeek when dayOfMonth is set");
        this._dayOfWeek = value;
        return this;
    }
    /**
     * @param value [1-31]
     */
    setDayOfMonth(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 1 && t <= 31)
            .ensure(_ => this._dayOfWeek === null, "Can not set dayOfMonth when dayOfWeek is set");
        this._dayOfMonth = value;
        return this;
    }
    /**
     * @param value [0-11]
     */
    setMonth(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsNumber().ensure(t => t >= 0 && t <= 11);
        this._month = value;
        return this;
    }
    /**
     * @param referenceDateTime epoch time
     */
    calculateNext(referenceDateTime) {
        const referenceDate = this._createMoment(referenceDateTime);
        const nextDate = referenceDate.clone().millisecond(0).second(0).add(1, "minute"); // now + 1 min assuming checks are done every min.
        if (this._dayOfMonth != null && this._month != null)
            this._validateDayOfMonthAndMonth();
        // eslint-disable-next-line no-constant-condition
        while (true) {
            if (this._month != null && nextDate.month() !== this._month) {
                nextDate.add(1, "month").date(1).hour(0).minute(0);
                continue;
            }
            if (this._dayOfMonth != null && nextDate.date() !== this._dayOfMonth) {
                nextDate.add(1, "day").hour(0).minute(0);
                continue;
            }
            if (this._dayOfWeek != null && nextDate.day() !== this._dayOfWeek) {
                nextDate.add(1, "day").hour(0).minute(0);
                continue;
            }
            if (this._hour != null && nextDate.hour() !== this._hour) {
                nextDate.add(1, "hour").minute(0);
                continue;
            }
            if (this._minute != null && nextDate.minute() !== this._minute) {
                nextDate.add(1, "minute");
                continue;
            }
            break;
        }
        return nextDate.valueOf();
    }
    _validateDayOfMonthAndMonth() {
        if (this._month === 1 && this._dayOfMonth === 29) // this is leap year edge case
            return;
        if (this._createMoment().month(this._month).daysInMonth() < this._dayOfMonth) {
            throw new InvalidScheduleException_1.InvalidScheduleException(`${this._month} does not have ${this._dayOfMonth} day.`);
        }
    }
    _createMoment(dateTime) {
        (0, n_defensive_1.given)(dateTime, "dateTime").ensureIsNumber();
        let result = dateTime ? moment(dateTime) : moment();
        switch (this._timeZone) {
            case schedule_date_time_zone_1.ScheduleDateTimeZone.utc:
                result = result.utc();
                break;
            case schedule_date_time_zone_1.ScheduleDateTimeZone.local:
                // result = result;
                break;
            case schedule_date_time_zone_1.ScheduleDateTimeZone.est:
                result = result.tz("America/New_York");
                break;
            case schedule_date_time_zone_1.ScheduleDateTimeZone.pst:
                result = result.tz("America/Los_Angeles");
                break;
            default:
                throw new InvalidScheduleException_1.InvalidScheduleException("Invalid ScheduleDateTimeZone");
        }
        return result;
    }
}
exports.Schedule = Schedule;
//# sourceMappingURL=schedule.js.map