import { given } from "@nivinjoseph/n-defensive";
import { ObjectDisposedException } from "@nivinjoseph/n-exception";
import { Logger } from "@nivinjoseph/n-log";
import { Duration } from "@nivinjoseph/n-util";
import { Job } from "./job.js";
import { Schedule } from "./schedule.js";

// public
export abstract class ScheduledJob implements Job
{
    private readonly _logger: Logger;
    private readonly _schedule: Schedule;
    private _isStarted = false;
    private _isDisposed = false;
    private _timeout: any = null;


    protected get logger(): Logger { return this._logger; }
    protected get isDisposed(): boolean { return this._isDisposed; }


    public constructor(logger: Logger, schedule: Schedule)
    {
        given(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;

        given(schedule, "schedule").ensureHasValue().ensureIsType(Schedule);
        this._schedule = schedule;
    }


    public start(): void
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);

        given(this, "this").ensure(t => !t._isStarted, "already started");

        this._isStarted = true;

        this._execute();
    }

    public async dispose(): Promise<void>
    {
        if (this._isDisposed)
            return;

        this._isDisposed = true;

        if (this._timeout)
            clearTimeout(this._timeout);
    }

    protected abstract run(): Promise<void>;

    private _execute(): void
    {
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

        if (next > Duration.fromDays(20).toMilliSeconds(true))
        {
            // We reschedule the scheduling
            this._timeout = setTimeout(() =>
            {
                if (this._isDisposed)
                    return;

                this._execute();

            }, Duration.fromDays(15).toMilliSeconds(true));

            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this._timeout = setTimeout(async (): Promise<void> =>
        {
            if (this._isDisposed)
                return;

            let isError = false;

            await this._logger.logInfo(`Starting to run scheduled job ${(<Object>this).getTypeName()}.`);
            try 
            {
                await this.run();
            }
            catch (error: any)
            {
                await this._logger.logWarning(`Failed to run scheduled job ${(<Object>this).getTypeName()}.`);
                await this._logger.logError(error);
                isError = true;
            }

            if (!isError)
                await this._logger.logInfo(`Finished running scheduled job ${(<Object>this).getTypeName()}.`);

            this._execute();

        }, next);
    }
}