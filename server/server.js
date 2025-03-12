import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // ✅ Fix insecure connection issue
    require: true, // ✅ Ensure SSL mode is enabled
  },
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));

// ✅ API Route: Get Available Years from the Cancer Table
app.get("/api/available-years", async (req, res) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ error: "Cancer type is required" });
    }

    const tableName = `cancer_incidence_${type.toLowerCase()}`;

    const query = `SELECT DISTINCT year FROM ${tableName} ORDER BY year DESC`;
    const result = await pool.query(query);

    const years = result.rows.map((row) => row.year);
    res.json(years);
  } catch (error) {
    console.error("❌ Error fetching available years:", error);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ✅ Get Available Cancer Categories
 * URL: /api/cancer-types
 */
app.get("/api/cancer-types", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'cancer_incidence_%'
    `);

    const types = result.rows.map((row) =>
      row.table_name.replace("cancer_incidence_", "")
    );
    res.json(types);
  } catch (err) {
    console.error("❌ Database Error (Fetching Cancer Types):", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ✅ Get Cancer Data Dynamically (Filters: Year, Age, Gender)
 * URL: /api/cancer-data?type=lung&year=2015&gender=male&age=50-64
 */
/**
 * ✅ Get Cancer Data Dynamically (Filters: Year, Age, Gender)
 * URL: /api/cancer-data?type=lung&year=2015&gender=male&age=50-64
 */
app.get("/api/cancer-data", async (req, res) => {
  try {
    const { type, year, gender, age } = req.query;

    // ❌ Return error if type is missing
    if (!type) {
      return res.status(400).json({ error: "Cancer type is required" });
    }

    const tableName = `cancer_incidence_${type.toLowerCase()}`;

    // ✅ Check if the table exists (Security Measure)
    const tableExists = await pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = $1
      )`,
      [tableName]
    );

    if (!tableExists.rows[0].exists) {
      return res.status(400).json({ error: "Invalid cancer type" });
    }

    // ✅ Construct Measure Query Based on Filters
    let measureFilter = "Age-standardized rate (both sexes)"; // Default if no filters
    if (age) {
      measureFilter = `Age-specific rate (${age.replace("-", " to ")})`; // Convert "50-64" -> "50 to 64"
    } else if (gender) {
      measureFilter = `Age-standardized rate (${gender.toLowerCase()}s)`; // Convert "male" -> "males"
    }

    // ✅ Dynamic Query & Parameter Handling
    let query = `SELECT * FROM ${tableName} WHERE year = COALESCE($1, (SELECT MAX(year) FROM ${tableName}))`;
    let values = [year || null]; // Default: Most recent year

    // ✅ Add Measure Filter
    query += ` AND measure ILIKE $${values.length + 1}`;
    values.push(`%${measureFilter}%`);

    query += ` ORDER BY geography, year DESC`;

    console.log("📝 Query:", query);
    console.log("📊 Values:", values);

    // ✅ Execute Query
    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database Error (Fetching Cancer Data):", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ✅ Get Public Health Unit (PHU) Census Data
 * URL: /api/phu-data
 */
app.get("/api/phu-data", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM public_health_units");
    res.json(result.rows);
  } catch (error) {
    console.error("❌ Database Error (PHU Data):", error);
    res.status(500).json({ error: "Failed to fetch public health unit data" });
  }
});
app.get("/api/disease-trends", async (req, res) => {
  try {
    const { region, type } = req.query;

    if (!region || !type) {
      return res
        .status(400)
        .json({ error: "Region and cancer type are required" });
    }

    const incidenceTable = `cancer_incidence_${type.toLowerCase()}`;
    const mortalityTable = `cancer_mortality_${type.toLowerCase()}`;

    // ✅ Verify Table Exists
    const incidenceTableExists = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`,
      [incidenceTable]
    );

    if (!incidenceTableExists.rows[0].exists) {
      return res.status(400).json({ error: "Invalid cancer type" });
    }

    // ✅ Fetch Incidence Data
    const incidenceQuery = `
      SELECT year, rate, cases, ci
      FROM ${incidenceTable}
      WHERE geography ILIKE $1
      AND measure ILIKE 'Age-standardized rate (both sexes)'
      ORDER BY year ASC
    `;
    const incidenceResult = await pool.query(incidenceQuery, [`%${region}%`]);

    // ✅ Fetch Mortality Data
    const mortalityQuery = `
      SELECT year, rate, cases, ci
      FROM ${mortalityTable}
      WHERE geography ILIKE $1
      AND measure ILIKE 'Age-standardized rate (both sexes)'
      ORDER BY year ASC
    `;
    const mortalityResult = await pool.query(mortalityQuery, [`%${region}%`]);

    res.json({
      incidence: incidenceResult.rows,
      mortality: mortalityResult.rows,
    });
  } catch (error) {
    console.error("❌ Database Error (Fetching Disease Trends):", error);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ✅ Root Route (Fix "Cannot GET /" Error)
 */
app.get("/", (req, res) => {
  res.send("✅ Ontario Health Maps Backend is Running!");
});

/**
 * ✅ Export Express App
 */
export default app;
