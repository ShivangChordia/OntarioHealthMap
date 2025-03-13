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
 * ✅ Get Available Chronic Disease Categories (All Types)
 * URL: /api/chronic-types
 */
app.get("/api/chronic-types", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (table_name LIKE 'chronic_incidence_%' 
        OR table_name LIKE 'chronic_prevalence_%' 
        OR table_name LIKE 'chronic_mortality_%')
    `);

    const types = result.rows.map((row) =>
      row.table_name.replace(/chronic_(incidence|prevalence|mortality)_/, "")
    );

    // Remove duplicates (since one disease can have multiple types)
    const uniqueTypes = [...new Set(types)];

    res.json(uniqueTypes);
  } catch (err) {
    console.error("❌ Database Error (Fetching Chronic Disease Types):", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ✅ Get Available Smoking-Related Disease Categories
 * URL: /api/smoking-types
 */
/* app.get("/api/smoking-types", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'smoking_disease_%'
    `);

    const types = result.rows.map((row) =>
      row.table_name.replace("smoking_disease_", "")
    );
    res.json(types);
  } catch (err) {
    console.error("❌ Database Error (Fetching Smoking Disease Types):", err);
    res.status(500).json({ error: "Database error" });
  }
}); */

/**
 * ✅ Get Available Reproductive Health Disease Categories
 * URL: /api/reproductive-health-types
 */
/* app.get("/api/reproductive-health-types", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'reproductive_health_%'
    `);

    const types = result.rows.map((row) =>
      row.table_name.replace("reproductive_health_", "")
    );
    res.json(types);
  } catch (err) {
    console.error("❌ Database Error (Fetching Reproductive Health Types):", err);
    res.status(500).json({ error: "Database error" });
  }
}); */

/**
 * ✅ Get Cancer Incidence & Mortality Data
 * URL: /api/cancer-data?type=lung&year=2015&gender=male&age=50-64
 */
app.get("/api/cancer-data", async (req, res) => {
  try {
    const { type, year, gender, age } = req.query;

    if (!type) {
      return res.status(400).json({ error: "Cancer type is required" });
    }

    const incidenceTable = `cancer_incidence_${type.toLowerCase()}`;
    const mortalityTable = `cancer_mortality_${type.toLowerCase()}`;

    // ✅ Verify Tables Exist
    const tablesExist = await pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name IN ($1, $2)
      )`,
      [incidenceTable, mortalityTable]
    );

    if (!tablesExist.rows[0].exists) {
      return res.status(400).json({ error: "Invalid cancer type" });
    }

    // ✅ Construct Measure Query Based on Filters
    let measureFilter = "Age-standardized rate (both sexes)";
    if (age) {
      measureFilter = `Age-specific rate (${age.replace("-", " to ")})`;
    } else if (gender) {
      measureFilter = `Age-standardized rate (${gender.toLowerCase()}s)`;
    }

    // ✅ Query for Cancer Incidence
    let queryIncidence = `
      SELECT 'incidence' AS data_type, * 
      FROM ${incidenceTable} 
      WHERE year = COALESCE($1, (SELECT MAX(year) FROM ${incidenceTable}))
    `;
    let values = [year || null];

    queryIncidence += ` AND measure ILIKE $${values.length + 1}`;
    values.push(`%${measureFilter}%`);

    // ✅ Query for Cancer Mortality
    let queryMortality = `
      SELECT 'mortality' AS data_type, * 
      FROM ${mortalityTable} 
      WHERE year = COALESCE($1, (SELECT MAX(year) FROM ${mortalityTable}))
    `;

    queryMortality += ` AND measure ILIKE $${values.length + 1}`;

    // ✅ Execute Queries
    const [incidenceResult, mortalityResult] = await Promise.all([
      pool.query(queryIncidence, values),
      pool.query(queryMortality, values),
    ]);

    // ✅ Combine Results
    res.json({
      incidence: incidenceResult.rows,
      mortality: mortalityResult.rows,
    });
  } catch (err) {
    console.error("❌ Database Error (Fetching Cancer Data):", err);
    res.status(500).json({ error: "Database error" });
  }
});

/**
 * ✅ Get Chronic Disease Incidence, Prevalence & Mortality Data
 * URL: /api/chronic-data?type=asthma&year=2015&gender=male&age=50-64
 */
app.get("/api/chronic-data", async (req, res) => {
  try {
    const { type, year, gender, age } = req.query;

    if (!type) {
      return res.status(400).json({ error: "Chronic disease type is required" });
    }

    const incidenceTable = `chronic_incidence_${type.toLowerCase()}`;
    const prevalenceTable = `chronic_prevalence_${type.toLowerCase()}`;
    const mortalityTable = `chronic_mortality_${type.toLowerCase()}`;

    // ✅ Verify Tables Exist
    const tablesExist = await pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name IN ($1, $2, $3)
      )`,
      [incidenceTable, prevalenceTable, mortalityTable]
    );

    if (!tablesExist.rows[0].exists) {
      return res.status(400).json({ error: "Invalid chronic disease type" });
    }

    // ✅ Construct Measure Query Based on Filters
    let measureFilter = "Age-standardized rate (both sexes)";
    if (age) {
      measureFilter = `Age-specific rate (${age.replace("-", " to ")})`;
    } else if (gender) {
      measureFilter = `Age-standardized rate (${gender.toLowerCase()}s)`;
    }

    // ✅ Query for Chronic Incidence
    let queryIncidence = `
      SELECT 'incidence' AS data_type, * 
      FROM ${incidenceTable} 
      WHERE year = COALESCE($1, (SELECT MAX(year) FROM ${incidenceTable}))
    `;
    let values = [year || null];

    queryIncidence += ` AND measure ILIKE $${values.length + 1}`;
    values.push(`%${measureFilter}%`);

    // ✅ Query for Chronic Prevalence
    let queryPrevalence = `
      SELECT 'prevalence' AS data_type, * 
      FROM ${prevalenceTable} 
      WHERE year = COALESCE($1, (SELECT MAX(year) FROM ${prevalenceTable}))
    `;

    queryPrevalence += ` AND measure ILIKE $${values.length + 1}`;

    // ✅ Query for Chronic Mortality
    let queryMortality = `
      SELECT 'mortality' AS data_type, * 
      FROM ${mortalityTable} 
      WHERE year = COALESCE($1, (SELECT MAX(year) FROM ${mortalityTable}))
    `;

    queryMortality += ` AND measure ILIKE $${values.length + 1}`;

    // ✅ Execute Queries
    const [incidenceResult, prevalenceResult, mortalityResult] = await Promise.all([
      pool.query(queryIncidence, values),
      pool.query(queryPrevalence, values),
      pool.query(queryMortality, values),
    ]);

    // ✅ Combine Results
    res.json({
      incidence: incidenceResult.rows,
      prevalence: prevalenceResult.rows,
      mortality: mortalityResult.rows,
    });
  } catch (err) {
    console.error("❌ Database Error (Fetching Chronic Disease Data):", err);
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

    const CancerIncidenceTable = `cancer_incidence_${type.toLowerCase()}`;
    const CancerMortalityTable = `cancer_mortality_${type.toLowerCase()}`;

    // ✅ Verify Table Exists
    const incidenceTableExists = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`,
      [CancerIncidenceTable]
    );

    if (!incidenceTableExists.rows[0].exists) {
      return res.status(400).json({ error: "Invalid cancer type" });
    }

    // ✅ Fetch Cancer Incidence Data
    const incidenceQuery = `
      SELECT year, rate, cases, ci
      FROM ${CancerIncidenceTable}
      WHERE geography ILIKE $1
      AND measure ILIKE 'Age-standardized rate (both sexes)'
      ORDER BY year ASC
    `;
    const incidenceResult = await pool.query(incidenceQuery, [`%${region}%`]);

    // ✅ Fetch Cancer Mortality Data
    const mortalityQuery = `
      SELECT year, rate, cases, ci
      FROM ${CancerMortalityTable}
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
