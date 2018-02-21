export class SubTitle {

    text: string;
    fragment_order: number;
    transition_type: string;
    fragment_duration: number;
    constructor(text: string, fragment_order: number, transition_type: string, fragment_duration: number) {
        this.text = text;
        this.fragment_order = fragment_order;
        this.transition_type = transition_type;
        this.fragment_duration = fragment_duration;


    }
}