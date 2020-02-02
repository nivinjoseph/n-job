"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const n_ject_1 = require("@nivinjoseph/n-ject");
const n_exception_1 = require("@nivinjoseph/n-exception");
const n_util_1 = require("@nivinjoseph/n-util");
// public
class JobManager {
    constructor() {
        this._isDisposed = false;
        this._isBootstrapped = false;
        this._container = new n_ject_1.Container();
        this._jobRegistrations = [];
    }
    get containerRegistry() { return this._container; }
    get serviceLocator() { return this._container; }
    useInstaller(installer) {
        n_defensive_1.given(installer, "installer").ensureHasValue().ensureIsObject();
        n_defensive_1.given(this, "this").ensure(t => !t._isBootstrapped, "invoking method after bootstrap");
        this._container.install(installer);
        return this;
    }
    registerJobs(...jobClasses) {
        n_defensive_1.given(jobClasses, "jobClasses").ensureHasValue().ensureIsArray();
        n_defensive_1.given(this, "this").ensure(t => !t._isBootstrapped, "invoking method after bootstrap");
        for (let job of jobClasses) {
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
        n_defensive_1.given(this, "this")
            .ensure(t => !t._isBootstrapped, "bootstrapping more than once")
            .ensure(t => t._jobRegistrations.length > 0, "no jobs registered");
        this._container.bootstrap();
        this._isBootstrapped = true;
        this._jobRegistrations.forEach(t => {
            const instance = this._container.resolve(t.jobTypeName);
            t.storeJobInstance(instance);
        });
    }
    beginJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                throw new n_exception_1.ObjectDisposedException(this);
            n_defensive_1.given(this, "this")
                .ensure(t => t._isBootstrapped, "not bootstrapped");
            this._jobRegistrations.forEach(t => t.jobInstance.start());
            while (!this._isDisposed) {
                yield n_util_1.Delay.seconds(2);
            }
        });
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
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
        n_defensive_1.given(jobType, "jobType").ensureHasValue().ensureIsFunction();
        this._jobTypeName = jobType.getTypeName();
        this._jobType = jobType;
        this._jobInstance = null;
    }
    get jobTypeName() { return this._jobTypeName; }
    get jobType() { return this._jobType; }
    get jobInstance() { return this._jobInstance; }
    storeJobInstance(job) {
        n_defensive_1.given(job, "job").ensureHasValue().ensureIsObject();
        n_defensive_1.given(this, "this").ensure(t => t._jobInstance == null, "storing job instance twice");
        this._jobInstance = job;
    }
}
//# sourceMappingURL=job-manager.js.map