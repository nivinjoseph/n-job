import { Job } from "./job";
import { Logger } from "@nivinjoseph/n-log";
import { given } from "@nivinjoseph/n-defensive";
import { Schedule } from "./schedule";
import { ObjectDisposedException } from "@nivinjoseph/n-exception";
import { Duration } from "@nivinjoseph/n-util";

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

        given(schedule, "schedule").ensureHasValue().ensureIsObject().ensureIsInstanceOf(Schedule);
        this._schedule = schedule;
    }
    
    
    public start(): void
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);

        given(this, "this").ensure(t => !t._isStarted, "already started");

        this._isStarted = true;

        this.execute();
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
    
    private execute(): void
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

                this.execute();

            }, Duration.fromDays(15).toMilliSeconds(true));
            
            return;
        }
        
        this._timeout = setTimeout(async () =>
        {
            if (this._isDisposed)
                return;

            let isError = false;

            await this._logger.logInfo(`Starting to run scheduled job ${(<Object>this).getTypeName()}.`);
            try 
            {
                await this.run();
            }
            catch (error)
            {
                await this._logger.logWarning(`Failed to run scheduled job ${(<Object>this).getTypeName()}.`);
                await this._logger.logError(error);
                isError = true;
            }

            if (!isError)
                await this._logger.logInfo(`Finished running scheduled job ${(<Object>this).getTypeName()}.`);

            this.execute();

        }, next);
    }
}