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
4. We can execute query-sets from the `services/db_shell/fixtures` directory by calling a script inside the database shell container. Try `yarn api:load:examples`. You should see the queries run and some statistics show up when it is complete. Try using the shell and running the match query again. You should see nodes from the example dataset. It's worth noting that the example query set used here (`lib/fixtures/example.ts`) is a comprehensive example of our current data model. 

### Run The API 
This is a setup to run the API as in similar conditions to the Docker container outside of the container. This does not use dev-tools such as nodemon and tsnode.
1. Initialize the database and the mock auth server using `yarn run db:start` and `yarn run mock:start`.
2. Build the api using `yarn run api:build`.
3. Run the api using `yarn run api:start`.

### Run the API the Lazy Way
This is a setup that uses tsnode and nodemon to reduce the amount of time needed in building from Typescript, and automatically restarts the api upon file change. You can skip parts of step 1 depending on which Docker containers you  already have running.
1. Initialize the database and the mock auth server using `yarn run db:start` and `yarn run mock:start`.
2. Run the development server using `yarn run api:start:dev`. 
> If you'd like to be lazy and do all of the above with one command, use `yarn api:start:all`. 

### Testing the API
This assumes you have the api running in a terminal. If not, go through the steps of **"Run the API"** or **"Run the API the Lazy Way"**.
1. Since the API is active and logging in a terminal, open a new one and run `yarn run test:api`. This will build the test spec file, delete what is currently in the database, replace it with fixtures for testing and run the test.
5. When done, use `yarn docker:stop` or `docker compose down` to shut the db and mock auth server down.
6. Remember to escape the API service (^C).

### Adding Models
Models are added by using Neogma's typed ModelFactory function. To make a new model:
1. Create a model `.ts` file in the `http/api/lib/models` folder.
2. Define the properties, the related node type (with ModelRelatedNodesI type), then define the instance & neogma model by using `NeogmaInstance` and `NeogmaModel` type.
    > Note that in order for Neogma to recognize the model, the property declared in the ModelRelatedNodeI type has to match the model label string.
3. Add it to the `index.ts` file and add the model to the `AllModels` type.
4. Define a init**ModelName**Model function in the **ModelName**.ts file that returns the Neogma ModelFactory model. Include the db as it requires a valid session when creating the model, and add any dependencies (models that it has relations to) as a parameter.
    > If you have a circular dependency issue (2 models rely on each other to initilialize) use the `.addRelationship({...})` method.
5. Use the init**ModelName**Model function you have just created in the initAllModels method.