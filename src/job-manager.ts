import { given } from "@nivinjoseph/n-defensive";
import { Container, Registry, ServiceLocator, ComponentInstaller } from "@nivinjoseph/n-ject";
import { ObjectDisposedException, ApplicationException } from "@nivinjoseph/n-exception";
import { Disposable, Delay, ClassHierarchy } from "@nivinjoseph/n-util";
import { Job } from "./job";

// public
export class JobManager implements Disposable
{
    private readonly _container: Container;
    private readonly _ownsContainer: boolean;
    private readonly _jobRegistrations: Array<JobRegistration>;

    private _isDisposed = false;
    private _isBootstrapped = false;


    public get containerRegistry(): Registry { return this._container; }
    public get serviceLocator(): ServiceLocator { return this._container; }


    public constructor(container?: Container)
    {
        given(container as Container, "container").ensureIsObject().ensureIsType(Container);

        if (container == null)
        {
            this._container = new Container();
            this._ownsContainer = true;
        }
        else
        {
            this._container = container;
            this._ownsContainer = false;
        }
        
        this._jobRegistrations = [];
    }


    public useInstaller(installer: ComponentInstaller): this
    {
        given(installer, "installer").ensureHasValue().ensureIsObject();
        given(this, "this").ensure(t => !t._isBootstrapped, "invoking method after bootstrap");

        this._container.install(installer);
        return this;
    }
    
    public registerJobs(...jobClasses: ReadonlyArray<ClassHierarchy<Job>>): this
    {
        given(jobClasses, "jobClasses").ensureHasValue().ensureIsArray();
        given(this, "this").ensure(t => !t._isBootstrapped, "invoking method after bootstrap");

        for (const job of jobClasses)
        {
            const jobRegistration = new JobRegistration(job);
            
            if (this._jobRegistrations.some(t => t.jobType === jobRegistration.jobType))
                throw new ApplicationException("Duplicate registration detected for Job '{0}'."
                    .format((job as Object).getTypeName()));

            this._container.registerSingleton(jobRegistration.jobTypeName, jobRegistration.jobType);
            this._jobRegistrations.push(jobRegistration);
        }

        return this;
    }
    
    public bootstrap(): void
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);

        given(this, "this")
            .ensure(t => !t._isBootstrapped, "bootstrapping more than once")
            .ensure(t => t._jobRegistrations.length > 0, "no jobs registered");

        if (this._ownsContainer)
            this._container.bootstrap();
        
        this._isBootstrapped = true;
        
        this._jobRegistrations.forEach(t =>
        {
            const instance = this._container.resolve<Job>(t.jobTypeName);
            t.storeJobInstance(instance);
        });
    }
    
    public async beginJobs(): Promise<void>
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        
        given(this, "this")
            .ensure(t => t._isBootstrapped, "not bootstrapped");
        
        this._jobRegistrations.forEach(t => t.jobInstance!.start());
        
        while (!this._isDisposed)
        {
            await Delay.seconds(2);
        }
    }

    public async dispose(): Promise<void>
    {
        if (this._isDisposed)
            return;

        this._isDisposed = true;
        
        await this._container.dispose(); // we let the container take care of disposing the jobs
    }
}


class JobRegistration
{
    private readonly _jobTypeName: string;
    private readonly _jobType: ClassHierarchy<Job>;
    
    private _jobInstance: Job | null;


    public get jobTypeName(): string { return this._jobTypeName; }
    public get jobType(): ClassHierarchy<Job> { return this._jobType; }
    public get jobInstance(): Job | null { return this._jobInstance; }


    public constructor(jobType: ClassHierarchy<Job>)
    {
        given(jobType, "jobType").ensureHasValue().ensureIsFunction();

        this._jobTypeName = (<Object>jobType).getTypeName();
        this._jobType = jobType;
        this._jobInstance = null;
    }
    
    
    public storeJobInstance(job: Job): void
    {
        given(job, "job").ensureHasValue().ensureIsObject();
        given(this, "this").ensure(t => t._jobInstance == null, "already has job instance");
        
        this._jobInstance = job;
    }
}