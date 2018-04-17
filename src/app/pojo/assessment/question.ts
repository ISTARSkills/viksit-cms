import { Option } from "./option";
import { Skill } from "../skill/skill";

export class Question {

    id: number;
    type: string;
    text: string;
    explanation: string;
    comprehensive_passage: string;
    duration: string;
    options: Array<Option>;
    learning_objectives: Array<Skill>;
    constructor(id: number, type: string, text: string, duration: string, options: Array<Option>, learning_objectives: Array<Skill>) {
        this.id = id;
        this.text = text;
        this.type = type;
        this.duration = duration;
        this.options = options;
        this.learning_objectives = learning_objectives;

    }

}