import { Exception } from "@nivinjoseph/n-exception";

// public
export class InvalidScheduleException extends Exception
{
    public constructor(message: string)
    {
        super(message);
    }
}

