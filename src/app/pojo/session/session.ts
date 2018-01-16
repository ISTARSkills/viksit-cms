import { Lesson } from "../lesson/lesson";
export class Session {

    name: string;
    description: string;
    progress: number;
    lessons: Array<Lesson>

    constructor(name: string, description: string, progress: number, lessons: Array<Lesson>) {
        this.name = name;
        this.description = description;
        this.progress = progress;
        this.lessons = lessons;
    }
}