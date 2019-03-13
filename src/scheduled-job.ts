// import { Job } from "./job";
// import { Logger } from "@nivinjoseph/n-log";
// import { BackgroundProcessor } from "@nivinjoseph/n-util";
// import { given } from "@nivinjoseph/n-defensive";


// export abstract class ScheduledJob implements Job
// {
//     private readonly _logger: Logger;
//     private readonly _backgroundProcessor: BackgroundProcessor;


//     public constructor(logger: Logger, minute, hour, day, month, )
//     {
//         given(logger, "logger").ensureHasValue().ensureIsObject();
//         this._logger = logger;


//         this._backgroundProcessor = new BackgroundProcessor();

//         this._backgroundProcessor.processAction(() => this.run());
//     }

//     public abstract run(): Promise<void>;

//     public dispose(): Promise<void>
//     {
//         return this._backgroundProcessor.dispose();
//     }
// }