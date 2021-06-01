import { database } from "../db";
import { ModelFactory, ModelRelatedNodesI, NeogmaInstance, NeogmaModel } from "neogma";
import { MeasurementInstance, MeasurementModel } from "./measurement";

type DateProperties = {
    day: number,
    month: number,
    year: number
}

type DateRelatedNode = {
    Measurement: ModelRelatedNodesI<typeof MeasurementModel, MeasurementInstance>
}

export type DateInstance = NeogmaInstance<DateProperties, DateRelatedNode>

export const DateModel: NeogmaModel<DateProperties, DateRelatedNode> = ModelFactory<DateProperties, DateRelatedNode>(
    {
        label: 'Date',
        schema: {
            day: {
                type: 'number',
                required: true
            },
            month: {
                type: 'number',
                required: true
            },
            year: {
                type: 'number',
                required: true
            },
        },
        relationships: {
            Measurement: {
                model: MeasurementModel,
                direction: 'out',
                name: 'Includes',
            }
        }
    },
    database().neogma
)