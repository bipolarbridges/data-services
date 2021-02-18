// Set up entity references

CREATE (:User{uid: 1});
CREATE (:User{uid: 2});

CREATE (:Coach{id: 1});

// Syntax to log a user measurement at a certain time
MATCH (u:User{uid:1})
    MERGE (m:Measurement{type: "sentiment", value: 0.5}) 
            -[:RecordedAt{time: 1000}]-> (d:Date{day:1, month:1, year:2021})
    MERGE (m) -[:RecordedBy]-> (u)
    MERGE (d) -[:Includes]-> (m)
    MERGE (u) -[:Recorded]-> (m);

// An additional record for the same user on a different day
MATCH (u:User{uid:1})
    MERGE (m:Measurement{type: "sentiment", value: 0.7}) 
            -[:RecordedAt{time: 2100}]-> (d:Date{day:2, month:1, year:2021})
    MERGE (m) -[:RecordedBy]-> (u)
    MERGE (d) -[:Includes]-> (m)
    MERGE (u) -[:Recorded]-> (m);

// Different user, different type of measurement
MATCH (u:User{uid:2})
    MERGE (m:Measurement{type: "heart-rate", value: 70}) 
            -[:RecordedAt{time: 0}]-> (d:Date{day:1, month:1, year:2021})
    MERGE (m) -[:RecordedBy]-> (u)
    MERGE (d) -[:Includes]-> (m)
    MERGE (u) -[:Recorded]-> (m);

// Include coach relation
MATCH (u:User{uid:2}), (c:Coach{id: 1})
    MERGE (m:Measurement{type: "heart-rate", value: 70}) 
            -[:RecordedAt{time: 0}]-> (d:Date{day:1, month:1, year:2021})
    MERGE (m) -[:RecordedBy]-> (u)
    MERGE (m) -[:RecordedFor]-> (c)
    MERGE (d) -[:Includes]-> (m)
    MERGE (u) -[:Recorded]-> (m);