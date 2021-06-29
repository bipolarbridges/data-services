import { NeogmaInstance, NeogmaModel } from 'neogma';

export type SourceProperties = {
  name: string
};

export type SourceRelatedNodes = { };

export type SourceInstance = NeogmaInstance<SourceProperties, SourceRelatedNodes>;

export type SourceModel = NeogmaModel<SourceProperties, SourceRelatedNodes>;
