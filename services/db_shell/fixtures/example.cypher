// Set up basic client references
CREATE (:User{uid: 1});
CREATE (:User{uid: 2});


// CREATE CONSTRAINT ON (source:Source) ASSERT source.type IS UNIQUE;
// CREATE CONSTRAINT ON (user:User) ASSERT user.uid IS UNIQUE;

// Syntax to log a user measurement at a certain time

MATCH (u:User{uid:1})
    MERGE (m:UserMeasurement{type: "measurement"}) -[:Includes]-> (v:MeasurementValue{value: 0.5, subtype: "sentiment"})
    MERGE (s:Source{type: "measurement"}) -[:Includes]-> (m)
    MERGE (u) -[:Recorded]-> (m)
    MERGE (v) -[:RecordedOn]-> (d:Date{day:1, month:1, year:2021})
    MERGE (v) -[:RecordedAt]-> (h:Hour{time: 6175});


// An additional record for the same user on a different day
MATCH (u:User{uid:1})
    MATCH (m:UserMeasurement{type: "measurement"}) -[:Includes]-> (v:MeasurementValue{value: 0.7, subtype: "sentiment"})
    MERGE (s:Source{type: "measurement"}) -[:Includes]-> (m)
    MERGE (u) -[:Recorded]-> (m)
    MERGE (v) -[:RecordedOn]-> (d:Date{day:2, month:1, year:2021})
    MERGE (v) -[:RecordedAt]-> (h:Hour{time: 6175});

// Different user, different type of measurement
MATCH (u:User{uid:2})
    MERGE (m:UserMeasurement{type: "measurement"}) -[:Includes]-> (v:MeasurementValue{value: 70, subtype: "heart-rate"})
    MERGE (s:Source{type: "measurement"}) -[:Includes]-> (m)
    MERGE (u) -[:Recorded]-> (m)
    MERGE (v) -[:RecordedOn]-> (d:Date{day:1, month:1, year:2021})
    MERGE (v) -[:RecordedAt]-> (h:Hour{time: 6175});