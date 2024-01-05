import { given } from "@nivinjoseph/n-defensive";
import { ApplicationException, ObjectDisposedException } from "@nivinjoseph/n-exception";
import { Container } from "@nivinjoseph/n-ject";
import { Delay } from "@nivinjoseph/n-util";
// public
export class JobManager {
    get containerRegistry() { return this._container; }
    get serviceLocator() { return this._container; }
    constructor(container) {
        this._isDisposed = false;
        this._isBootstrapped = false;
        given(container, "container").ensureIsObject().ensureIsType(Container);
        if (container == null) {
            this._container = new Container();
            this._ownsContainer = true;
        }
        else {
            this._container = container;
            this._ownsContainer = false;
        }
        this._jobRegistrations = [];
    }
    useInstaller(installer) {
        given(installer, "installer").ensureHasValue().ensureIsObject();
        given(this, "this").ensure(t => !t._isBootstrapped, "invoking method after bootstrap");
        this._container.install(installer);
        return this;
    }
    registerJobs(...jobClasses) {
        given(jobClasses, "jobClasses").ensureHasValue().ensureIsArray();
        given(this, "this").ensure(t => !t._isBootstrapped, "invoking method after bootstrap");
        for (const job of jobClasses) {
            const jobRegistration = new JobRegistration(job);
            if (this._jobRegistrations.some(t => t.jobType === jobRegistration.jobType))
                throw new ApplicationException("Duplicate registration detected for Job '{0}'."
                    .format(job.getTypeName()));
            this._container.registerSingleton(jobRegistration.jobTypeName, jobRegistration.jobType);
            this._jobRegistrations.push(jobRegistration);
        }
        return this;
    }
    bootstrap() {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        given(this, "this")
            .ensure(t => !t._isBootstrapped, "bootstrapping more than once")
            .ensure(t => t._jobRegistrations.length > 0, "no jobs registered");
        if (this._ownsContainer)
            this._container.bootstrap();
        this._isBootstrapped = true;
        this._jobRegistrations.forEach(t => {
            const instance = this._container.resolve(t.jobTypeName);
            t.storeJobInstance(instance);
        });
    }
    async beginJobs() {
        if (this._isDisposed)
            throw new ObjectDisposedException(this);
        given(this, "this")
            .ensure(t => t._isBootstrapped, "not bootstrapped");
        this._jobRegistrations.forEach(t => t.jobInstance.start());
        while (!this._isDisposed) {
            await Delay.seconds(2);
        }
    }
    async dispose() {
        if (this._isDisposed)
            return;
        this._isDisposed = true;
        await this._container.dispose(); // we let the container take care of disposing the jobs
    }
}
class JobRegistration {
    get jobTypeName() { return this._jobTypeName; }
    get jobType() { return this._jobType; }
    get jobInstance() { return this._jobInstance; }
    constructor(jobType) {
        given(jobType, "jobType").ensureHasValue().ensureIsFunction();
        this._jobTypeName = jobType.getTypeName();
        this._jobType = jobType;
        this._jobInstance = null;
    }
    storeJobInstance(job) {
        given(job, "job").ensureHasValue().ensureIsObject();
        given(this, "this").ensure(t => t._jobInstance == null, "already has job instance");
        this._jobInstance = job;
    }
}
//# sourceMappingURL=job-manager.js.map