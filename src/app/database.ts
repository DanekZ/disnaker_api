import mysql from "mysql2/promise";

const host = process.env.MYSQL_HOST || "localhost";
const port = Number(process.env.MYSQL_PORT || 3306);
const user = process.env.MYSQL_USER || "root";
const password = process.env.MYSQL_PASSWORD || "";
const database = process.env.MYSQL_DATABASE || "pencaker";

export const pool = mysql.createPool({ host, port, user, password, database, waitForConnections: true, connectionLimit: 10, queueLimit: 0 });

export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}