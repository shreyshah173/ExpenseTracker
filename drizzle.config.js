/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://Expense-Tracker_owner:D9wZaBAL3mns@ep-super-wood-a1vmx2i6.ap-southeast-1.aws.neon.tech/Expense-Tracker?sslmode=require',
    }
  };