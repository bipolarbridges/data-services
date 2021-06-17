import { ModelFactory, Neogma } from "neogma";
import {
    user,
    measurement,
    resource,
    identity,
    source,
    time
} from '../models';


export function initIdentityModel(db: Neogma, resourceModel: resource.ResourceModel): identity.IdentityModel {
    return ModelFactory<identity.IdentityProperties, identity.IdentityRelatedNode>(
        {
            label: 'Identity',
            schema: {
                type: {
                    type: 'string',
                    required: true
                },
                name: {
                    type: 'string',
                    required: true
                },
                check: {
                    type: 'string',
                    required: true
                },
            },
            relationships: {
                resource: {
                    model: resourceModel,
                    direction: 'out',
                    name: 'Can',
                    properties: {
                        method: {
                            property: 'method',
                            schema: {
                                type: 'string'
                            }
                        }
                    }
                    
                }
            },
            primaryKeyField: 'name'
        },
        db
    )
}

export function initResourceModel(db: Neogma): resource.ResourceModel {
    return ModelFactory<resource.ResourceProperties, resource.ResourceRelatedNode>(
        {
            label: 'Resource',
            schema: {
                path: {
                    type: 'string',
                    required: true
                }
            },
            primaryKeyField: 'path'
        },
        db
    )
}

export function initHourModel(db: Neogma): time.HourModel {
    return ModelFactory<time.HourProperties, time.HourRelatedNodeI>(
        {
            label: 'Hour',
            primaryKeyField: 'hour',
            schema: {
                hour: {
                    type: "number",
                    required: true
                }
            }
        },
        db
    )
}

export function initTimestampModel(db: Neogma): time.TimestampModel {
    return ModelFactory<time.TimestampProperties, time.TimestampRelatedNodeI>(
        {
            label: 'Timestamp',
            primaryKeyField: 'time',
            schema: {
                time: {
                    type: "number",
                    required: true
                }
            }
        },
        db
    )
}

export function initDayModel(db: Neogma): time.DayModel {
    return ModelFactory<time.DayProperties, time.DayRelatedNodeI>(
        {
            label: 'Day',
            primaryKeyField: 'day',
            schema: {
                day: {
                    type: "number",
                    required: true
                }
            }
        },
        db
    )
}

export function initMonthModel(db: Neogma): time.MonthModel {
    return ModelFactory<time.MonthProperties, time.MonthRelatedNodeI>(
        {
            label: 'Month',
            primaryKeyField: 'month',
            schema: {
                month: {
                    type: "number",
                    required: true
                }
            }
        },
        db
    )
}

export function initYearModel(db: Neogma): time.YearModel {
    return ModelFactory<time.YearProperties, time.YearRelatedNodeI>(
        {
            label: 'Year',
            primaryKeyField: 'year',
            schema: {
                year: {
                    type: "number",
                    required: true
                }
            }
        },
        db
    )
}

export function initMeasurementModel(db: Neogma, 
    hourModel: time.HourModel, dayModel: time.DayModel, monthModel: time.MonthModel, 
    yearModel: time.YearModel, timestampModel: time.TimestampModel): measurement.MeasurementModel {
    return ModelFactory<measurement.MeasurementProperties, measurement.MeasurementRelatedNodeI>(
        {
            label: 'Measurement',
            schema: {
                value : {
                    type: 'number',
                    required: true
                },
            },
            relationships: {
                hour: {
                    model: hourModel,
                    direction: 'out',
                    name: 'RecordedAt'
                },
                day: {
                    model: dayModel,
                    direction: 'out',
                    name: 'RecordedOn',
                },
                month: {
                    model: monthModel,
                    direction: 'out',
                    name: 'RecordedOn'
                },
                year: {
                    model: yearModel,
                    direction: 'out',
                    name: 'RecordedOn',
                },
                timestamp: {
                    model: timestampModel,
                    direction: 'out',
                    name: 'RecordedAt'
                }
            }
        },
        db
    )
}

export function initMeasurementTypeModel(db: Neogma, valueModel: measurement.MeasurementModel): measurement.MeasurementTypeModel {
    return ModelFactory<measurement.MeasurementTypeProperties, measurement.MeasurementTypeRelatedNodesI>(
        {
            label: 'MeasurementType',
            schema: {
                name: {
                    type: 'string',
                    required: true
                },
            },
            relationships: {
                measurement: {
                    model: valueModel,
                    direction: 'out',
                    name: 'Includes',
                }
            },
            primaryKeyField: 'name'
        },
        db
    );
}

export function initUserModel(db: Neogma, measurementModel: measurement.MeasurementModel, resourceModel: resource.ResourceModel): user.UserModel {
    return ModelFactory<user.UserProperties, user.UserRelatedNode>(
        {
            label: 'User',
            schema: {
                uid: {
                    type: 'string',
                    required: true,
                },
            },
            relationships: {
                measurementType: {
                    model: measurementModel,
                    direction: 'out',
                    name: 'Recorded',
                },
                resource: {
                    model: resourceModel,
                    direction: 'out',
                    name: 'Can',
                    properties: {
                        method: {
                            property: 'method',
                            schema: {
                                type: 'string'
                            }
                        }
                    }
                }
            },
            primaryKeyField: 'uid',
        },
        db
);
}

export function initSourceModel(db: Neogma, MeasurementTypeModel: measurement.MeasurementTypeModel): source.SourceModel {
    return ModelFactory<source.SourceProperties, source.SourceRelatedNodeI>(
        {
            label: 'Source',
            schema: {
                name: {
                    type: 'string',
                    required: true
                },
            },
            relationships: {
                measurementType: {
                    model: MeasurementTypeModel,
                    direction: 'out',
                    name: 'Includes',
                }
            },
            primaryKeyField: 'name'
        },
        db);
}

export type allModels = {
    // date: date.DateModel,
    identity: identity.IdentityModel,
    measurementType: measurement.MeasurementTypeModel,
    resource: resource.ResourceModel,
    user: user.UserModel,
    source: source.SourceModel,
    hour: time.HourModel,
    day: time.DayModel,
    month: time.MonthModel,
    year: time.YearModel,
    timestamp: time.TimestampModel,
    measurementValue: measurement.MeasurementModel
}

export function initAllModels(db: Neogma): allModels {
    const resource = initResourceModel(db);
    const identity = initIdentityModel(db, resource);
    
    // const date = initDateModel(db);
    const hour = initHourModel(db);
    const day = initDayModel(db);
    const month = initMonthModel(db);
    const year = initYearModel(db);
    const timestamp = initTimestampModel(db);

    const measurementValue = initMeasurementModel(db, hour, day, month, year, timestamp);
    const measurementType = initMeasurementTypeModel(db, measurementValue);
    const source = initSourceModel(db, measurementType);
    const user = initUserModel(db, measurementValue, resource);
    
    measurementType.addRelationships(
        {
            source: {
                model: source,
                direction: 'in',
                name: 'Includes',
            }
        });
    measurementValue.addRelationships(
        {
            user: {
                model: user,
                direction: 'in',
                name: 'Recorded',
            }
        });

    return {
        // date,
        source,
        resource,
        measurementType, 
        identity,
        user,
        measurementValue,
        hour,
        day,
        month,
        year,
        timestamp
    }
}