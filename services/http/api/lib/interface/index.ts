import * as loggers from '../logging'
import { Session } from 'neo4j-driver';
import { allModels } from 'lib/models/initializers';

function userExistsX(id: string) {
    return async (session: Session, models: allModels): Promise<boolean> => {
        try {
            const user = await models.user.findOne({
                where: {
                    uid: id,
                },
                session,
            });
            const exist = user? user?.__existsInDatabase : false;
            loggers.info(`User exists: ${exist}`);
            return exist;
        } catch (err) {
            loggers.error(err);
            return false;
        }
    }
}

/**
 * @depreciated 
 */
function userExists(id: string) {
    return async (session: Session): Promise<boolean> => {
        const exist = await session.run(
            "MATCH (u:User{uid: $uid}) RETURN u;", { uid: id });
        return exist.records.length > 0;
    };
}

function createUserX(id: string) {
    return async (session: Session, models: allModels): Promise<null> => {
        try {
            await models.user.createOne(
                {
                    uid: id,
                    Resource: {
                        propertiesMergeConfig: {
                            nodes: true,
                            relationship: true,
                            
                        },
                        properties: [
                            {
                                path: `/client/${id}`,
                                method: 'GET'
                            },
                        ],
                    },                
                },
                {merge: true, session}
            ); 
            
            return null;
        } catch (err) {
            loggers.error(err);
            return null;
        }
        
            
    }
}

/**
 * @depreciated 
 */
function createUser(id:string) {
    return async (session: Session): Promise<null> => {
        await session.run("CREATE (:User{uid: $uid});", { uid: id });
        await session.run("MATCH (u:User{uid: $uid}) " +
            "CREATE (r:Resource{path: $clientPath}) " +
            "CREATE (u)-[:Can{method: 'GET'}]->(r);",
            {
                uid: id,
                clientPath: `/client/${id}`
            });
        return null;
    };
}

export type typeOldInput = {
    date: number,
    uid: string,
    type: string,
    value: number
};
/**
 * @depreciated 
 */
function createMeasurement(m: typeOldInput) {
    return async (session: Session): Promise<boolean> => {
        // decoding the timestamp per the format of this post:
        // https://stackoverflow.com/a/847196
        const date = dateTransformer(m.date);
        const user = await session.run(
            "MATCH (u:User{uid:$uid}) "                                                     +
            "MERGE (m:Measurement{type: $type, value: $value}) "                            +
            "MERGE (d) -[:Includes]-> (m) "                                                 +
            "MERGE (u) -[:Recorded]-> (m) "                                                 +
            "RETURN u;", 
            {...m, time: date.time, day: date.day, month: date.month, year: date.year })
        return user.records.length > 0
    };
}

export type MeasurementInput = {
    uid: string,
    value: number,
    name: string,
    source: string,
    date: number,
}
/* 
async function measurementExist(uid: string, type: string, models: allModels, session: Session) {
    try {
        const instance = await models.MeasurementType.findOne({
            where: {
                uid,
                type,
            },
            session,
        });
        return {
            status: instance? instance?.__existsInDatabase : false,
            instance: (instance as measurement.MeasurementTypeInstance)
        };
    } catch (err) {
        loggers.error(err);
        return {
            status: false
        };
    }
}

async function valueExist(value: number, models: allModels, session: Session) {
    try {
        const instance = await models.measurementValue.findOne({
            where: {
                value,
            },
            session,
        });
        return {
            status: instance? instance?.__existsInDatabase : false,
            instance: instance as measurement.MeasurementInstance
        };
    } catch (err) {
        loggers.error(err);
        return {
            status: false
        };
    }
}

async function dateExist(id: string, models: allModels, session: Session) {
    try {
        const instance = await models.date.findOne({
            where: {
                id,
            },
            session,
        });
        return {
            status: instance? instance?.__existsInDatabase : false,
            instance: instance as date.DateInstance
        };
    } catch (err) {
        loggers.error(err);
        return {
            status: false
        };
    }
}

async function hourExist(time: number, models: allModels, session: Session) { 
    try {
        const instance = await models.hour.findOne({
            where: {
                time,
            },
            session,
        });
        return {
            status: instance? instance?.__existsInDatabase : false,
            instance: instance
        };
    } catch (err) {
        loggers.error(err);
        return {
            status: false
        };
    }
}
 */

function createMeasurementX(m: MeasurementInput) {
    return async (session: Session, models: allModels): Promise<boolean> => {
        
        try {
            const { year, month, day, time } = dateTransformer(m.date);
            const { uid, source, value, name } = m;

            const Date = {
                propertiesMergeConfig: {
                    nodes: true,
                    relationship: true,
                },
                properties: [
                    {
                        year: year,
                        month: month,
                        day: day,                                                
                        id: `${year}-${month}-${day}`,                                    
                    }
                ],
            };

            const Hour = {
                propertiesMergeConfig: {
                    nodes: true,
                    relationship: true,
                },
                properties: [
                    {
                        time: time,                                 
                    }
                ],
            };

            const User = {
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
                properties: [
                    {
                        value: value,
                        Date: Date,
                        Hour: Hour,
                        User: User,
                    }
                ]
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


function dateTransformer(input: number) {
    // decoding the timestamp per the format of this post:
    // https://stackoverflow.com/a/847196
    const date = new Date(input * 1000);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    // const time = new Time(date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds() * 1000000, date.getTimezoneOffset() *60)
    
    const time = 3600 * date.getHours() + 60 * date.getMinutes() + date.getSeconds();

    return {
        year, 
        month,
        day, 
        time
    }
}

export default {
    userExists,
    userExistsX,
    createUser,
    createUserX,
    createMeasurement,
    createMeasurementX,
}