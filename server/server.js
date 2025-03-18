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

app.get("/api/chronic-data", async (req, res) => {
  try {
    const { type, year, gender, age } = req.query;

    // ❌ Return error if type is missing
    if (!type) {
      return res.status(400).json({ error: "Chronic type is required" });
    }

    const tableName = `chronic_incidence_${type.toLowerCase()}`;

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
    const { region, diseaseType, specificType } = req.query;

    if (!region || !diseaseType) {
      return res
        .status(400)
        .json({ error: "Region and disease type are required" });
    }

    // Handle backward compatibility (old cancer-specific requests)
    const type = specificType || req.query.type;

    if (diseaseType === "Cancer" && !type) {
      return res.status(400).json({ error: "Cancer type is required" });
    }

    let primaryTable,
      secondaryTable,
      tertiaryTable,
      primaryQuery,
      secondaryQuery,
      tertiaryQuery;

    // Determine tables and queries based on disease type
    switch (diseaseType) {
      case "Cancer":
        primaryTable = `cancer_incidence_${type.toLowerCase()}`;
        secondaryTable = `cancer_mortality_${type.toLowerCase()}`;

        // Verify primary table exists
        const incidenceTableExists = await pool.query(
          `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`,
          [primaryTable]
        );

        if (!incidenceTableExists.rows[0].exists) {
          return res.status(400).json({ error: "Invalid cancer type" });
        }

        // Fetch Incidence Data
        primaryQuery = `
          SELECT year, rate, cases, ci
          FROM ${primaryTable}
          WHERE geography ILIKE $1
          AND measure ILIKE 'Age-standardized rate (both sexes)'
          ORDER BY year ASC
        `;

        // Fetch Mortality Data
        secondaryQuery = `
          SELECT year, rate, cases, ci
          FROM ${secondaryTable}
          WHERE geography ILIKE $1
          AND measure ILIKE 'Age-standardized rate (both sexes)'
          ORDER BY year ASC
        `;
        break;

      case "Chronic":
        primaryTable = `chronic_incidence_${type.toLowerCase()}`;
        secondaryTable = `chronic_mortality_${type.toLowerCase()}`;
        tertiaryTable = `chronic_prevalence_${type.toLowerCase()}`;

        // Verify primary table exists
        const chronicTableExists = await pool.query(
          `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`,
          [primaryTable]
        );

        if (!chronicTableExists.rows[0].exists) {
          return res
            .status(400)
            .json({ error: "Invalid chronic disease type" });
        }

        // Fetch Prevalence Data
        primaryQuery = `
          SELECT year, rate, cases, ci
          FROM ${primaryTable}
          WHERE geography ILIKE $1
          AND measure ILIKE 'Age-standardized rate (both sexes)'
          ORDER BY year ASC
        `;

        // Fetch Complications Data
        secondaryQuery = `
          SELECT year, rate, count
          FROM ${secondaryTable}
          WHERE geography ILIKE $1
          AND measure ILIKE 'Age-standardized rate (both sexes)'
          ORDER BY year ASC
        `;

        // Fetch Complications Data
        tertiaryQuery = `
         SELECT year, rate, cases
         FROM ${tertiaryTable}
         WHERE geography ILIKE $1
         AND measure ILIKE 'Age-standardized rate (both sexes)'
         ORDER BY year ASC
       `;
        break;

      case "Smoking":
        primaryTable = "smoking_rates";
        secondaryTable = "smoking_health_impacts";

        // Fetch Smoking Rates
        primaryQuery = `
          SELECT year, rate, cases as cases, confidence_interval as ci, quitting_rate
          FROM ${primaryTable}
          WHERE geography ILIKE $1
          ORDER BY year ASC
        `;

        // Fetch Health Impacts
        secondaryQuery = `
          SELECT year, rate, cases
          FROM ${secondaryTable}
          WHERE geography ILIKE $1
          ORDER BY year ASC
        `;
        break;

      case "Reproductive":
        primaryTable = "reproductive_health_indicators";
        secondaryTable = "reproductive_complications";

        // Fetch Reproductive Health Indicators
        primaryQuery = `
          SELECT year, rate, cases, confidence_interval as ci
          FROM ${primaryTable}
          WHERE geography ILIKE $1
          ORDER BY year ASC
        `;

        // Fetch Complications
        secondaryQuery = `
          SELECT year, rate, cases
          FROM ${secondaryTable}
          WHERE geography ILIKE $1
          ORDER BY year ASC
        `;
        break;

      case "Overall Health":
        primaryTable = "health_index";
        secondaryTable = "risk_factors";

        // Fetch Health Index
        primaryQuery = `
          SELECT year, index_value as rate, population as cases, confidence_interval as ci
          FROM ${primaryTable}
          WHERE geography ILIKE $1
          ORDER BY year ASC
        `;

        // Fetch Risk Factors
        secondaryQuery = `
          SELECT year, index_value as rate, population as cases
          FROM ${secondaryTable}
          WHERE geography ILIKE $1
          ORDER BY year ASC
        `;
        break;

      default:
        return res.status(400).json({ error: "Invalid disease type" });
    }

    // Execute queries
    const primaryResult = await pool.query(primaryQuery, [`%${region}%`]);
    let secondaryResult = { rows: [] };
    let tertiaryResult = { rows: [] };

    try {
      secondaryResult = await pool.query(secondaryQuery, [`%${region}%`]);
      tertiaryResult = await pool.query(tertiaryQuery, [`%${region}%`]);
    } catch (error) {
      console.warn(
        `Secondary data not available for ${diseaseType} - ${type || ""}`
      );
      // Continue without secondary data
    }

    // Return data in the new format (primary/secondary instead of incidence/mortality)
    res.json({
      primary: primaryResult.rows,
      secondary: secondaryResult.rows,
      tertiary: tertiaryResult.rows,
    });
  } catch (error) {
    console.error(
      `❌ Database Error (Fetching ${
        req.query.diseaseType || "Disease"
      } Trends):`,
      error
    );
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
