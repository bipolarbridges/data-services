import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { UserModel, UserInstance } from '../../user';

export type ClientCreatorRoleProperties = {
    name: string,
}

export type ClientCreatorRoleRelatedNodes = {
    User: ModelRelatedNodesI<UserModel, UserInstance>,
}

export type ClientCreatorRoleInstance = NeogmaInstance<ClientCreatorRoleProperties, ClientCreatorRoleRelatedNodes>;

export type ClientCreatorRoleModel = NeogmaModel<ClientCreatorRoleProperties, ClientCreatorRoleRelatedNodes>;
