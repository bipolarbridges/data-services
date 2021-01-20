## Development and Testing Info
A lot of the setup uses docker to encapsulate some of the dependencies, networking etc. Currently, there are three layers:

1. **Database**: Runs a `neo4j` instance with exposed port on localhost.
2. **Database shell**: Allows for interactive querying of the database and automated loading of fixture data using the cypher-shell software.
3. **API**: This is the application which provides HTTP endpoints to interact with the system.

### Quick-Start
1. Ensure `docker` is set up. To test the API, a `node/yarn` installation is also required.
2. Start up the database service using `yarn run db:start`. Since it might be a moment or two before it starts up, you can monitor the status using `yarn run db:status`. Once you see 'Started.' in the logs, you can escape (^C) from the status process.
3. Access the database shell using `yarn run db:shell`. If no prompt displays after a while, simply press return/enter and it should show up. Try running a query such as
    ```cypher
    MATCH (n) RETURN n;
    ```
    no nodes should be returned since the database is empty. Close the shell using the `:exit` command.
4. We can execute query-sets from the `services/db_shell/fixtures` directory by calling a script inside the database shell container. Try `yarn run db:load:example`. You should see the queries run and some statistics show up when it is complete. Try using the shell and running the match query again. You should see nodes from the example dataset. It's worth noting that the example query set used here (`services/db_shell/fixtures/example`) is a comprehensive example of our current data model. Also, since the fixtures are statically loaded when our containers are built, updating with changes to the query-sets requires `yarn run build:shell`.

### Testing the API
1. Initialize the database and run the development server using `yarn run api:start:test`. This will delete what is currently in the database and replace it with fixtures for testing.
2. In another terminal, run `yarn run test:api`.
3. When done, use `yarn stop` or `docker-compose down` to shut everything down.

