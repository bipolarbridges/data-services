import { Driver, Result, Session } from 'neo4j-driver';
import { TransactionConfig } from 'neo4j-driver/types/session';
import {Parameters} from 'neo4j-driver/types/query-runner'
import { InternalError } from '../errors';
import { DatabaseResponse } from 'lib/auth/auth_methods';
import { Neogma } from 'neogma';
class DatabaseError extends InternalError {
    constructor(error: string) {
        super(error);
    }
}

export class Database {
    driver: Driver | null;
    initialized: boolean;
    public neogma: Neogma;

    constructor () {
        this.driver = null;
        this.neogma = null;
        this.initialized = false;
    }

    init (): void {
        this.neogma = new Neogma(
            {
                // use your connection details
                url: `bolt://${process.env['DB_ADDR']}:7687`,
                username: 'neo4j',
                password: 'password',
            },
            {
                logger: console.log,
            },
        );        
        this.driver = this.neogma.driver;
        this.initialized = true;
    }

    async exec (proc: (session: Session)=> DatabaseResponse): Promise<boolean | null> {
        const session: Session = this.driver.session()
        
        try {
            const ret = await proc(session);
            return ret
        } catch (e) {
            if (e instanceof InternalError) {
                throw e;
            } else {
                throw new DatabaseError(e);
            }
        } finally {
            await session.close();
        }
    }

    run (query: string, parameters?: Parameters, config?: TransactionConfig): Result {
        const session: Session = this.driver.session();
        return session.run(query, parameters, config);
    }

    async stop (): Promise<void> {
        await this.driver.close();
    }
}

export function database(): Database {
    const db = new Database();
    db.init();
    return db
}