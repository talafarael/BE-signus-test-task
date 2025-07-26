import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsFullNameConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    if (typeof value !== 'string') return false;
    return /^[A-Za-zА-Яа-яёЁ]+\s[A-Za-zА-Яа-яёЁ]+$/.test(value.trim());
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Full name must consist of exactly two words (e.g., "John Doe")';
  }
}

export function IsFullName(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsFullNameConstraint,
    });
  };
}
