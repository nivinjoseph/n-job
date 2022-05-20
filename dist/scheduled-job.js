"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScheduledJob = void 0;
const tslib_1 = require("tslib");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const schedule_1 = require("./schedule");
const n_exception_1 = require("@nivinjoseph/n-exception");
const n_util_1 = require("@nivinjoseph/n-util");
// public
class ScheduledJob {
    constructor(logger, schedule) {
        this._isStarted = false;
        this._isDisposed = false;
        this._timeout = null;
        (0, n_defensive_1.given)(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;
        (0, n_defensive_1.given)(schedule, "schedule").ensureHasValue().ensureIsType(schedule_1.Schedule);
        this._schedule = schedule;
    }
    get logger() { return this._logger; }
    get isDisposed() { return this._isDisposed; }
    start() {
        if (this._isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        (0, n_defensive_1.given)(this, "this").ensure(t => !t._isStarted, "already started");
        this._isStarted = true;
        this._execute();
    }
    dispose() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                return;
            this._isDisposed = true;
            if (this._timeout)
                clearTimeout(this._timeout);
        });
    }
    _execute() {
        if (this._isDisposed)
            return;
        const now = Date.now();
        const next = this._schedule.calculateNext(now) - now;
        // if (next > Duration.fromDays(20))
        // {
        //     this._logger.logWarning("Next execution is over 20 days from now. Scheduling skipped.")
        //         .catch(e => console.error(e));
        //     return;
        // }
        if (next > n_util_1.Duration.fromDays(20).toMilliSeconds(true)) {
            // We reschedule the scheduling
            this._timeout = setTimeout(() => {
                if (this._isDisposed)
                    return;
                this._execute();
            }, n_util_1.Duration.fromDays(15).toMilliSeconds(true));
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this._timeout = setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                return;
            let isError = false;
            yield this._logger.logInfo(`Starting to run scheduled job ${this.getTypeName()}.`);
            try {
                yield this.run();
            }
            catch (error) {
                yield this._logger.logWarning(`Failed to run scheduled job ${this.getTypeName()}.`);
                yield this._logger.logError(error);
                isError = true;
            }
            if (!isError)
                yield this._logger.logInfo(`Finished running scheduled job ${this.getTypeName()}.`);
            this._execute();
        }), next);
    }
}
exports.ScheduledJob = ScheduledJob;
//# sourceMappingURL=scheduled-job.js.map