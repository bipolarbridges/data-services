FROM openjdk:8
WORKDIR /
RUN wget https://github.com/neo4j/cypher-shell/releases/download/4.1.1/cypher-shell.zip
RUN unzip cypher-shell.zip
RUN rm cypher-shell.zip
RUN mkdir home/cypher
RUN mv cypher-shell home/cypher/cypher-shell
COPY bin/execute /usr/bin/execute
RUN chmod +x /usr/bin/execute
COPY bin/connect /usr/bin/connect
RUN chmod +x /usr/bin/connect
WORKDIR /home/cypher
COPY ./fixtures queries