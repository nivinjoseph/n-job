import { Logger } from "@nivinjoseph/n-log";
import { Job } from "./job.js";
import { Schedule } from "./schedule.js";
export declare abstract class ScheduledJob implements Job {
    private readonly _logger;
    private readonly _schedule;
    private _isStarted;
    private _isDisposed;
    private _timeout;
    protected get logger(): Logger;
    protected get isDisposed(): boolean;
    constructor(logger: Logger, schedule: Schedule);
    start(): void;
    dispose(): Promise<void>;
    protected abstract run(): Promise<void>;
    private _execute;
}
//# sourceMappingURL=scheduled-job.d.ts.map