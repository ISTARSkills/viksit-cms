export class Lesson {

    title: string;
    description: string;
    progress: number;
    status: string;
    imageURL: string;

    constructor(title: string, description: string, progress: number, status: string, imageURL: string) {
        this.title = title;
        this.description = description;
        this.progress = progress;
        this.status = status;
        this.imageURL = imageURL;
    }
}