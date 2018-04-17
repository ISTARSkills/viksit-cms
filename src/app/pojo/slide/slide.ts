import { Title } from "./title";
import { SubTitle } from "./subtitle";
import { Paragraph } from "./paragraph";
import { List } from "./list";
import { Image } from "./image";
import { InteractiveList } from "./interactivelist";
import { EvaluationList } from "./evaluation";
import { Skill } from "../skill/skill";

export class Slide {

    title: Title;
    subTitle: SubTitle;
    paragraph: Paragraph;
    image: Image;
    bgImage: string;
    videoUrl: string;
    color: string;
    fontColor: string;
    type: string;
    id: number;
    fragmentcount: number;
    order_id: number;
    audioUrl: string;
    stage_id: number;
    list: Array<List>
    interactivelist: Array<InteractiveList>
    destination_slide: number;
    learning_objectives: Array<Skill>
    constructor(title: Title, paragraph: Paragraph, image: Image, bgImage: string, color: string, type: string, id: number, fragmentcount: number, order_id: number, audioUrl: string, list: Array<List>, subTitle: SubTitle, interactivelist: Array<InteractiveList>, stage_id: number, learning_objectives: Array<Skill>) {
        this.title = title;
        this.paragraph = paragraph;
        this.image = image;
        this.bgImage = bgImage;
        this.color = color;
        this.type = type;
        this.id = id;
        this.fragmentcount = fragmentcount;
        this.order_id = order_id;
        this.audioUrl = audioUrl;
        this.list = list;
        this.subTitle = subTitle;
        this.interactivelist = interactivelist;
        this.stage_id = stage_id;
        this.learning_objectives = learning_objectives;
    }
}