export class Lesson {

    name: string;
    description: string;
    progress: number;


    constructor(name: string, description: string, progress: number) {
        this.name = name;
        this.description = description;
        this.progress = progress;
    }
}