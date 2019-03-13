import { ComponentInstaller } from "@nivinjoseph/n-ject";
export interface JobConfig {
    jobClasses: ReadonlyArray<Function>;
    iocInstaller?: ComponentInstaller;
}
