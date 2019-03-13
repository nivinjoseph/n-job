import { Disposable } from "@nivinjoseph/n-util";

// public
/**
 * @description A Job is a Singleton. Hence it cannot have Scoped dependencies.
 */
export interface Job extends Disposable
{
    run(): Promise<void>;
}