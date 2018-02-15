import { Title } from "./title";
import { Paragraph } from "./paragraph";
export class Slide {

    title: Title;
    paragraph: Paragraph;
    image: string;
    bgImage: string;
    color: string;
    type: string;
    id: number;
    fragmentcount: number;
    order_id: number
    constructor(title: Title, paragraph: Paragraph, image: string, bgImage: string, color: string, type: string, id: number, fragmentcount: number, order_id: number) {

        this.title = title;
        this.paragraph = paragraph;
        this.image = image;
        this.bgImage = bgImage;
        this.color = color;
        this.type = type;
        this.id = id;
        this.fragmentcount = fragmentcount;
        this.order_id = order_id;

    }
}