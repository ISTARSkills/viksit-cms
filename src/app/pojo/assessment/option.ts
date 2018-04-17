export class Option {

    id: number;
    marking_schema: boolean;
    text: string;

    constructor(id: number, marking_schema: boolean, text: string) {
        this.id = id;
        this.marking_schema = marking_schema;
        this.text = text;
    }
}