import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import {
		clientReaderRole,
} from './roles';

export type UserIdentityProperties = {
    uid: string,
}

type ClientReaderRoleModel = clientReaderRole.ClientReaderRoleModel;
type ClientReaderRoleInstance = clientReaderRole.ClientReaderRoleInstance;

export type UserIdentityRelatedNodes = {
	ClientReaderRole: ModelRelatedNodesI<ClientReaderRoleModel, ClientReaderRoleInstance>
}

export type UserIdentityInstance = NeogmaInstance<UserIdentityProperties, UserIdentityRelatedNodes>;

export type UserIdentityModel = NeogmaModel<UserIdentityProperties,UserIdentityRelatedNodes>;

