import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
const sql = neon('postgresql://Expense-Tracker_owner:D9wZaBAL3mns@ep-super-wood-a1vmx2i6.ap-southeast-1.aws.neon.tech/Expense-Tracker?sslmode=require');
export const db = drizzle(sql,{schema});