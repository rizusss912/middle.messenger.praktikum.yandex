import {HTTPMethod} from '../../../utils/api/http-method';
import {HTTPClientModule} from '../../../utils/api/http-client-module';
import {HTTPResponse} from '../../../utils/api/http-client';
import {userData} from '../../../store/interfaces/authorization-state.interface';
import {Interceptor} from '../../../utils/interfaces/interceptor';

export type pushUserData = Omit<Omit<userData, 'id'>, 'avatarUrl'>;
export type registrationData = Omit<pushUserData, 'display_name'>;

export interface authorizationData {
    login: string,
    password: string,
}

export class AuthHTTPClientModule extends HTTPClientModule {
	private static readonly moduleMutualPathname = ['auth'];

	constructor(origin: string, mutualPathname: string[], interseptors: Interceptor[] = []) {
		super(
			origin,
			mutualPathname.concat(AuthHTTPClientModule.moduleMutualPathname),
			interseptors,
		);
	}

	public registration(body: registrationData): Promise<HTTPResponse<{id: number}>> {
		return this.upload({
			method: HTTPMethod.POST,
			pathname: ['signup'],
			body,
		});
	}

	public authorization(body: authorizationData): Promise<HTTPResponse<undefined>> {
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
