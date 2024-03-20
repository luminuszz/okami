import { faker } from '@faker-js/faker';
import { EmailValidationCode } from './email-validation-code';
import dayjs from 'dayjs';

describe('EmailValidationCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to create a new EmailValidationCode', () => {
    const code = faker.string.uuid();

    const emailValidationCode = new EmailValidationCode(code);

    expect(emailValidationCode.getCode()).toBe(code);
    expect(emailValidationCode.isEmailValidated()).toBe(false);
  });

  it('should be able to validate  code', () => {
    const code = faker.string.uuid();

    const emailValidationCode = new EmailValidationCode(code);

    emailValidationCode.validateEmail();

    expect(emailValidationCode.getCode()).toBe(null);
    expect(emailValidationCode.isEmailValidated()).toBe(true);
  });

  it('should be able to validate email with email is not expired', () => {
    const code = faker.string.uuid();

    const emailValidationCode = new EmailValidationCode(code);

    emailValidationCode.validateEmail();

    expect(emailValidationCode.getCode()).toBe(null);
    expect(emailValidationCode.isEmailValidated()).toBe(true);
  });

  it('should  not be  able to validate email with email is expired', async () => {
    const code = faker.string.uuid();

    const emailValidationCode = new EmailValidationCode(code);

    // set system time to 2 hours in the future
    jest.useFakeTimers().setSystemTime(dayjs().add(2, 'hours').toDate());

    expect(emailValidationCode.validateEmail).toThrowError(Error);
  });
});
