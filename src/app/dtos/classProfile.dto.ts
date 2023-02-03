import { Class } from "./class.dto";

export interface ClassProfile {
    id: number;
    profileName: string;
    classes: Class[];
}