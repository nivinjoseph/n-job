import { given } from "@nivinjoseph/n-defensive";
import { ObjectDisposedException } from "@nivinjoseph/n-exception";
import { Duration } from "@nivinjoseph/n-util";
// public
export class TimedJob {
    get logger() { return this._logger; }
    get isDisposed() { return this._isDisposed; }
    constructor(logger, intervalDuration) {
        this._isStarted = false;
        this._isDisposed = false;
        this._timeout = null;
        given(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;
        given(intervalDuration, "intervalDuration").ensureHasValue().ensureIsObject()
            .ensure(t => t.toMilliSeconds(true) >= 0 && t.toMilliSeconds(true) <= Duration.fromHours(12).toMilliSeconds(true), "should be between 0 ms and 12 hrs");
        this._intervalMilliseconds = intervalDuration.toMilliSeconds(true);
    }
    start() {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        given(this, "this").ensure(t => !t._isStarted, "already started");
        this._isStarted = true;
        this._execute();
    }
    async dispose() {
        if (this._isDisposed)
            return;
        this._isDisposed = true;
        if (this._timeout)
            clearTimeout(this._timeout);
    }
    _execute() {
        if (this._isDisposed)
            return;
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this._timeout = setTimeout(async () => {
            if (this._isDisposed)
                return;
            let isError = false;
            await this._logger.logInfo(`Starting to run timed job ${this.getTypeName()}.`);
            try {
                await this.run();
            }
            catch (error) {
                await this._logger.logWarning(`Failed to run timed job ${this.getTypeName()}.`);
                await this._logger.logError(error);
                isError = true;
            }
            if (!isError)
                await this._logger.logInfo(`Finished running timed job ${this.getTypeName()}.`);
            this._execute();
        }, this._intervalMilliseconds);
    }
}
//# sourceMappingURL=timed-job.js.map