import { CMSImage } from "./image";

export class InteractiveList {

    text: string;
    description: string;
    id: number
    image: CMSImage;
    gridX: number;
    gridY: number;
    isMultiSelect: boolean;
    fragmentAudioUrl: string;
    points: number;
    xp: number;
    isCorrectOption: boolean;
    transition_type: string;
    destination_slide: number;
    constructor(text: string, description: string, id: number, image: CMSImage, fragmentAudioUrl: string, isMultiSelect: boolean, points: number,
        xp: number, isCorrectOption: boolean, destination_slide: number, transition_type: string) {
        this.text = text;
        this.description = description;
        this.id = id;
        this.image = image;
        this.fragmentAudioUrl = fragmentAudioUrl;
        this.isMultiSelect = isMultiSelect;
        this.points = points;
        this.xp = xp;
        this.isCorrectOption = isCorrectOption;
        this.destination_slide = destination_slide;
        this.transition_type = transition_type;
    }

}