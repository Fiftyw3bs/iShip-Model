import { Errors, OkMessage, Result } from "./Errors";
import { LocalizedStrings, LocalizedStringsMethods } from "localized-strings";

export interface IStrings extends LocalizedStringsMethods{
    score:string;
    time: string;
}
 
interface INotification {
    sendMessage(to: string, message: string, _attachments?: Array<string>): Promise<void>
}

interface INotificationConstructor {
    new(message_interpreter: unknown): INotification
}

class MessageInterpreter {

    strings: IStrings;

    constructor() {
        this.strings = new LocalizedStrings({
                    it: {
                        score: "Punti",
                        time: "Tempo"
                    },
                    en: {
                        score: "Score",
                        time: "Time"
                    }
                });
    }

    
    public static interpret(message: Result<OkMessage, Errors>): string {
        switch (message.val) {
            case value:
                
                break;
        
            default:
                break;
        }
    }

}

declare const INotification: INotificationConstructor;
export default INotification;