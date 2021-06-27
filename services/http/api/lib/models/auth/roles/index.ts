import * as dataExporterRole from './dataExporterRole';
import * as appUserCreatorRole from './appUserCreatorRole';
import * as appUserReaderRole from './appUserReaderRole';

type allRolesModels = {
	dataExporterRole: dataExporterRole.DataExporterRoleModel,
	appUserCreatorRole: appUserCreatorRole.AppUserCreatorRoleModel,
	appUserReaderRole: appUserReaderRole.AppUserReaderRoleModel,
};

export {
	dataExporterRole,
	appUserCreatorRole,
	appUserReaderRole,
	allRolesModels
};
