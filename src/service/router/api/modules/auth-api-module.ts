import {HTTPMethod} from '../../../../utils/api/http-method';
import {ApiModule} from '../../../../utils/api/api-module';

export interface RegistrationData {
    first_name: string,
    second_name: string,
    login: string,
    email: string,
    password: string,
    phone: string,
}

export interface AuthorizationData {
    login: string,
    password: string,
}

export class AuthApiModule extends ApiModule {
	public registration(body: RegistrationData): Promise<XMLHttpRequest> {
		return this.upload({
			method: HTTPMethod.POST,
			pathname: ['registration'],
			body,
		});
	}

	public authorization(body: AuthorizationData): Promise<XMLHttpRequest> {
		return this.upload({
			method: HTTPMethod.POST,
			pathname: ['auth'],
			body,
		});
	}
}
