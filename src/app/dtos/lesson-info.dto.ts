import { Mark } from "./mark.dto";

export interface LessonInfo {
    id: number;
    subjectClassId: number;
    theme: string;
    date: Date;
    isFinal: boolean;
    isSemester: boolean;
    isAnnual: boolean;
    sectionId: number;
    marks: Mark[];
}