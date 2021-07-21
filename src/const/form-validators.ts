import {ValidatorError} from '../utils/form/validator-error';
import {Validators} from '../utils/form/validators';

const defaultValidators = [Validators.noSpaces(), Validators.maxLength(50), Validators.empty()];

export const formValidators = {
    password: [...defaultValidators, Validators.minLength(6)],
    login: [...defaultValidators, Validators.minLength(4)],
    first_name: [...defaultValidators],
    second_name: [...defaultValidators],
    email: [...defaultValidators, Validators.email()],
    phone: [
        ...defaultValidators,
        Validators.required(
            /^\+?\d+$/,
            new ValidatorError('Телефон может содержать только цифры и "+" в начале'),
        ),
    ],
    display_name: [...defaultValidators, Validators.minLength(4)],
};
