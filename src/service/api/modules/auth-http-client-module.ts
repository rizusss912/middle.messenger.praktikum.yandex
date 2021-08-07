import {HTTPMethod} from '../../../utils/api/http-method';
import { HTTPClientModule } from '../../../utils/api/http-client-module';
import { HTTPResponse } from '../../../utils/api/http-client';
import { userData } from '../../../store/interfaces/authorization-state.interface';
import { Interceptor } from '../../../utils/interfaces/interceptor';

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

	constructor(origin: string, mutualPathname: string[], interseptors: Interceptor[] = []) {
		super(origin, mutualPathname.concat(AuthHTTPClientModule.moduleMutualPathname), interseptors);
	}

	public registration(body: RegistrationData): Promise<HTTPResponse<{id: number}>> {
		return this.upload({
			method: HTTPMethod.POST,
			pathname: ['signup'],
			body,
		});
	}

	public authorization(body: AuthorizationData): Promise<HTTPResponse<undefined>> {
		return this.upload({
			method: HTTPMethod.POST,
			pathname: ['signin'],
			body,
		});
	}

	public logout(): Promise<HTTPResponse<undefined>> {
		return this.upload({
			method: HTTPMethod.POST,
			pathname: ['logout'],
		});
	}

	public getUserData(): Promise<HTTPResponse<userData>> {
		return this.upload({
			method: HTTPMethod.GET,
			pathname: ['user'],
		});
    }
}
