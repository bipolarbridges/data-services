import { Session } from "neo4j-driver";
import models from '../models';
import * as loggers from '../logging'
import { UserInstance } from "lib/models/user";

function userExistsX(id: string) {
    return async (): Promise<boolean> => {
        const exist = await models.user.UserModel.findOne({
            where: {
                uid: id,
            }
        });
        loggers.info(exist);
        if (exist) return true
        else return false

    }
}

/**
 * 
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
    return async (session: Session): Promise<null> => {
        const createdUser: UserInstance = await models.user.UserModel.createOne({uid: id}, { session });
        await models.resource.ResourceModel.createOne({path: `/client/${id}`}, { session });
        await createdUser.relateTo(
            {
                alias: 'Resource',
                where: {
                    path: `/client/${id}`,
                },
                properties: {
                    method: 'GET'
                },
                session: session,
            });
            return null;
    }
}

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

function createMeasurement(m: MeasurementInput) {
    return async (session: Session): Promise<boolean> => {
        // decoding the timestamp per the format of this post:
        // https://stackoverflow.com/a/847196
        const date = new Date(m.date * 1000);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const time = 3600 * date.getHours() + 60 * date.getMinutes() + date.getSeconds();
        const user = await session.run(
            "MATCH (u:User{uid:$uid}) " +
            "MERGE (m:Measurement{type: $type, value: $value}) " +
            "-[:RecordedAt{time: $time}]-> (d:Date{day:$day, month:$month, year:$year}) " +
            "MERGE (m) -[:RecordedBy]-> (u) " +
            "MERGE (d) -[:Includes]-> (m) " +
            "MERGE (u) -[:Recorded]-> (m) " +
            "RETURN u;",
            { ...m, time, day, month, year });
        return user.records.length > 0;
    };
}

function createMeasurementX(m: MeasurementInput) {
    return async (session: Session): Promise<boolean> => {
        
        return false;
    }
}

export default {
    userExists,
    userExistsX,
    createUser,
    createUserX,
    createMeasurement,
    
}