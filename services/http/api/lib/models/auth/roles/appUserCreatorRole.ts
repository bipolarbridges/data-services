import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { AppUserModel, AppUserInstance } from '../../appUser';

export type AppUserCreatorRoleProperties = {
    name: string,
}

export type AppUserCreatorRoleRelatedNodes = {
    AppUser: ModelRelatedNodesI<AppUserModel, AppUserInstance>,
}

export type AppUserCreatorRoleInstance = NeogmaInstance<AppUserCreatorRoleProperties, AppUserCreatorRoleRelatedNodes>;

export type AppUserCreatorRoleModel = NeogmaModel<AppUserCreatorRoleProperties, AppUserCreatorRoleRelatedNodes>;
