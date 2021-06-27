import * as loggers from '../logging';
import { DatabaseProcedure } from 'lib/db';
import { Session } from 'neo4j-driver';
import { allModels } from 'lib/models';
import { DayProperties, HourProperties, TimestampProperties, YearProperties } from 'lib/models/time';
import { MeasurementProperties, MeasurementTypeProperties } from 'lib/models/measurement';
import { AppUserProperties } from 'lib/models/appUser';
import { SourceProperties } from 'lib/models/source';


function appUserExists(id: string): DatabaseProcedure<boolean> {
    return async (session: Session, models: allModels): Promise<boolean> => {
        try {
            const appUser = await models.appUser.findOne({
                where: {
                    uid: id,
                },
                session,
            });
            const exist = appUser ? appUser?.__existsInDatabase : false;
            loggers.info(`AppUser exists: ${exist}`);
            return exist;
        } catch (err) {
            loggers.error(err);
            return false;
        }
    }
}

function createAppUser(id: string): DatabaseProcedure<boolean>{
    return async (session: Session, models: allModels): Promise<null> => {
        try {
            await models.appUser.createOne(
                {
                    uid: id,
                },
                { merge: true, session });
            const readerName = `read:AppUser:${id}`;
            await models.auth.roles.appUserReaderRole.createOne({
                name: readerName,
                AppUser: {
                    propertiesMergeConfig: {
                        nodes: true,
                        relationship: true,
                    },
                    properties: [{
                        uid: id
                    }]
                }
            }, { merge: true, session });
            await models.auth.serviceUser.createOne({
                uid: id, // in this case, user id is the appUser id
                AppUserReaderRole: {
                    propertiesMergeConfig: {
                        nodes: true,
                        relationship: true,
                    },
                    properties: [{
                            name: readerName
                    }]
                }
            }, { merge: true, session });
            return null;
        } catch (err) {
            loggers.error(err);
            return null;
        }
    }
}

// named with format VerbModelArgs
export type CreateMeasurementArgs = {
    uid: string,
    value: number,
    name: string,
    source: string,
    date: number,
}

type mergeConfig = {
    nodes: boolean, 
    relationship: boolean,
};

type mergeProperties = {
    Hour: {
        propertiesMergeConfig: mergeConfig,
        properties: HourProperties[]
    },
    Day: dayMergeProperties,
    Month: monthMergeProperties,
    Year: {
        propertiesMergeConfig: mergeConfig,
        properties: YearProperties[]
    },
    Timestamp: {
        propertiesMergeConfig: mergeConfig,
        properties: TimestampProperties[]
    },
    AppUser?: appUserMergeProperties,
    MeasurementType?: {
        propertiesMergeConfig: mergeConfig,
        properties: combinedTypeSource[]
    }
}

type appUserMergeProperties = {
    propertiesMergeConfig: mergeConfig,
    properties: AppUserProperties[]
};

type measurementTypeMergeProperties = {
    propertiesMergeConfig: mergeConfig,
    properties: combinedTypeSource[],
}

type dayMergeProperties = {
    propertiesMergeConfig: mergeConfig,
    properties: DayProperties[]
};


type monthMergeProperties = {
    propertiesMergeConfig: mergeConfig,
    properties: {
        month: number,
        Day?: dayMergeProperties
    }[]
}

type sourceMergeProperties = {
    propertiesMergeConfig: mergeConfig,
    properties: SourceProperties[],
};

type combinedTypeSource = MeasurementTypeProperties & { Source: sourceMergeProperties };

export type mergedMeasurement = MeasurementProperties & mergeProperties;


export function makeMeasurementProperties(value: number, hour: number, day: number, month: number,
    year: number, time: number, AppUser?: appUserMergeProperties, MeasurementType?: measurementTypeMergeProperties): mergedMeasurement {
    return {
        value,
        Hour: {
            propertiesMergeConfig: {
                nodes: true,
                relationship: false,
            },
            properties: [
                { hour }
            ],
        },
        Day: {
            propertiesMergeConfig: {
                nodes: true,
                relationship: false,
            },
            properties: [
                { day }
            ],
        },
        Month: {
            propertiesMergeConfig: {
                nodes: true,
                relationship: false,
            },
            properties: [
                {
                    month,
                    Day: {
                        propertiesMergeConfig: {
                            nodes: true,
                            relationship: true,
                        },
                        properties: [
                            { day }
                        ],
                    }
                }
            ],
        },
        Year: {
            propertiesMergeConfig: {
                nodes: true,
                relationship: true,
            },
            properties: [
                { year }
            ],
        },
        Timestamp: {
            propertiesMergeConfig: {
                nodes: true,
                relationship: false,
            },
            properties: [
                { time }
            ],
        },
        AppUser,
        MeasurementType,

    }
}

function createMeasurement(m: CreateMeasurementArgs) {
    return async (session: Session, models: allModels): Promise<boolean> => {

        try {
            const { year, month, day, hour, time } = transformDate(m.date);
            const { uid, source, value, name } = m;

            const AppUser = {
                propertiesMergeConfig: {
                    nodes: true,
                    relationship: true,

                },
                properties: [{
                    uid: uid,
                }]
            };

            const Measurement = {
                propertiesMergeConfig: {
                    nodes: false,
                    relationship: false,
                },
                properties: [makeMeasurementProperties(value, hour, day, month, year, time, AppUser)]
            };

            const Source = {
                propertiesMergeConfig: {
                    nodes: true,
                    relationship: true,

                },
                properties: [
                    {
                        name: source
                    }
                ]
            };

            await models.measurementType.createOne(
                {
                    name,
                    Measurement: Measurement,
                    Source: Source,
                },
                { session, merge: true }
            );
            return true;

        } catch (err) {
            loggers.error(err);
            loggers.error(err?.data?.errors)
            return false;
        }
    }
}

// Takes in a second number input, converts it to milliseconds 
// and returns
// - the year 
// - the month (0-11)
// - the day of the month (1-31)
// - the time in milliseconds
function transformDate(input: number) {
    const date = new Date(input * 1000);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const time = date.getTime();
    const hour = date.getHours(); // 3600 * date.getHours() + 60 * date.getMinutes() + date.getSeconds();

    return {
        year,
        month,
        day,
        hour,
        time
    }
}

export default {
    appUserExists,
    createAppUser,
    createMeasurement,
}
