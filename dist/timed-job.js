"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimedJob = void 0;
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const n_exception_1 = require("@nivinjoseph/n-exception");
const n_util_1 = require("@nivinjoseph/n-util");
// public
class TimedJob {
    constructor(logger, intervalDuration) {
        this._isStarted = false;
        this._isDisposed = false;
        this._timeout = null;
        n_defensive_1.given(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;
        n_defensive_1.given(intervalDuration, "intervalDuration").ensureHasValue().ensureIsInstanceOf(n_util_1.Duration)
            .ensure(t => t.toMilliSeconds(true) >= 0 && t.toMilliSeconds(true) <= n_util_1.Duration.fromHours(12).toMilliSeconds(true), "should be between 0 ms and 12 hrs");
        this._intervalMilliseconds = intervalDuration.toMilliSeconds(true);
    }
    get logger() { return this._logger; }
    get isDisposed() { return this._isDisposed; }
    start() {
        if (this._isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        n_defensive_1.given(this, "this").ensure(t => !t._isStarted, "already started");
        this._isStarted = true;
        this.execute();
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                return;
            this._isDisposed = true;
            if (this._timeout)
                clearTimeout(this._timeout);
        });
    }
    execute() {
        if (this._isDisposed)
            return;
        this._timeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
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
            this.execute();
        }), this._intervalMilliseconds);
    }
}
exports.TimedJob = TimedJob;
//# sourceMappingURL=timed-job.js.map