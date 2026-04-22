import { createPool } from 'mysql2/promise'

export const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'cedeno09',
  database: 'basena',
  port: 3306
})
