import { IsFullNameConstraint } from './full-name.validator';
import { ValidationArguments } from 'class-validator';

describe('IsFullNameConstraint', () => {
  let constraint: IsFullNameConstraint;
  let mockValidationArguments: ValidationArguments;

  beforeEach(() => {
    constraint = new IsFullNameConstraint();
    mockValidationArguments = {
      value: '',
      constraints: [],
      targetName: 'TestClass',
      property: 'fullName',
      object: {},
    };
  });

  describe('validate', () => {
    it('should return true for valid full names with two words', () => {
      const validNames = [
        'John Doe',
        'Jane Smith',
        'Alice Johnson',
        'Bob Wilson',
        'Mary Brown',
      ];

      validNames.forEach((name) => {
        expect(constraint.validate(name, mockValidationArguments)).toBe(true);
      });
    });

    it('should return true for valid names with Cyrillic characters', () => {
      const validCyrillicNames = [
        'Иван Петров',
        'Мария Сидорова',
        'Алексей Козлов',
        'Анна Волкова',
        'Дмитрий Новиков',
      ];

      validCyrillicNames.forEach((name) => {
        expect(constraint.validate(name, mockValidationArguments)).toBe(true);
      });
    });

    it('should return true for names with mixed case', () => {
      const mixedCaseNames = [
        'john doe',
        'JANE SMITH',
        'Alice JOHNSON',
        'bob Wilson',
      ];

      mixedCaseNames.forEach((name) => {
        expect(constraint.validate(name, mockValidationArguments)).toBe(true);
      });
    });

    it('should return true for names with extra whitespace (trimmed)', () => {
      const namesWithWhitespace = [
        '  John Doe  ',
        '\tJane Smith\t',
        '\n Alice Johnson \n',
      ];

      namesWithWhitespace.forEach((name) => {
        expect(constraint.validate(name, mockValidationArguments)).toBe(true);
      });
    });

    it('should return false for single word names', () => {
      const singleWordNames = ['John', 'Jane', 'Alice', 'Bob', 'Mary'];

      singleWordNames.forEach((name) => {
        expect(constraint.validate(name, mockValidationArguments)).toBe(false);
      });
    });

    it('should return false for names with more than two words', () => {
      const multipleWordNames = [
        'John Michael Doe',
        'Jane Marie Smith Johnson',
        'Alice Bob Charlie',
        'Mary Jane Watson Parker',
      ];

      multipleWordNames.forEach((name) => {
        expect(constraint.validate(name, mockValidationArguments)).toBe(false);
      });
    });

    it('should return false for empty string', () => {
      expect(constraint.validate('', mockValidationArguments)).toBe(false);
    });

    it('should return false for string with only whitespace', () => {
      const whitespaceStrings = [' ', '  ', '\t', '\n', '   \t   \n   '];

      whitespaceStrings.forEach((str) => {
        expect(constraint.validate(str, mockValidationArguments)).toBe(false);
      });
    });

    it('should return false for names with numbers', () => {
      const namesWithNumbers = [
        'John 123',
        'Jane Smith2',
        '123 Doe',
        'Alice 4Johnson',
      ];

      namesWithNumbers.forEach((name) => {
        expect(constraint.validate(name, mockValidationArguments)).toBe(false);
      });
    });

    it('should return false for names with special characters', () => {
      const namesWithSpecialChars = [
        'John @Doe',
        'Jane Smith!',
        'Alice-Johnson',
        'Bob_Wilson',
        'Mary.Brown',
        'John$Doe',
        'Jane%Smith',
      ];

      namesWithSpecialChars.forEach((name) => {
        expect(constraint.validate(name, mockValidationArguments)).toBe(false);
      });
    });

    it('should return false for non-string values', () => {
      const nonStringValues = [123, null, undefined, {}, [], true, false];

      nonStringValues.forEach((value) => {
        expect(constraint.validate(value as any, mockValidationArguments)).toBe(
          false,
        );
      });
    });

    it('should return false for names with multiple spaces between words', () => {
      const namesWithMultipleSpaces = [
        'John  Doe',
        'Jane   Smith',
        'Alice    Johnson',
      ];

      namesWithMultipleSpaces.forEach((name) => {
        expect(constraint.validate(name, mockValidationArguments)).toBe(false);
      });
    });
  });

  describe('defaultMessage', () => {
    it('should return the correct error message', () => {
      const message = constraint.defaultMessage(mockValidationArguments);
      expect(message).toBe(
        'Full name must consist of exactly two words (e.g., "John Doe")',
      );
    });
  });
});

