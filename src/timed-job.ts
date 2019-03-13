import { Logger } from "@nivinjoseph/n-log";
import { given } from "@nivinjoseph/n-defensive";
import { BackgroundProcessor } from "@nivinjoseph/n-util";
import { Job } from "./job";

// public
export abstract class TimedJob implements Job
{
    private readonly _logger: Logger;
    private readonly _intervalMilliseconds: number;
    private readonly _backgroundProcessor: BackgroundProcessor;
    private readonly _interval: any;
    private _isDisposed = false;

    
    protected get logger(): Logger { return this._logger; }
    protected get isDisposed(): boolean { return this._isDisposed; }


    public constructor(logger: Logger, intervalMilliseconds: number)
    {
        given(logger, "logger").ensureHasValue().ensureIsObject();
        this._logger = logger;

        given(intervalMilliseconds, "intervalMilliseconds").ensureHasValue().ensureIsNumber().ensure(t => t >= 0);
        this._intervalMilliseconds = intervalMilliseconds;

        this._backgroundProcessor = new BackgroundProcessor((e) => this._logger.logError(e as any), this._intervalMilliseconds, false);

        this._backgroundProcessor.processAction(() => this.runInternal());
        this._backgroundProcessor.processAction(() => this.runInternal());
        this._interval = setInterval(() =>
        {
            if (this._backgroundProcessor.queueLength > 2)
                return;
            
            this._backgroundProcessor.processAction(() => this.runInternal());
        }, this._intervalMilliseconds);
    }


    public abstract run(): Promise<void>;

    public async dispose(): Promise<void>
    {
        if (this._isDisposed)
            return;
        
        this._isDisposed = true;
        
        clearInterval(this._interval);
        await this._backgroundProcessor.dispose(true);
    }


    private async runInternal(): Promise<void>
    {
        await this._logger.logInfo(`Starting to run timed job ${(<Object>this).getTypeName()}.`);
        try 
        {
            await this.run();
        }
        catch (error)
        {
            await this._logger.logWarning(`Failed to run timed job ${(<Object>this).getTypeName()}.`);
            throw error;
        }
        await this._logger.logInfo(`Finished running timed job ${(<Object>this).getTypeName()}.`);
    }
}