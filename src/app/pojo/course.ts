import { Module } from "./module/module";
import { Issue } from "./issue/issue";

export class Course {
    name: string;
    imageURL: string;
    description: string;
    id: number;
    category: string;
    status: string;
    modules: Array<Module>
    issues: Array<Issue>


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