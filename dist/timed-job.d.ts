import { Logger } from "@nivinjoseph/n-log";
import { Job } from "./job";
export declare abstract class TimedJob implements Job {
    private readonly _logger;
    private readonly _intervalMilliseconds;
    private _isStarted;
    private _isDisposed;
    private _timeout;
    protected get logger(): Logger;
    protected get isDisposed(): boolean;
    constructor(logger: Logger, intervalMilliseconds: number);
    start(): void;
    dispose(): Promise<void>;
    protected abstract run(): Promise<void>;
    private execute;
}
