import { Image } from "./image";

export class InteractiveList {

    text: string;
    description: string;
    id: number
    image: Image;
    gridX: number;
    gridY: number;
    isMultiSelect: boolean;
    fragmentAudioUrl: string;
    points: number;
    xp: number;
    isCorrectOption: boolean;
    destination_slide: number;
    constructor(text: string, description: string, id: number, image: Image, fragmentAudioUrl: string, isMultiSelect: boolean, points: number,
        xp: number, isCorrectOption: boolean, destination_slide: number) {
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
    }

}