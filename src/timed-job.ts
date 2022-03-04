import { Logger } from "@nivinjoseph/n-log";
import { given } from "@nivinjoseph/n-defensive";
import { Job } from "./job";
import { ObjectDisposedException } from "@nivinjoseph/n-exception";
import { Duration } from "@nivinjoseph/n-util";

// public
export abstract class TimedJob implements Job
{
    private readonly _logger: Logger;
    private readonly _intervalMilliseconds: number;
    private _isStarted = false;
    private _isDisposed = false;
    private _timeout: any = null;

    
    protected get logger(): Logger { return this._logger; }
    protected get isDisposed(): boolean { return this._isDisposed; }


    public constructor(logger: Logger, intervalDuration: Duration)
    {
        given(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;

        given(intervalDuration, "intervalDuration").ensureHasValue().ensureIsInstanceOf(Duration)
            .ensure(t => t.toMilliSeconds(true) >= 0 && t.toMilliSeconds(true) <= Duration.fromHours(12).toMilliSeconds(true), "should be between 0 ms and 12 hrs");
        this._intervalMilliseconds = intervalDuration.toMilliSeconds(true);
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
        
        this._timeout = setTimeout(async () =>
        {
            if (this._isDisposed)
                return;
            
            let isError = false;

            await this._logger.logInfo(`Starting to run timed job ${(<Object>this).getTypeName()}.`);
            try 
            {
                await this.run();
            }
            catch (error)
            {
                await this._logger.logWarning(`Failed to run timed job ${(<Object>this).getTypeName()}.`);
                await this._logger.logError(error);
                isError = true;
            }

            if (!isError)
                await this._logger.logInfo(`Finished running timed job ${(<Object>this).getTypeName()}.`);
            
            this.execute();

        }, this._intervalMilliseconds);
    }
}