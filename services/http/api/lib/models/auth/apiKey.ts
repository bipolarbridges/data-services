import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import {
		dataExporterRole,
		appUserCreatorRole,
} from './roles';

type DataExporterRoleModel = dataExporterRole.DataExporterRoleModel;
type DataExporterRoleInstance = dataExporterRole.DataExporterRoleInstance;
type AppUserCreatorRoleModel = appUserCreatorRole.AppUserCreatorRoleModel;
type AppUserCreatorRoleInstance = appUserCreatorRole.AppUserCreatorRoleInstance;

export type ApiKeyProperties = {
    name: string,
    hash: string
}

export type ApiKeyRelatedNodes = {
    DataExporterRole: ModelRelatedNodesI<DataExporterRoleModel, DataExporterRoleInstance>
    AppUserCreatorRole: ModelRelatedNodesI<AppUserCreatorRoleModel, AppUserCreatorRoleInstance>
}

export type ApiKeyInstance = NeogmaInstance<ApiKeyProperties, ApiKeyRelatedNodes>

export type ApiKeyModel = NeogmaModel<ApiKeyProperties, ApiKeyRelatedNodes>;
