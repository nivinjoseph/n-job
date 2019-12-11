import { Registry } from "@nivinjoseph/n-ject";
import { Disposable } from "@nivinjoseph/n-util";
import { JobConfig } from "./job-config";
export declare class JobManager implements Disposable {
    private readonly _container;
    private readonly _jobRegistrations;
    private _isDisposed;
    private _isBootstrapped;
    get containerRegistry(): Registry;
    constructor(config: JobConfig);
    bootstrap(): void;
    dispose(): Promise<void>;
    private createJobRegistrations;
}
