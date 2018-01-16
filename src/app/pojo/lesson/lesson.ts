export class Lesson {

    title: string;
    description: string;
    progress: number;
    status: string;


    constructor(title: string, description: string, progress: number, status: string) {
        this.title = title;
        this.description = description;
        this.progress = progress;
        this.status = status;
    }
}