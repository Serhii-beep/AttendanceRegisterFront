export interface Lesson {
    id: number;
    subjectClassId: number;
    theme: string;
    date: Date;
    isFinal: boolean;
    isSemester: boolean;
    isAnnual: boolean;
    sectionId: number;
}