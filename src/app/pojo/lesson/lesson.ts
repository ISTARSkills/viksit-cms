export class Lesson {

    name: string;
    description: string;
    status: string;
    imageURL: string;
    id: number;
    type: string;
    isRetryable: boolean;
    duration: number;
    constructor(name: string, description: string, status: string, imageURL: string, id: number, type: string) {
        this.name = name;
        this.description = description;
        this.status = status;
        this.imageURL = imageURL;
        this.id = id;
        this.type = type;
    }
}