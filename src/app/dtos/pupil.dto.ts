import { Class } from "./class.dto";

export interface Pupil {
    id: number;
    fullName: string;
    email: string;
    class: Class;
    address: string;
    birthDate: Date;
    login: string;
    password: string;
}