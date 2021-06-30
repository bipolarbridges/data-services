import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from 'neogma';
import { UserInstance, UserModel } from './user';

export type ResourceProperties = {
  path: string
};

export type ResourceRelatedNodes = {
  User: ModelRelatedNodesI<UserModel, UserInstance>;
};

export type ResourceInstance = NeogmaInstance<ResourceProperties, ResourceRelatedNodes>;

export type ResourceModel = NeogmaModel<ResourceProperties, ResourceRelatedNodes>;
