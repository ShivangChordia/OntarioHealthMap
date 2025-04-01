const API_BASE_URL = "http://localhost:5000";

// Fetch GeoJSON data
export const fetchGeoData = async () => {
  const response = await fetch(
    "https://services9.arcgis.com/a03W7iZ8T3s5vB7p/arcgis/rest/services/MOH_PHU_BOUNDARY/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson"
  );
  return response.json();
};

export const fetchPhuData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/phu-data`);
  return response.json();
};

// ✅ Fetch Available Years
export const fetchAvailableYears = async (disease, type) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/available-years?disease=${disease}&type=${type}`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching available years:", error);
    return [];
  }
};

// ✅ Fetch Available Age & Gender Filters
export const fetchAvailableAgeGender = async (disease, type) => {
  // 🚫 Skip filters for diseases that do not support age/gender measures
  const noFilterDiseases = ["respiratory", "reproductive"];

  if (noFilterDiseases.includes(disease.toLowerCase())) {
    return { ageFilters: [], genderFilters: [] };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/available-age-gender?disease=${disease}&type=${type}`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching age/gender filters:", error);
    return { ageFilters: [], genderFilters: [] };
  }
};

// ✅ Fetch Disease Data (Cancer & Chronic)
export const fetchDiseaseData = async ({
  disease,
  type,
  year,
  age,
  gender,
}) => {
  try {
    const queryParams = new URLSearchParams({ type, year });

    if (age) queryParams.append("age", age);
    if (!age && gender) queryParams.append("gender", gender);

    const response = await fetch(
      `${API_BASE_URL}/api/${disease.toLowerCase()}-data?${queryParams.toString()}`
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching disease data:", error);
    return [];
  }
};

export const fetchDiseaseTrends = async (diseaseType, specificType) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/disease-trends?diseaseType=${diseaseType}&specificType=${specificType}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch disease data");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ API Error:", error);
    throw error;
  }
};
