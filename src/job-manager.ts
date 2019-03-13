import { given } from "@nivinjoseph/n-defensive";
import { Container, Registry, Scope } from "@nivinjoseph/n-ject";
import { ObjectDisposedException } from "@nivinjoseph/n-exception";
import { Disposable } from "@nivinjoseph/n-util";
import { JobConfig } from "./job-config";
import { Job } from "./job";

// public
export class JobManager implements Disposable
{
    private readonly _container: Container;
    private readonly _jobRegistrations: ReadonlyArray<JobRegistration>;

    private _isDisposed = false;
    private _isBootstrapped = false;


    public get containerRegistry(): Registry { return this._container; }


    public constructor(config: JobConfig)
    {
        given(config, "config").ensureHasValue().ensureIsObject();

        this._container = new Container();
        if (config.iocInstaller)
            this._container.install(config.iocInstaller);

        this._jobRegistrations = this.createJobRegistrations(config.jobClasses);
    }


    public bootstrap(): void
    {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);

        given(this, "this").ensure(t => !t._isBootstrapped, "bootstrapping more than once");

        this._container.bootstrap();

        this._jobRegistrations.forEach(t =>
        {
            const scope = this._container.createScope();
            const instance = scope.resolve<Job>(t.jobTypeName);
            t.storeJobScope(scope);
            t.storeJobInstance(instance);
        });

        this._isBootstrapped = true;
    }

    public async dispose(): Promise<void>
    {
        if (this._isDisposed)
            return;

        this._isDisposed = true;

        await this._jobRegistrations.forEachAsync(async t =>
        {
            try 
            {
                if (t.jobScope)
                    await t.jobScope.dispose();    
            }
            catch (error)
            {
                console.error(error);
            }
        });
        
        await this._container.dispose();
    }


    private createJobRegistrations(jobClasses: ReadonlyArray<Function>): ReadonlyArray<JobRegistration>
    {
        given(jobClasses, "jobClasses").ensureHasValue().ensureIsArray();

        const jobRegistrations = jobClasses.map(t => new JobRegistration(t));

        jobRegistrations.forEach(t => this._container.registerScoped(t.jobTypeName, t.jobType));

        return jobRegistrations;
    }
}


class JobRegistration
{
    private readonly _jobTypeName: string;
    private readonly _jobType: Function;
    
    private _jobScope: Scope | null;
    private _jobInstance: Job | null;


    public get jobTypeName(): string { return this._jobTypeName; }
    public get jobType(): Function { return this._jobType; }
    public get jobScope(): Scope | null { return this._jobScope; }
    public get jobInstance(): Job | null { return this._jobInstance; }


    public constructor(jobType: Function)
    {
        given(jobType, "jobType").ensureHasValue().ensureIsFunction();

        this._jobTypeName = (<Object>jobType).getTypeName();
        this._jobType = jobType;
        this._jobScope = null;
        this._jobInstance = null;
    }
    
    
    public storeJobScope(scope: Scope): void
    {
        given(scope, "scope").ensureHasValue().ensureIsObject();
        given(this, "this").ensure(t => t._jobScope == null, "storing job scope twice");

        this._jobScope = scope;
    }
    
    public storeJobInstance(job: Job): void
    {
        given(job, "job").ensureHasValue().ensureIsObject();
        given(this, "this").ensure(t => t._jobInstance == null, "storing job instance twice");
        
        this._jobInstance = job;
    }
}