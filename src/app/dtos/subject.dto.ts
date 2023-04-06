import { Class } from "./class.dto";
import { Teacher } from "./teacher.dto";

export interface Subject {
    id: number;
    name: string;
    teachers: Teacher[];
    classes: Class[];
}