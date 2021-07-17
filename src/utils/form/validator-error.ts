export enum ValidationErrorType {
    shown,
    hidden,
}

export class ValidatorError extends Error {
    public readonly type: ValidationErrorType;

    constructor(message: string, type: ValidationErrorType = ValidationErrorType.shown) {
        super(message);

        this.type = type;
    }

    public equals(other: ValidatorError): boolean {
        return other.type === this.type && other.message === this.message;
    }
}