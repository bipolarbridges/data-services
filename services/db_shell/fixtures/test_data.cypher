CREATE (:User{uid: "client0@email.com"});

CREATE (:Resource{path: "/client"});
CREATE (:Resource{path: "/measurement"});

CREATE (:Identity{type: "key", id: 1, check: "apikey1"});

MATCH (i:Identity{id: 1}) MATCH (r:Resource{path: "/client"}) CREATE (i)-[:Can{method: "POST"}]->(r);
MATCH (i:Identity{id: 1}) MATCH (r:Resource{path: "/measurement"}) CREATE (i)-[:Can{method: "POST"}]->(r);

