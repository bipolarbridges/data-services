import { Session } from "neo4j-driver";
import models from '../models';

function userExistsX(id: string) {
    return async (session: Session): Promise<boolean> => {
        const exist = await models.client.ClientModel.findOne({
            session: session,
            where: {
                id: id,
            }
        });
        if (exist) return true
        else return false

    }
}
function userExists(id: string) {
    return async (session: Session): Promise<boolean> => {
        const exist = await session.run(
            "MATCH (u:User{uid: $uid}) RETURN u;", { uid: id });
        return exist.records.length > 0;
    };
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

export default {
    userExists,
    createUser,
    createMeasurement,
    userExistsX
}