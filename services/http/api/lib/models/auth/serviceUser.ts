import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import {
		appUserReaderRole,
} from './roles';

export type ServiceUserProperties = {
    uid: string,
}

type AppUserReaderRoleModel = appUserReaderRole.AppUserReaderRoleModel;
type AppUserReaderRoleInstance = appUserReaderRole.AppUserReaderRoleInstance;

export type ServiceUserRelatedNodes = {
	AppUserReaderRole: ModelRelatedNodesI<AppUserReaderRoleModel, AppUserReaderRoleInstance>
}

export type ServiceUserInstance = NeogmaInstance<ServiceUserProperties, ServiceUserRelatedNodes>;

export type ServiceUserModel = NeogmaModel<ServiceUserProperties,ServiceUserRelatedNodes>;

