import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { AppUserModel, AppUserInstance } from '../../appUser';

export type AppUserReaderRoleProperties = {
    name: string,
}

export type AppUserReaderRoleRelatedNodes = {
    AppUser: ModelRelatedNodesI<AppUserModel, AppUserInstance>,
}

export type AppUserReaderRoleInstance = NeogmaInstance<AppUserReaderRoleProperties, AppUserReaderRoleRelatedNodes>;

export type AppUserReaderRoleModel = NeogmaModel<AppUserReaderRoleProperties, AppUserReaderRoleRelatedNodes>;
