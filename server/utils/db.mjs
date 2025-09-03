// Create PostgreSQL Connection Pool here !
import { Pool } from "pg";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL;

let connectionPool = null;
if (connectionString) {
  connectionPool = new Pool({ connectionString });
}

export default connectionPool;
