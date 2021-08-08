import { userData } from "../../../store/interfaces/authorization-state.interface";
import { HTTPResponse } from "../../../utils/api/http-client";
import { HTTPClientModule } from "../../../utils/api/http-client-module";
import { HTTPMethod } from "../../../utils/api/http-method";
import { Interceptor } from "../../../utils/interfaces/interceptor";
import { pushUserData } from "./auth-http-client-module";

export type changeUserData = pushUserData;

export interface changePasswordData {
    newPassword: string;
    oldPassword: string;
}

export class UserHTTPClientModule extends HTTPClientModule {
	private static readonly moduleMutualPathname = ['user'];

	constructor(origin: string, mutualPathname: string[], interseptors: Interceptor[] = []) {
		super(origin, mutualPathname.concat(UserHTTPClientModule.moduleMutualPathname), interseptors);
	}

    public changeData(body: changeUserData): Promise<HTTPResponse<userData>> {
        return this.upload({
			method: HTTPMethod.PUT,
			pathname: ['profile'],
			body,
		});
    }

    public changePassword(body: changePasswordData): Promise<HTTPResponse<undefined>> {
        return this.upload({
			method: HTTPMethod.PUT,
			pathname: ['password'],
			body,
		});
    }
}