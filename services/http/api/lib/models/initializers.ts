import { ModelFactory, Neogma } from "neogma";
import {
    user,
    measurement,
    resource,
    identity,
    source,
    time,
    allModels
} from '../models';


export function initIdentityModel(db: Neogma, resourceModel: resource.ResourceModel): identity.IdentityModel {
    return ModelFactory<identity.IdentityProperties, identity.IdentityRelatedNodes>(
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
                Resource: {
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
    return ModelFactory<resource.ResourceProperties, resource.ResourceRelatedNodes>(
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
    return ModelFactory<time.HourProperties, time.HourRelatedNodes>(
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
    return ModelFactory<time.TimestampProperties, time.TimestampRelatedNodes>(
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
    return ModelFactory<time.DayProperties, time.DayRelatedNodes>(
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

export function initMonthModel(db: Neogma, dayModel: time.DayModel): time.MonthModel {
    return ModelFactory<time.MonthProperties, time.MonthRelatedNodes>(
        {
            label: 'Month',
            primaryKeyField: 'month',
            schema: {
                month: {
                    type: "number",
                    required: true
                }
            },
            relationships: {
                Day: {
                    model: dayModel,
                    direction: 'out',
                    name: 'Includes'
                }
            }
        },
        db
    )
}

export function initYearModel(db: Neogma): time.YearModel {
    return ModelFactory<time.YearProperties, time.YearRelatedNodes>(
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
    return ModelFactory<measurement.MeasurementProperties, measurement.MeasurementRelatedNodes>(
        {
            label: 'Measurement',
            schema: {
                value: {
                    type: 'number',
                    required: true
                },
            },
            relationships: {
                Hour: {
                    model: hourModel,
                    direction: 'out',
                    name: 'RecordedAt'
                },
                Day: {
                    model: dayModel,
                    direction: 'out',
                    name: 'RecordedOn',
                },
                Month: {
                    model: monthModel,
                    direction: 'out',
                    name: 'RecordedOn'
                },
                Year: {
                    model: yearModel,
                    direction: 'out',
                   name: 'RecordedOn',
                },
                Timestamp: {
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
                Measurement: {
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
    return ModelFactory<user.UserProperties, user.UserRelatedNodes>(
        {
            label: 'User',
            schema: {
                uid: {
                    type: 'string',
                    required: true,
                },
            },
            relationships: {
                Measurement: {
                    model: measurementModel,
                    direction: 'out',
                    name: 'Recorded',
                },
                Resource: {
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
    return ModelFactory<source.SourceProperties, source.SourceRelatedNodes>(
        {
            label: 'Source',
            schema: {
                name: {
                    type: 'string',
                    required: true
                },
            },
            relationships: {
                MeasurementType: {
                    model: MeasurementTypeModel,
                    direction: 'out',
                    name: 'Includes',
                }
            },
            primaryKeyField: 'name'
        },
        db);
}

export function initAllModels(db: Neogma): allModels {
    const resource = initResourceModel(db);
    const identity = initIdentityModel(db, resource);

    // const date = initDateModel(db);
    const hour = initHourModel(db);
    const day = initDayModel(db);
    const month = initMonthModel(db, day);
    const year = initYearModel(db);
    const timestamp = initTimestampModel(db);

    const measurementValue = initMeasurementModel(db, hour, day, month, year, timestamp);
    const measurementType = initMeasurementTypeModel(db, measurementValue);
    const source = initSourceModel(db, measurementType);
    const user = initUserModel(db, measurementValue, resource);

    measurementType.addRelationships(
        {
            Source: {
                model: source,
                direction: 'in',
                name: 'Includes',
            }
        });
    measurementValue.addRelationships(
        {
            User: {
                model: user,
                direction: 'in',
                name: 'Recorded',
            }
        });

    return {
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