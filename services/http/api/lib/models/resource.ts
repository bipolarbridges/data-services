import { NeogmaInstance, NeogmaModel } from 'neogma';

export type ResourceProperties = {
  path: string
};

export type ResourceRelatedNodes = {
};

export type ResourceInstance = NeogmaInstance<ResourceProperties, ResourceRelatedNodes>;

export type ResourceModel = NeogmaModel<ResourceProperties, ResourceRelatedNodes>;
