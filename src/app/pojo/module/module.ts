import { Session } from "../session/session";
export class Module {

    name: string;
    description: string;
    progress: number;
    sessions: Array<Session>
    imageURL: string;
    status: string;
    id: number;
    constructor(name: string, description: string, progress: number, sessions: Array<Session>, imageURL: string, status: string, id: number) {
        this.name = name;
        this.description = description;
        this.progress = progress;
        this.sessions = sessions;
        this.imageURL = imageURL;
        this.status = status;
        this.id = id;
    }
}