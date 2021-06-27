import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import {
		dataExporterRole,
		clientCreatorRole,
} from './roles';

type DataExporterRoleModel = dataExporterRole.DataExporterRoleModel;
type DataExporterRoleInstance = dataExporterRole.DataExporterRoleInstance;
type ClientCreatorRoleModel = clientCreatorRole.ClientCreatorRoleModel;
type ClientCreatorRoleInstance = clientCreatorRole.ClientCreatorRoleInstance;

export type ApiKeyProperties = {
    name: string,
    hash: string
}

export type ApiKeyRelatedNodes = {
    DataExporterRole: ModelRelatedNodesI<DataExporterRoleModel, DataExporterRoleInstance>
    ClientCreatorRole: ModelRelatedNodesI<ClientCreatorRoleModel, ClientCreatorRoleInstance>
}

export type ApiKeyInstance = NeogmaInstance<ApiKeyProperties, ApiKeyRelatedNodes>

export type ApiKeyModel = NeogmaModel<ApiKeyProperties, ApiKeyRelatedNodes>;
