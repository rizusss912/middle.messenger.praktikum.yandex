import {HTTPMethod} from '../../../utils/api/http-method';
import { HTTPClientModule } from '../../../utils/api/http-client-module';

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

export class AuthHTTPClientModule extends HTTPClientModule {
	private static readonly moduleMutualPathname = ['auth'];

	constructor(origin: string, mutualPathname: string[]) {
		super(origin, mutualPathname.concat(AuthHTTPClientModule.moduleMutualPathname));
	}

	public registration(body: RegistrationData): Promise<XMLHttpRequest> {
		return this.upload({
			method: HTTPMethod.POST,
			pathname: ['signup'],
			body,
		});
	}

	public authorization(body: AuthorizationData): Promise<XMLHttpRequest> {
		return this.upload({
			method: HTTPMethod.POST,
			pathname: ['signin'],
			body,
		});
	}
}
