import * as Assert from "assert";
import * as moment from "moment";
import { Exception } from "@nivinjoseph/n-exception";
import { Schedule } from "../src/schedule";


suite.only("Schedule", () =>
{

    suite("Single config", () =>
    {
        test("given schedule has no config, when next is calculated with reference 2018-11-09 22:28, then the result should be 2018-11-09 22:29", () =>
        {
            const schedule = new Schedule();
            const reference = moment("2018-11-09 22:28").valueOf();
            const expected = moment("2018-11-09 22:29").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config minute = 1, when next is calculated with reference 2018-11-09 22:28, then the result should be 2018-11-09 23:01", () =>
        {
            const schedule = new Schedule();
            schedule.setMinute(1);
            const reference = moment("2018-11-09 22:28").valueOf();
            const expected = moment("2018-11-09 23:01").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config hour = 23, when next is calculated with reference 2018-11-09 22:28, then result should be 2018-11-09 23:00", () =>
        {
            const schedule = new Schedule();
            schedule.setHour(23);
            const reference = moment("2018-11-09 22:28").valueOf();
            const expected = moment("2018-11-09 23:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });


        test("given schedule has config hour = 23, when next is calculated with reference 2018-11-09 23:50, then result should be 2018-11-09 23:51", () =>
        {
            const schedule = new Schedule();
            schedule.setHour(23);
            const reference = moment("2018-11-09 23:50").valueOf();
            const expected = moment("2018-11-09 23:51").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config hour = 23, when next is calculated with reference 2018-11-09 23:59, then result should be 2018-11-10 23:00", () =>
        {
            const schedule = new Schedule();
            schedule.setHour(23);
            const reference = moment("2018-11-09 23:59").valueOf();
            const expected = moment("2018-11-10 23:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config dayOfWeek = 5, when next is calculated with reference 2018-11-12 23:50, then result should be 2018-11-16 00:00", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfWeek(5);
            const reference = moment("2018-11-12 23:50").valueOf();
            const expected = moment("2018-11-16 00:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config dayOfWeek = 1, when next is calculated with reference 2018-11-12 23:50, then result should be 2018-11-12 23:51", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfWeek(1);
            const reference = moment("2018-11-12 23:50").valueOf();
            const expected = moment("2018-11-12 23:51").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config dayOfWeek = 1, when next is calculated with reference 2018-11-12 23:59, then result should be 2018-11-19 00:00", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfWeek(1);
            const reference = moment("2018-11-12 23:59").valueOf();
            const expected = moment("2018-11-19 00:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config dayOfMonth = 1, when next is calculated with reference 2018-11-12 23:50, then result should be 2018-12-01 00:00", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfMonth(1);
            const reference = moment("2018-11-12 23:50").valueOf();
            const expected = moment("2018-12-01 00:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });


        test("given schedule has config dayOfMonth = 12, when next is calculated with reference 2018-11-12 23:50, then result should be 2018-11-12 23:51", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfMonth(12);
            const reference = moment("2018-11-12 23:50").valueOf();
            const expected = moment("2018-11-12 23:51").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config dayOfMonth = 12, when next is calculated with reference 2018-11-12 23:59, then result should be 2018-12-12 00:00", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfMonth(12);
            const reference = moment("2018-11-12 23:59").valueOf();
            const expected = moment("2018-12-12 00:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config month = 11, when next is calculated with reference 2018-11-12 23:59, then result should be 2018-12-01 00:00", () =>
        {
            const schedule = new Schedule();
            schedule.setMonth(11);
            const reference = moment("2018-11-12 23:59").valueOf();
            const expected = moment("2018-12-01 00:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config month = 10, when next is calculated with reference 2018-11-12 23:59, then result should be 2018-11-12 24:00", () =>
        {
            const schedule = new Schedule();
            schedule.setMonth(10);
            const reference = moment("2018-11-12 23:59").valueOf();
            const expected = moment("2018-11-12 24:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config month = 10, when next is calculated with reference 2018-11-30 23:59, then result should be 2019-11-01 00:00", () =>
        {
            const schedule = new Schedule();
            schedule.setMonth(10);
            const reference = moment("2018-11-30 23:59").valueOf();
            const expected = moment("2019-11-01 00:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });
    });

    suite("Multiple config", () =>
    {
        test("given schedule has config hour = 12 min = 12, when next is calculated with reference 2018-11-30 01:59, then result should be 2018-11-30 12:12", () =>
        {
            const schedule = new Schedule();
            schedule.setHour(12);
            schedule.setMinute(12);
            const reference = moment("2018-11-30 01:59").valueOf();
            const expected = moment("2018-11-30 12:12").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config hour = 12 min = 12, when next is calculated with reference 2018-11-30 12:12, then result should be 2018-12-01 12:12", () =>
        {
            const schedule = new Schedule();
            schedule.setHour(12);
            schedule.setMinute(12);
            const reference = moment("2018-11-30 12:12").valueOf();
            const expected = moment("2018-12-01 12:12").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config dayOfMonth = 12 month = 1, when next is calculated with reference 2018-11-30 12:12, then result should be 2019-02-12 00:00", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfMonth(12);
            schedule.setMonth(1);
            const reference = moment("2018-11-30 12:12").valueOf();
            const expected = moment("2019-02-12 00:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config dayOfMonth = 14 hour = 12 min = 12, when next is calculated with reference 2018-11-30 12:12, then result should be 2018-12-14 12:12", () =>
        {
            const schedule = new Schedule();
            schedule.setHour(12);
            schedule.setMinute(12);
            schedule.setDayOfMonth(14);
            const reference = moment("2018-11-30 12:12").valueOf();
            const expected = moment("2018-12-14 12:12").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config dayOfWeek = 6 hour = 12 min = 12, when next is calculated with reference 2018-11-13 12:12, then result should be 2018-11-17 12:12", () =>
        {
            const schedule = new Schedule();
            schedule.setHour(12);
            schedule.setMinute(12);
            schedule.setDayOfWeek(6);
            const reference = moment("2018-11-13 12:12").valueOf();
            const expected = moment("2018-11-17 12:12").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config month = 0 dayOfMonth = 6 hour = 12 min = 12, when next is calculated with reference 2018-11-13 12:12, then result should be 2019-01-06 12:12", () =>
        {
            const schedule = new Schedule();
            schedule.setHour(12);
            schedule.setMinute(12);
            schedule.setDayOfMonth(6);
            schedule.setMonth(0);
            const reference = moment("2018-11-13 12:12").valueOf();
            const expected = moment("2019-01-06 12:12").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config month = 0 dayOfMonth = 1 hour = 0 min = 0, when next is calculated with reference 2019-01-01 00:00, then result should be 2020-01-01 00:00", () =>
        {
            const schedule = new Schedule();
            schedule.setHour(0);
            schedule.setMinute(0);
            schedule.setDayOfMonth(1);
            schedule.setMonth(0);
            const reference = moment("2019-01-01 00:00").valueOf();
            const expected = moment("2020-01-01 00:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });

        test("given schedule has config month = 1 dayOfMonth = 31, when next is calculated with reference 2019-01-01 00:00, then InvalidScheduleException should be thrown", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfMonth(31);
            schedule.setMonth(1);
            const reference = moment("2019-01-01 00:00").valueOf();

            Assert.throws(() => schedule.calculateNext(reference),
                (exp: Exception) => exp.name === "InvalidScheduleException");
        });

        test("given schedule has config month = 10 dayOfMonth = 31, when next is calculated with reference 2019-01-01 00:00, then InvalidScheduleException should thrown", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfMonth(31);
            schedule.setMonth(10);
            const reference = moment("2019-01-01 00:00").valueOf();

            Assert.throws(() => schedule.calculateNext(reference),
                (exp: Exception) => exp.name === "InvalidScheduleException");
        });

        test("given schedule has config month = 1 dayOfMonth = 29 hour, when next is calculated with reference 2018-01-01 00:00, then then result should be 2020-02-29 00:00", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfMonth(29);
            schedule.setMonth(1);
            const reference = moment("2018-01-01 00:00").valueOf();
            const expected = moment("2020-02-29 00:00").valueOf();
            const next = schedule.calculateNext(reference);
            Assert.strictEqual(next, expected);
        });
    });

    suite("Invalid config", () =>
    {
        test("given schedule has config dayOfMonth = 31, when dayOfWeek is set to 2, then ArgumentException with message 'Argument 'value' Can not set dayOfWeek when dayOfMonth is set.' should be thrown", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfMonth(31);
            Assert.throws(() => schedule.setDayOfWeek(2),
                (exp: Exception) => exp.name === "ArgumentException" && exp.message === "Argument 'value' Can not set dayOfWeek when dayOfMonth is set.");
        });

        test("given schedule has config dayOfWeek = 2, when dayOfMonth is set to 31, then ArgumentException with message 'Argument 'value' Can not set dayOfMonth when dayOfWeek is set.' should be thrown", () =>
        {
            const schedule = new Schedule();
            schedule.setDayOfWeek(2);
            Assert.throws(() => schedule.setDayOfMonth(31),
                (exp: Exception) => exp.name === "ArgumentException" && exp.message === "Argument 'value' Can not set dayOfMonth when dayOfWeek is set.");
        });
    });
});