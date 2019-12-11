import { Logger } from "@nivinjoseph/n-log";
import { Job } from "./job";
export declare abstract class TimedJob implements Job {
    private readonly _logger;
    private readonly _intervalMilliseconds;
    private readonly _backgroundProcessor;
    private readonly _interval;
    private _isDisposed;
    protected get logger(): Logger;
    protected get isDisposed(): boolean;
    constructor(logger: Logger, intervalMilliseconds: number);
    abstract run(): Promise<void>;
    dispose(): Promise<void>;
    private runInternal;
}
