import { Registry, ServiceLocator, ComponentInstaller } from "@nivinjoseph/n-ject";
import { Disposable } from "@nivinjoseph/n-util";
import { Job } from "./job";
export declare class JobManager implements Disposable {
    private readonly _container;
    private readonly _jobRegistrations;
    private _isDisposed;
    private _isBootstrapped;
    get containerRegistry(): Registry;
    get serviceLocator(): ServiceLocator;
    constructor();
    useInstaller(installer: ComponentInstaller): this;
    registerJobs<TClass extends new (...args: any[]) => Job>(...jobClasses: TClass[]): this;
    bootstrap(): void;
    beginJobs(): Promise<void>;
    dispose(): Promise<void>;
}
