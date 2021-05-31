import { database } from "../db";
import { ModelFactory, ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { UserModel, UserInstance } from "./user";
import { DateInstance, DateModel } from "./date";

type MeasurementProperties = {
    date: number,
    uid: string,
    type: string,
    value: number
}

type MeasurementRelatedNode = {
    User: ModelRelatedNodesI<typeof UserModel, UserInstance>,
    Date: ModelRelatedNodesI<typeof DateModel, DateInstance>
}

export type MeasurementInstance = NeogmaInstance<MeasurementProperties, MeasurementRelatedNode>;

export const MeasurementModel: NeogmaModel<MeasurementProperties, MeasurementRelatedNode> = ModelFactory<MeasurementProperties, MeasurementRelatedNode>(
    {
        label: 'Measurement',
        schema: {
            date: {
                type: 'number',
                required: true
            },
            uid: {
                type: 'string',
                required: true
            },
            type: {
                type: 'string',
                required: true
            },
            value: {
                type: 'number',
                required: true
            }
        },
        relationships: {
            User: {
                model: UserModel,
                direction: 'in',
                name: 'Recorded By',
            },
            Date: {
                model: DateModel,
                direction: 'out',
                name: 'Recorded At',
            }
        }
    },
    database().neogma
)