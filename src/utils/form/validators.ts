import {formValidator, formValue} from './form-control';
import {ValidatorError} from './validator-error';

const EMAIL = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const defaultMessages = {
	empty: 'Поле должно быть заполнено',
	required: 'Поле заполнено неверно',
	maxLength: (length: number) => `Длинна поля не должна быть больше ${length}`,
	minLength: (length: number) => `Длинна поля не должна быть меньше ${length}`,
	noSpaces: 'В поле не должно быть пробелов',
	email: 'Почта должна быть в формате my-email@domen.ru',
};

export class Validators {
	public static empty(error?: ValidatorError): formValidator {
		return function (value: formValue): null | ValidatorError {
			return value
				? null
				: error || new ValidatorError(defaultMessages.empty);
		};
	}

	public static required(regExp: RegExp, error?: ValidatorError): formValidator {
		return function (value: formValue): null | ValidatorError {
			return regExp.test(Validators.nonNullable(value))
				? null
				: error || new ValidatorError(defaultMessages.required);
		};
	}

	public static maxLength(length: number, error?: ValidatorError): formValidator {
		return function (value: formValue): null | ValidatorError {
			return Validators.toString(value).length > length
				? error || new ValidatorError(defaultMessages.maxLength(length))
				: null;
		};
	}

	public static minLength(length: number, error?: ValidatorError): formValidator {
		return function (value: formValue): null | ValidatorError {
			return Validators.toString(value).length < length
				? error || new ValidatorError(defaultMessages.minLength(length))
				: null;
		};
	}

	public static noSpaces(error?: ValidatorError): formValidator {
		return function (value: formValue): null | ValidatorError {
			return /\s/g.test(Validators.toString(value).trim())
				? error || new ValidatorError(defaultMessages.noSpaces)
				: null;
		};
	}

	public static email(error?: ValidatorError): formValidator {
		return function (value: formValue): null | ValidatorError {
			return EMAIL.test(Validators.toString(value).toLowerCase())
				? null
				: error || new ValidatorError(defaultMessages.email);
		};
	}

	private static nonNullable(value: formValue): NonNullable<formValue> {
		return value === undefined || value === null ? '' : value;
	}

	private static toString(value: formValue): string {
		return String(Validators.nonNullable(value));
	}
}
