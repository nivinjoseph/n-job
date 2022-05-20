"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobManager = void 0;
const tslib_1 = require("tslib");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const n_ject_1 = require("@nivinjoseph/n-ject");
const n_exception_1 = require("@nivinjoseph/n-exception");
const n_util_1 = require("@nivinjoseph/n-util");
// public
class JobManager {
    constructor(container) {
        this._isDisposed = false;
        this._isBootstrapped = false;
        (0, n_defensive_1.given)(container, "container").ensureIsObject().ensureIsType(n_ject_1.Container);
        if (container == null) {
            this._container = new n_ject_1.Container();
            this._ownsContainer = true;
        }
        else {
            this._container = container;
            this._ownsContainer = false;
        }
        this._jobRegistrations = [];
    }
    get containerRegistry() { return this._container; }
    get serviceLocator() { return this._container; }
    useInstaller(installer) {
        (0, n_defensive_1.given)(installer, "installer").ensureHasValue().ensureIsObject();
        (0, n_defensive_1.given)(this, "this").ensure(t => !t._isBootstrapped, "invoking method after bootstrap");
        this._container.install(installer);
        return this;
    }
    registerJobs(...jobClasses) {
        (0, n_defensive_1.given)(jobClasses, "jobClasses").ensureHasValue().ensureIsArray();
        (0, n_defensive_1.given)(this, "this").ensure(t => !t._isBootstrapped, "invoking method after bootstrap");
        for (const job of jobClasses) {
            const jobRegistration = new JobRegistration(job);
            if (this._jobRegistrations.some(t => t.jobType === jobRegistration.jobType))
                throw new n_exception_1.ApplicationException("Duplicate registration detected for Job '{0}'."
                    .format(job.getTypeName()));
            this._container.registerSingleton(jobRegistration.jobTypeName, jobRegistration.jobType);
            this._jobRegistrations.push(jobRegistration);
        }
        return this;
    }
    bootstrap() {
        if (this._isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        (0, n_defensive_1.given)(this, "this")
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
    beginJobs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                throw new n_exception_1.ObjectDisposedException(this);
            (0, n_defensive_1.given)(this, "this")
                .ensure(t => t._isBootstrapped, "not bootstrapped");
            this._jobRegistrations.forEach(t => t.jobInstance.start());
            while (!this._isDisposed) {
                yield n_util_1.Delay.seconds(2);
            }
        });
    }
    dispose() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                return;
            this._isDisposed = true;
            yield this._container.dispose(); // we let the container take care of disposing the jobs
        });
    }
}
exports.JobManager = JobManager;
class JobRegistration {
    constructor(jobType) {
        (0, n_defensive_1.given)(jobType, "jobType").ensureHasValue().ensureIsFunction();
        this._jobTypeName = jobType.getTypeName();
        this._jobType = jobType;
        this._jobInstance = null;
    }
    get jobTypeName() { return this._jobTypeName; }
    get jobType() { return this._jobType; }
    get jobInstance() { return this._jobInstance; }
    storeJobInstance(job) {
        (0, n_defensive_1.given)(job, "job").ensureHasValue().ensureIsObject();
        (0, n_defensive_1.given)(this, "this").ensure(t => t._jobInstance == null, "already has job instance");
        this._jobInstance = job;
    }
}
//# sourceMappingURL=job-manager.js.map