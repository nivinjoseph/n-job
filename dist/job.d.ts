import { Disposable } from "@nivinjoseph/n-util";
export interface Job extends Disposable {
    start(): void;
}
