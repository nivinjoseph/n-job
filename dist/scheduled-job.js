import { given } from "@nivinjoseph/n-defensive";
import { ObjectDisposedException } from "@nivinjoseph/n-exception";
import { Duration } from "@nivinjoseph/n-util";
import { Schedule } from "./schedule.js";
// public
export class ScheduledJob {
    get logger() { return this._logger; }
    get isDisposed() { return this._isDisposed; }
    constructor(logger, schedule) {
        this._isStarted = false;
        this._isDisposed = false;
        this._timeout = null;
        given(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;
        given(schedule, "schedule").ensureHasValue().ensureIsType(Schedule);
        this._schedule = schedule;
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
        const now = Date.now();
        const next = this._schedule.calculateNext(now) - now;
        // if (next > Duration.fromDays(20))
        // {
        //     this._logger.logWarning("Next execution is over 20 days from now. Scheduling skipped.")
        //         .catch(e => console.error(e));
        //     return;
        // }
        if (next > Duration.fromDays(20).toMilliSeconds(true)) {
            // We reschedule the scheduling
            this._timeout = setTimeout(() => {
                if (this._isDisposed)
                    return;
                this._execute();
            }, Duration.fromDays(15).toMilliSeconds(true));
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this._timeout = setTimeout(async () => {
            if (this._isDisposed)
                return;
            let isError = false;
            await this._logger.logInfo(`Starting to run scheduled job ${this.getTypeName()}.`);
            try {
                await this.run();
            }
            catch (error) {
                await this._logger.logWarning(`Failed to run scheduled job ${this.getTypeName()}.`);
                await this._logger.logError(error);
                isError = true;
            }
            if (!isError)
                await this._logger.logInfo(`Finished running scheduled job ${this.getTypeName()}.`);
            this._execute();
        }, next);
    }
}
//# sourceMappingURL=scheduled-job.js.map