import { Module } from "./module/module";

export class Course {
    name: string;
    imageURL: string;
    description: string;
    id: number;
    category: string;
    status: string;
    modules: Array<Module>

    constructor(name: string, id: number, imageURL: string, description: string, category: string, status: string, modules: Array<Module>) {
        this.name = name;
        this.id = id;
        this.imageURL = imageURL;
        this.description = description;
        this.category = category;
        this.status = status;
        this.modules = modules;
    }

}