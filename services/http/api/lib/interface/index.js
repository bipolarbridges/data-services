module.exports = {
    userExists: (id) => async (db) => {
        const exist = await db.run(
            "MATCH (u:User{uid: $uid}) RETURN u;", { uid: id })
        return exist.records.length > 0
    },
    createUser: (id) => async (db) => {
        await db.run("CREATE (:User{uid: $uid});", { uid: id })
    },
    createMeasurement: (m) => async (db) => {
        // decoding the timestamp per the format of this post:
        // https://stackoverflow.com/a/847196
        const date = new Date(m.date * 1000)
        const year = date.getFullYear()
        const month = date.getMonth()
        const day = date.getDate()
        const time = 3600*date.getHours() + 60*date.getMinutes() + date.getSeconds()
        const user = await db.run(
            "MATCH (u:User{uid:$uid}) "                                                     +
            "MERGE (m:Measurement{type: $type, value: $value}) "                            +
            "-[:RecordedAt{time: $time}]-> (d:Date{day:$day, month:$month, year:$year}) "   +
            "MERGE (m) -[:RecordedBy]-> (u) "                                               +
            "MERGE (d) -[:Includes]-> (m) "                                                 +
            "MERGE (u) -[:Recorded]-> (m) "                                                 +
            "RETURN u;", 
            {...m, time, day, month, year })
        return user.records.length > 0
    },
    validateAuthKey: (key) => async (db) => {
        if (!key) return false;
        const results = await db.run(
            "MATCH (a: Authorization{key: $key}) RETURN a;", { key })
        return results.records.length > 0
    },
    createAccount: (cl, co) => async (db) => {
        await db.run(
            "MERGE (u:User{uid:$uid})" +
            "MERGE (c:Coach{id:$cid})" +
            "MERGE (u) -[:CoachedBy]-> (c);", { uid: cl, cid: co });
    }
}