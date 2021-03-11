CREATE (:User{uid: "client0@email.com"});

CREATE (:Resource{path: "/client"});
CREATE (:Resource{path: "/measurement"});

CREATE (:Identity{type: "key", id: 1, check: "d4f79b313f8106f5af108ad96ff516222dbfd5a0ab52f4308e4b1ad1d740de60"});

MATCH (i:Identity{id: 1}) MATCH (r:Resource{path: "/client"}) CREATE (i)-[:Can{method: "POST"}]->(r);
MATCH (i:Identity{id: 1}) MATCH (r:Resource{path: "/measurement"}) CREATE (i)-[:Can{method: "POST"}]->(r);

