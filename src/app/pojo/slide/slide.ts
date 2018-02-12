import { Title } from "./title";
import { Paragraph } from "./paragraph";
export class Slide {

    title: Title;
    paragraph: Paragraph;
    image: string;
    bgImage: string;
    bgColor: string;
    type: string;
    id: number;
    fragmentcount: number;
    constructor(title: Title, paragraph: Paragraph, image: string, bgImage: string, bgColor: string, type: string, id: number, fragmentcount: number) {

        this.title = title;
        this.paragraph = paragraph;
        this.image = image;
        this.bgImage = bgImage;
        this.bgColor = bgColor;
        this.type = type;
        this.id = id;
        this.fragmentcount = fragmentcount;

    }
}