import { Logger } from "@nivinjoseph/n-log";
import { Duration } from "@nivinjoseph/n-util";
import { Job } from "./job.js";
export declare abstract class TimedJob implements Job {
    private readonly _logger;
    private readonly _intervalMilliseconds;
    private _isStarted;
    private _isDisposed;
    private _timeout;
    protected get logger(): Logger;
    protected get isDisposed(): boolean;
    constructor(logger: Logger, intervalDuration: Duration);
    start(): void;
    dispose(): Promise<void>;
    protected abstract run(): Promise<void>;
    private _execute;
}
//# sourceMappingURL=timed-job.d.ts.map