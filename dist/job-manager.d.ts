import { Container, Registry, ServiceLocator, ComponentInstaller } from "@nivinjoseph/n-ject";
import { Disposable, ClassHierarchy } from "@nivinjoseph/n-util";
import { Job } from "./job";
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
