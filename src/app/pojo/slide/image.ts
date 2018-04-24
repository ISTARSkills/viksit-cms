export class CMSImage {

    url: string;
    fragment_order: number;
    transition_type: string;
    fragment_duration: number;
    constructor(url: string, fragment_order: number, transition_type: string, fragment_duration: number) {
        this.url = url;
        this.fragment_order = fragment_order;
        this.transition_type = transition_type;
        this.fragment_duration = fragment_duration;


    }
}