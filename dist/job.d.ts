import { Disposable } from "@nivinjoseph/n-util";
/**
 * @description A Job is a Singleton. Hence it cannot have Scoped dependencies.
 */
export interface Job extends Disposable {
    start(): void;
}
//# sourceMappingURL=job.d.ts.map