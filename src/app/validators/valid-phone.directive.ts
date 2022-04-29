import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function validPhone(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isInvalid =
      /\b\d{3}[-]?\d{3}[-]?\d{4}|\d{2}[-]?\d{3}[-]?\d{4}|\d{1}[-]?\d{3}[-]?\d{6}|\d{1}[-]?\d{3}[-]?\d{2}[-]?\d{2}[-]?\d{2}|\*{1}?\d{2,5}\b/g.test(
        control.value
      ); // source - https://regex101.com/library/oD5lQ5
    return isInvalid ? { validPhone: { value: control.value } } : null;
  };
}
