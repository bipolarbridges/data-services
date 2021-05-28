module.exports = {
    userExists: (id) => async (db) => {
        const exist = await db.run(
            "MATCH (u:User{uid: $uid}) RETURN u;", { uid: id })
        return exist.records.length > 0
    },
    createUser: (id) => async (db) => {
        await db.run("CREATE (:User{uid: $uid});", { uid: id });
        await db.run("MATCH (u:User{uid: $uid}) " +
        "CREATE (r:Resource{path: $clientPath}) " +
        "CREATE (u)-[:Can{method: 'GET'}]->(r);",
        {
            uid: id,
            clientPath: `/client/${id}`
        });
    },
    createMeasurement: (m) => async (db) => {
        // decoding the timestamp per the format of this post:
        // https://stackoverflow.com/a/847196
        const date = dateTransformer(m.date);
        const user = await db.run(
            "MATCH (u:User{uid:$uid}) "                                                     +
            "MERGE (m:Measurement{type: $type, value: $value}) "                            +
            "-[:RecordedAt{time: $time}]-> (d:Date{day:$day, month:$month, year:$year}) "   +
            "MERGE (m) -[:RecordedBy]-> (u) "                                               +
            "MERGE (d) -[:Includes]-> (m) "                                                 +
            "MERGE (u) -[:Recorded]-> (m) "                                                 +
            "RETURN u;", 
            {...m, time: date.time, day: date.day, month: date.month, year: date.year })
        return user.records.length > 0
    },

    createSurvey: (s) => async (db) => {
        const date = dateTransformer(s.date);
        const user = await db.run("", {...s, time: date.time, day: date.day, month: date.month, year: date.year })
    }
}

/* 
type MDate = {
    time: number,
    year: number,
    month: number,
    day: number,
} */

// decoding the timestamp per the format of this post:
// https://stackoverflow.com/a/847196
/**
 * 
 * @typedef tDate
 * @property {number} year
 * @property {number} month 
 * @property {number} day 
 * @property {number} time
 * 
 * @param {number} input 
 * @returns {tDate}
 */
function dateTransformer(input) {
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