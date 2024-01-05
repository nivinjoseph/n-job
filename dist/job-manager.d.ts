import { ComponentInstaller, Container, Registry, ServiceLocator } from "@nivinjoseph/n-ject";
import { ClassHierarchy, Disposable } from "@nivinjoseph/n-util";
import { Job } from "./job.js";
export declare class JobManager implements Disposable {
    private readonly _container;
    private readonly _ownsContainer;
    private readonly _jobRegistrations;
    private _isDisposed;
    private _isBootstrapped;
    get containerRegistry(): Registry;
    get serviceLocator(): ServiceLocator;
    constructor(container?: Container);
    useInstaller(installer: ComponentInstaller): this;
    registerJobs(...jobClasses: ReadonlyArray<ClassHierarchy<Job>>): this;
    bootstrap(): void;
    beginJobs(): Promise<void>;
    dispose(): Promise<void>;
}
//# sourceMappingURL=job-manager.d.ts.map