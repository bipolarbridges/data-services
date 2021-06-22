import * as roles from './roles';
import * as userIdentity from './userIdentity';
import * as apiKey from './apiKey';

type allAuthModels = {
	userIdentity: userIdentity.UserIdentityModel,
	apiKey: apiKey.ApiKeyModel,
	roles: roles.allRolesModels,
}

export {
	roles,
	userIdentity,
	apiKey,
	allAuthModels
};
