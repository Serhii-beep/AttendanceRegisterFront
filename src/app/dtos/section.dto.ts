import { Lesson } from "./lesson.dto";

export interface Section {
    id: number;
    term: number;
    name: string;
    lessons: Lesson[];
}