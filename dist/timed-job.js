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
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const n_util_1 = require("@nivinjoseph/n-util");
class TimedJob {
    constructor(logger, intervalMilliseconds) {
        this._isDisposed = false;
        n_defensive_1.given(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;
        n_defensive_1.given(intervalMilliseconds, "intervalMilliseconds").ensureHasValue().ensureIsNumber().ensure(t => t >= 0);
        this._intervalMilliseconds = intervalMilliseconds;
        this._backgroundProcessor = new n_util_1.BackgroundProcessor((e) => this._logger.logError(e), this._intervalMilliseconds, false);
        this._backgroundProcessor.processAction(() => this.runInternal());
        this._backgroundProcessor.processAction(() => this.runInternal());
        this._interval = setInterval(() => {
            if (this._backgroundProcessor.queueLength > 2)
                return;
            this._backgroundProcessor.processAction(() => this.runInternal());
        }, this._intervalMilliseconds);
    }
    get logger() { return this._logger; }
    get isDisposed() { return this._isDisposed; }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                return;
            this._isDisposed = true;
            clearInterval(this._interval);
            yield this._backgroundProcessor.dispose(true);
        });
    }
    runInternal() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._logger.logInfo(`Starting to run timed job ${this.getTypeName()}.`);
            try {
                yield this.run();
            }
            catch (error) {
                yield this._logger.logWarning(`Failed to run timed job ${this.getTypeName()}.`);
                throw error;
            }
            yield this._logger.logInfo(`Finished running timed job ${this.getTypeName()}.`);
        });
    }
}
exports.TimedJob = TimedJob;
//# sourceMappingURL=timed-job.js.map