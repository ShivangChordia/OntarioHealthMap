const API_BASE_URL = "https://ontario-health-map-backend.vercel.app";

// Fetch GeoJSON data
export const fetchGeoData = async () => {
  const response = await fetch(
    "https://services9.arcgis.com/a03W7iZ8T3s5vB7p/arcgis/rest/services/MOH_PHU_BOUNDARY/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson"
  );
  return response.json();
};

// Fetch PHU data
export const fetchPhuData = async () => {
  const response = await fetch(`${API_BASE_URL}/api/phu-data`);
  return response.json();
};

// Fetch cancer types
export const fetchCancerTypes = async () => {
  const response = await fetch(`${API_BASE_URL}/api/cancer-types`);
  return response.json();
};

// Fetch available years
export const fetchAvailableYears = async (cancerType) => {
  const response = await fetch(
    `${API_BASE_URL}/api/available-years?type=${cancerType}`
  );
  return response.json();
};

// Fetch cancer data with filters
export const fetchCancerData = async (cancerType, year, age, gender) => {
  const apiUrl = `${API_BASE_URL}/api/cancer-data?type=${cancerType}&year=${year}&age=${age}&gender=${gender}`;
  const response = await fetch(apiUrl);
  return response.json();
};

// Fetch chronic disease data with filters
export const fetchChronicData = async (chronicType, year, age, gender) => {
  const apiUrl = `${API_BASE_URL}/api/chronic-data?type=${chronicType}&year=${year}&age=${age}&gender=${gender}`;
  const response = await fetch(apiUrl);
  return response.json();
};

// Fetch general health data for other disease types
export const fetchHealthData = async (diseaseType, year, age, gender) => {
  const apiUrl = `${API_BASE_URL}/api/health-data?type=${diseaseType}&year=${year}&age=${age}&gender=${gender}`;
  const response = await fetch(apiUrl);
  return response.json();
};

// Fetch disease trend data for analysis
export const fetchDiseaseTrends = async (region, diseaseType, specificType) => {
  try {
    const apiUrl = `${API_BASE_URL}/api/disease-trends?region=${region}&diseaseType=${diseaseType}&specificType=${specificType}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`📌 Fetched ${diseaseType} Trend Data:`, data);
    return data;
  } catch (error) {
    console.error(`❌ Error Fetching ${diseaseType} Analysis Data:`, error);
    throw error;
  }
};
