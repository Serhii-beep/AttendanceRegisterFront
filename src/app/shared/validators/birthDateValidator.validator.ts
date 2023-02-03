import { AbstractControl } from "@angular/forms";

export function ValidateBirthDate(control: AbstractControl) {
    let date = new Date(control.value).getFullYear();
    let today = new Date().getFullYear();
    if(date < today - 19 || date > today - 5) {
        return { invalidDate: true };
    }
    return null;
}