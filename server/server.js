import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import { Parser } from "json2csv";

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

app.get("/api/available-years", async (req, res) => {
  try {
    const { type, disease } = req.query;

    if (!disease) {
      return res.status(400).json({ error: "Disease is required" });
    }

    let tableName;

    // ✅ Determine table name logic based on disease
    if (disease.toLowerCase() === "smoking") {
      tableName = "smoking_incidence"; // fixed table name for smoking
    } else {
      if (!type) {
        return res
          .status(400)
          .json({ error: "Type is required for this disease" });
      }
      tableName = `${disease.toLowerCase()}_incidence_${type.toLowerCase()}`;
    }

    // ✅ Check if table exists
    const tableExists = await pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = $1
      )`,
      [tableName]
    );

    if (!tableExists.rows[0].exists) {
      return res.status(400).json({ error: "Invalid disease or type" });
    }

    // ✅ Fetch distinct years
    const query = `SELECT DISTINCT year FROM ${tableName} ORDER BY year DESC`;
    const result = await pool.query(query);

    const years = result.rows.map((row) => row.year);
    res.json(years);
  } catch (error) {
    console.error("❌ Error fetching available years:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/available-age-gender", async (req, res) => {
  try {
    const { type, disease } = req.query;

    if (!type || !disease) {
      return res.status(400).json({ error: "Disease and type are required" });
    }

    // ✅ Determine the table name based on disease type
    let tableName = `${disease.toLowerCase()}_incidence_${type.toLowerCase()}`;

    // ✅ Determine table name logic based on disease
    if (disease.toLowerCase() === "smoking") {
      tableName = "smoking_incidence"; // fixed table name for smoking
    } else {
      if (!type) {
        return res
          .status(400)
          .json({ error: "Type is required for this disease" });
      }
      tableName = `${disease.toLowerCase()}_incidence_${type.toLowerCase()}`;
    }

    // ✅ Check if table exists
    const tableExists = await pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = $1
      )`,
      [tableName]
    );

    if (!tableExists.rows[0].exists) {
      return res.status(400).json({ error: "Invalid disease type" });
    }

    // ✅ Fetch distinct measures (Age & Gender)
    const result = await pool.query(
      `SELECT DISTINCT measure FROM ${tableName} WHERE measure IS NOT NULL`
    );

    const measures = result.rows.map((row) => row.measure);

    // ✅ Separate age and gender filters
    const ageFilters = measures.filter((m) => m.includes("Age-specific"));
    const genderFilters = measures.filter(
      (m) =>
        m.includes("Age-standardized rate (males)") ||
        m.includes("Age-standardized rate (females)") ||
        m.includes("Age-standardized rate (both sexes)")
    );

    res.json({ ageFilters, genderFilters });
  } catch (error) {
    console.error("❌ Error fetching available age/gender filters:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/cancer-data", async (req, res) => {
  try {
    const { type, year, gender, age } = req.query;

    if (!type) {
      return res.status(400).json({ error: "Cancer type is required" });
    }

    const tableName = `cancer_incidence_${type.toLowerCase()}`;

    // ✅ Check if the table exists
    const tableExists = await pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = $1
      )`,
      [tableName]
    );

    if (!tableExists.rows[0].exists) {
      return res.status(400).json({ error: "Invalid cancer type" });
    }

    let measureFilter = "Age-standardized rate (both sexes)"; // Default

    if (age && !gender) {
      measureFilter = age;
    } else if (gender && !age) {
      measureFilter = gender;
    }

    let query = `SELECT * FROM ${tableName} WHERE year = COALESCE($1, (SELECT MAX(year) FROM ${tableName}))`;
    let values = [year || null];

    query += ` AND measure ILIKE $${values.length + 1}`;
    values.push(`%${measureFilter}%`);

    console.log("📝 Query:", query);
    console.log("📊 Values:", values);

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/api/smoking-data", async (req, res) => {
  try {
    const { type, year, gender, age } = req.query;

    if (!type || !["Former", "Active", "all"].includes(type)) {
      return res.status(400).json({
        error: "Valid type is required: 'Former', 'Active', or 'all'",
      });
    }

    const tableName = "smoking_incidence";

    // ✅ Check if the table exists
    const tableExists = await pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = $1
      )`,
      [tableName]
    );

    if (!tableExists.rows[0].exists) {
      return res.status(400).json({ error: "Smoking table does not exist" });
    }

    // ✅ Determine measure filter
    let measureFilter = "Age-standardized rate (both sexes)";
    if (age && !gender) {
      measureFilter = age;
    } else if (gender && !age) {
      measureFilter = gender;
    }

    // ✅ Build dynamic query
    let query = `SELECT * FROM ${tableName} WHERE 1=1`;
    const values = [];

    // Apply type filter if not "all"
    if (type !== "all") {
      const smokingType =
        type === "Former"
          ? "Self-reported adult former smoking rate"
          : "Self-reported adult daily smoking rate";
      values.push(smokingType);
      query += ` AND type = $${values.length}`;
    }

    if (year) {
      values.push(year);
      query += ` AND year = $${values.length}`;
    }

    if (measureFilter) {
      values.push(`%${measureFilter}%`);
      query += ` AND measure ILIKE $${values.length}`;
    }

    query += ` ORDER BY year ASC`;

    console.log("📝 Query:", query);
    console.log("📊 Values:", values);

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Smoking Data Error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// 🟦 RESPIRATORY DATA API
app.get("/api/respiratory-data", async (req, res) => {
  try {
    const { type, year, geography } = req.query;

    if (!type) {
      return res
        .status(400)
        .json({ error: "Respiratory disease type required" });
    }

    const table = `respiratory_incidence_${type.toLowerCase()}`;

    const tableExists = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`,
      [table]
    );

    if (!tableExists.rows[0].exists) {
      return res
        .status(400)
        .json({ error: "Invalid respiratory disease type" });
    }

    let query = `SELECT * FROM ${table} WHERE 1=1`;
    const values = [];

    if (year) {
      values.push(year);
      query += ` AND year = $${values.length}`;
    }

    if (geography) {
      values.push(geography);
      query += ` AND geography ILIKE $${values.length}`;
    }

    query += ` ORDER BY year ASC`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Respiratory Data Error:", err);
    res.status(500).json({ error: "Error fetching respiratory data" });
  }
});

// 🟦 REPRODUCTIVE DATA API
app.get("/api/reproductive-data", async (req, res) => {
  try {
    const { year, geography, type } = req.query;

    const table =
      type === "HIV"
        ? "reproductive_incidence_hiv"
        : "reproductive_incidence_aids";

    const tableExists = await pool.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`,
      [table]
    );

    if (!tableExists.rows[0].exists) {
      return res.status(400).json({ error: "Invalid reproductive data type" });
    }

    let query = `SELECT * FROM ${table} WHERE 1=1`;
    const values = [];

    if (year) {
      values.push(year);
      query += ` AND year = $${values.length}`;
    }

    if (geography) {
      values.push(geography);
      query += ` AND geography ILIKE $${values.length}`;
    }

    query += ` ORDER BY year ASC`;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Reproductive Data Error:", err);
    res.status(500).json({ error: "Error fetching reproductive health data" });
  }
});

app.get("/api/chronic-data", async (req, res) => {
  try {
    const { type, year, gender, age } = req.query;

    if (!type) {
      return res
        .status(400)
        .json({ error: "Chronic disease type is required" });
    }

    const tableName = `chronic_incidence_${type.toLowerCase()}`;

    // ✅ Check if the table exists
    const tableExists = await pool.query(
      `SELECT EXISTS (
        SELECT 1 FROM information_schema.tables WHERE table_name = $1
      )`,
      [tableName]
    );

    if (!tableExists.rows[0].exists) {
      return res.status(400).json({ error: "Invalid chronic disease type" });
    }

    let measureFilter = "Age-standardized rate (both sexes)"; // Default

    if (age && !gender) {
      measureFilter = age;
    } else if (gender && !age) {
      measureFilter = gender;
    }

    let query = `SELECT * FROM ${tableName} WHERE year = COALESCE($1, (SELECT MAX(year) FROM ${tableName}))`;
    let values = [year || null];

    query += ` AND measure ILIKE $${values.length + 1}`;
    values.push(`%${measureFilter}%`);

    console.log("📝 Query:", query);
    console.log("📊 Values:", values);

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Database Error:", err);
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
    const { diseaseType, specificType } = req.query;

    console.log("🔍 Received API Request for Disease Trends:");
    console.log("   📌 Disease Type:", diseaseType);
    console.log("   📌 Specific Type:", specificType);
    if (!diseaseType) {
      return res.status(400).json({ error: "Disease type is required" });
    }

    // Handle backward compatibility (old cancer-specific requests)
    const type = specificType || req.query.type;

    if (diseaseType === "Cancer" && !type) {
      return res.status(400).json({ error: "Cancer type is required" });
    }

    let primaryTable, secondaryTable, tertiaryTable;
    let primaryQuery, secondaryQuery, tertiaryQuery;

    switch (diseaseType) {
      case "Cancer":
        primaryTable = `cancer_incidence_${type.toLowerCase()}`;
        secondaryTable = `cancer_mortality_${type.toLowerCase()}`;

        // Check if the table exists
        const cancerTableExists = await pool.query(
          `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`,
          [primaryTable]
        );

        if (!cancerTableExists.rows[0].exists) {
          return res.status(400).json({ error: "Invalid cancer type" });
        }

        // Fetch Incidence Data
        primaryQuery = `
          SELECT type, measure, year, cases, ci, rate, geography, population
          FROM ${primaryTable}
        `;

        // Fetch Mortality Data
        secondaryQuery = `
          SELECT type, measure, year, cases, ci, rate, geography, population
          FROM ${secondaryTable}
        `;
        break;

      case "Chronic":
        primaryTable = `chronic_incidence_${type.toLowerCase()}`;
        secondaryTable = `chronic_mortality_${type.toLowerCase()}`;
        tertiaryTable = `chronic_prevalence_${type.toLowerCase()}`;

        // Check if table exists
        const chronicTableExists = await pool.query(
          `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`,
          [primaryTable]
        );

        if (!chronicTableExists.rows[0].exists) {
          return res
            .status(400)
            .json({ error: "Invalid chronic disease type" });
        }

        // Fetch Incidence Data
        primaryQuery = `
          SELECT type, measure, year, cases, ci, rate, geography, population
          FROM ${primaryTable}
        `;

        // Fetch Mortality Data
        secondaryQuery = `
          SELECT type, measure, year, count, ci, rate, geography, population
          FROM ${secondaryTable}
        `;

        // Fetch Prevalence Data
        tertiaryQuery = `
          SELECT type, measure, year, cases, ci, rate, geography, population
          FROM ${tertiaryTable}
        `;
        break;

      case "Reproductive":
        primaryTable = `reproductive_incidence_${type.toLowerCase()}`;

        // Check if table exists
        const reproductiveTableExists = await pool.query(
          `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`,
          [primaryTable]
        );

        if (!reproductiveTableExists.rows[0].exists) {
          return res
            .status(400)
            .json({ error: "Invalid reproductive disease type" });
        }

        // Fetch Incidence Data
        primaryQuery = `
          SELECT type, geography, rate, cases, population, year, ci
          FROM ${primaryTable}
        `;
        break;

      case "Respiratory":
        primaryTable = `respiratory_incidence_${type.toLowerCase()}`;

        // Check if table exists
        const respiratoryTableExists = await pool.query(
          `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = $1)`,
          [primaryTable]
        );

        if (!respiratoryTableExists.rows[0].exists) {
          return res
            .status(400)
            .json({ error: "Invalid reproductive disease type" });
        }

        // Fetch Incidence Data
        primaryQuery = `
          SELECT type, geography, rate, cases, population, year, ci
          FROM ${primaryTable}
        `;
        break;

      default:
        return res.status(400).json({ error: "Invalid disease type" });
    }

    // Execute queries
    const primaryResult = await pool.query(primaryQuery);
    let secondaryResult = { rows: [] };
    let tertiaryResult = { rows: [] };

    try {
      if (secondaryQuery) secondaryResult = await pool.query(secondaryQuery);
    } catch (error) {
      console.warn(
        `Secondary data not available for ${diseaseType} - ${type || ""}`
      );
    }

    try {
      if (tertiaryQuery) tertiaryResult = await pool.query(tertiaryQuery);
    } catch (error) {
      console.warn(
        `Tertiary data not available for ${diseaseType} - ${type || ""}`
      );
    }

    // Return formatted data
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

app.get("/api/disease-summary", async (req, res) => {
  try {
    const { diseaseType, specificType } = req.query;

    console.log("🔍 Fetching Disease Summary for:");
    console.log("   📌 Disease Type:", diseaseType);
    console.log("   📌 Specific Type:", specificType);

    if (!diseaseType || !specificType) {
      console.warn("⚠️ Missing diseaseType or specificType in request.");
      return res
        .status(400)
        .json({ error: "Missing disease type or specific type" });
    }

    let tableName;
    switch (diseaseType) {
      case "Cancer":
        tableName = `cancer_incidence_${specificType.toLowerCase()}`;
        break;
      case "Chronic":
        tableName = `chronic_incidence_${specificType.toLowerCase()}`;
        break;
      case "Reproductive":
        tableName = `reproductive_health_indicators`;
        break;
      default:
        return res.status(400).json({ error: "Invalid disease type" });
    }

    console.log("🛠 Using Table:", tableName);

    // Get DISTINCT measures
    const measuresQuery = `SELECT DISTINCT measure FROM ${tableName} WHERE measure IS NOT NULL ORDER BY measure`;
    const measuresResult = await pool.query(measuresQuery);
    const measures = measuresResult.rows.map((row) => row.measure);

    // Get DISTINCT geography
    const geographyQuery = `SELECT DISTINCT geography FROM ${tableName} WHERE geography IS NOT NULL ORDER BY geography`;
    const geographyResult = await pool.query(geographyQuery);
    const geographies = geographyResult.rows.map((row) => row.geography);

    // Get DISTINCT years
    const yearsQuery = `SELECT DISTINCT year FROM ${tableName} WHERE year IS NOT NULL ORDER BY year DESC`;
    const yearsResult = await pool.query(yearsQuery);
    const years = yearsResult.rows.map((row) => row.year);

    console.log("✅ Sending Summary Data:");
    console.log("   📊 Measures:", measures);
    console.log("   🗺️ Geography:", geographies);
    console.log("   📆 Years:", years);

    res.json({ measures, geographies, years });
  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * ✅ Export Express App
 */
export default app;
