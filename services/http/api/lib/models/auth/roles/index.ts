import * as dataExporterRole from './dataExporterRole';
import * as clientCreatorRole from './clientCreatorRole';
import * as clientReaderRole from './clientReaderRole';

type allRolesModels = {
	dataExporterRole: dataExporterRole.DataExporterRoleModel,
	clientCreatorRole: clientCreatorRole.ClientCreatorRoleModel,
	clientReaderRole: clientReaderRole.ClientReaderRoleModel,
};

export {
	dataExporterRole,
	clientCreatorRole,
	clientReaderRole,
	allRolesModels
};
