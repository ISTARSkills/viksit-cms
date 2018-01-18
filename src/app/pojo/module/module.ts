import { Session } from "../session/session";
export class Module {

    name: string;
    description: string;
    progress: number;
    sessions: Array<Session>
    imageURL: string;
    status: string;

    constructor(name: string, description: string, progress: number, sessions: Array<Session>, imageURL: string, status: string) {
        this.name = name;
        this.description = description;
        this.progress = progress;
        this.sessions = sessions;
        this.imageURL = imageURL;
        this.status = status;
    }
}