import * as roles from './roles';
import * as serviceUser from './serviceUser';
import * as apiKey from './apiKey';

type allAuthModels = {
	serviceUser: serviceUser.ServiceUserModel,
	apiKey: apiKey.ApiKeyModel,
	roles: roles.allRolesModels,
}

export {
	roles,
	serviceUser,
	apiKey,
	allAuthModels
};
