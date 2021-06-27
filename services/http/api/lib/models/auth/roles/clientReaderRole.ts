import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { UserModel, UserInstance } from '../../user';

export type ClientReaderRoleProperties = {
    name: string,
}

export type ClientReaderRoleRelatedNodes = {
    User: ModelRelatedNodesI<UserModel, UserInstance>,
}

export type ClientReaderRoleInstance = NeogmaInstance<ClientReaderRoleProperties, ClientReaderRoleRelatedNodes>;

export type ClientReaderRoleModel = NeogmaModel<ClientReaderRoleProperties, ClientReaderRoleRelatedNodes>;
