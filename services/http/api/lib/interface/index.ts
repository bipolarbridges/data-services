import * as loggers from '../logging'
import { Session } from 'neo4j-driver'
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
                        where: [
                            {
                                params: {
                                    path: `/client/${id}`,
                                },
                                relationshipProperties: {
                                    method: 'GET'
                                },
                            },
                        ],
                        properties: [{
                            path: `/client/${id}`,
                            method: 'GET',
                            
                        }],
                    },
                    
                },
                {session}
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

export type MeasurementInput = {
    date: number,
    uid: string,
    type: string,
    value: number
}

/**
 * @depreciated 
 */
function createMeasurement(m: MeasurementInput) {
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

function createMeasurementX(m: MeasurementInput) {
    return async (session: Session, models: allModels): Promise<boolean> => {
        const date = dateTransformer(m.date);
        try {
            const user = await models.user.findOne({
                where: {
                    uid: m.uid,
                },
                session,
            });
            if (user?.__existsInDatabase) {
                await models.measurement.createOne(
                    {
                        type: m.type,
                        value: m.value,  
                        Date: {
                            

                            propertiesMergeConfig: {
                                nodes: true,
                                relationship: true,
                                
                            },
                            where: [
                                {
                                    params: {
                                        id: `${date.year}-${date.month}-${date.day}`,
                                    },
                                    relationshipProperties: {
                                        time: date.time
                                    },
                                },
                            ],
                            properties: [
                                {
                                    ...date,
                                    id: `${date.year}-${date.month}-${date.day}`,                                    
                                }
                            ],

                        },  
                        
                    },
                    { session, merge: true }
                );
                /* await models.date.createOne(
                    {
                        day: date.day, 
                        month: date.month, 
                        year: date.year,
                        id: `${date.year}-${date.month}-${date.day}`
                }, {session});

                createdMeasurement.relateTo({
                    alias: 'Date',
                    where: {day: date.day, month: date.month, year: date.month},
                    properties: {
                        time: date.time
                    },
                    session,
                }); */

                user.relateTo({
                    alias: 'Measurement',
                    where: {
                        type: m.type,
                        value: m.value,
                        
                    },
                    session,
                });
                return true;
            } else {
                return false;
            }          
            
        } catch (err) {
            loggers.error(err);
            return false;
        }
    }
}

function dateTransformer(input: number) {
    const date = new Date(input * 1000);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
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