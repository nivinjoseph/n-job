"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const n_ject_1 = require("@nivinjoseph/n-ject");
const n_exception_1 = require("@nivinjoseph/n-exception");
class JobManager {
    constructor(config) {
        this._isDisposed = false;
        this._isBootstrapped = false;
        n_defensive_1.given(config, "config").ensureHasValue().ensureIsObject();
        this._container = new n_ject_1.Container();
        if (config.iocInstaller)
            this._container.install(config.iocInstaller);
        this._jobRegistrations = this.createJobRegistrations(config.jobClasses);
    }
    get containerRegistry() { return this._container; }
    bootstrap() {
        if (this._isDisposed)
            throw new n_exception_1.ObjectDisposedException(this);
        n_defensive_1.given(this, "this").ensure(t => !t._isBootstrapped, "bootstrapping more than once");
        this._container.bootstrap();
        this._jobRegistrations.forEach(t => t.storeJobInstance(this._container.resolve(t.jobTypeName)));
        this._isBootstrapped = true;
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isDisposed)
                return;
            this._isDisposed = true;
            yield this._container.dispose();
        });
    }
    createJobRegistrations(jobClasses) {
        n_defensive_1.given(jobClasses, "jobClasses").ensureHasValue().ensureIsArray();
        const jobRegistrations = jobClasses.map(t => new JobRegistration(t));
        jobRegistrations.forEach(t => this._container.registerSingleton(t.jobTypeName, t.jobType));
        return jobRegistrations;
    }
}
exports.JobManager = JobManager;
class JobRegistration {
    get jobTypeName() { return this._jobTypeName; }
    get jobType() { return this._jobType; }
    get jobInstance() { return this._jobInstance; }
    constructor(jobType) {
        n_defensive_1.given(jobType, "jobType").ensureHasValue().ensureIsFunction();
        this._jobTypeName = jobType.getTypeName();
        this._jobType = jobType;
        this._jobInstance = null;
    }
    storeJobInstance(job) {
        n_defensive_1.given(job, "job").ensureHasValue().ensureIsObject();
        n_defensive_1.given(this, "this").ensure(t => t._jobInstance == null, "storing job instance twice");
        this._jobInstance = job;
    }
}
//# sourceMappingURL=job-manager.js.map