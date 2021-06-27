import { ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { SourceInstance, SourceModel } from "../../source";

export type DataExporterRoleProperties = {
    name: string,
}

export type DataExporterRoleRelatedNodes = {
    Source: ModelRelatedNodesI<SourceModel, SourceInstance>,
}

export type DataExporterRoleInstance = NeogmaInstance<DataExporterRoleProperties, DataExporterRoleRelatedNodes>;

export type DataExporterRoleModel = NeogmaModel<DataExporterRoleProperties, DataExporterRoleRelatedNodes>;
