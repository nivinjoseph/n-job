import { ComponentInstaller } from "@nivinjoseph/n-ject";

// public
export interface JobConfig
{
    jobClasses: ReadonlyArray<Function>;
    iocInstaller?: ComponentInstaller;
}