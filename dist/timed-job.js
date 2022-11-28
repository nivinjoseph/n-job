"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimedJob = void 0;
const tslib_1 = require("tslib");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const n_exception_1 = require("@nivinjoseph/n-exception");
const n_util_1 = require("@nivinjoseph/n-util");
// public
class TimedJob {
    constructor(logger, intervalDuration) {
        this._isStarted = false;
        this._isDisposed = false;
        this._timeout = null;
        (0, n_defensive_1.given)(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;
        (0, n_defensive_1.given)(intervalDuration, "intervalDuration").ensureHasValue().ensureIsObject()
            .ensure(t => t.toMilliSeconds(true) >= 0 && t.toMilliSeconds(true) <= n_util_1.Duration.fromHours(12).toMilliSeconds(true), "should be between 0 ms and 12 hrs");
        this._intervalMilliseconds = intervalDuration.toMilliSeconds(true);
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
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this._timeout = setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                return;
            let isError = false;
            yield this._logger.logInfo(`Starting to run timed job ${this.getTypeName()}.`);
            try {
                yield this.run();
            }
            catch (error) {
                yield this._logger.logWarning(`Failed to run timed job ${this.getTypeName()}.`);
                yield this._logger.logError(error);
                isError = true;
            }
            if (!isError)
                yield this._logger.logInfo(`Finished running timed job ${this.getTypeName()}.`);
            this._execute();
        }), this._intervalMilliseconds);
    }
}
exports.TimedJob = TimedJob;
//# sourceMappingURL=timed-job.js.map