import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IoFilter, IoClose } from "react-icons/io5"; // Import icons
import { useNavigate } from "react-router-dom"; // ✅ Import navigation hook

const HealthMap = () => {
  const [geoData, setGeoData] = useState(null);
  const [phuData, setPhuData] = useState([]); // ✅ PHU Data (Population, Income, etc.)
  const [cancerTypes, setCancerTypes] = useState([]); // ✅ List of Cancer Types
  const [cancerData, setCancerData] = useState([]); // ✅ Cancer Data (Rates, Cases, etc.)
  const [mapReady, setMapReady] = useState(false); // ✅ Track when map should update
  const [selectedRegion, setSelectedRegion] = useState(null); // ✅ Stores clicked region details

  const [diseaseTypes, setDiseaseTypes] = useState([
    "Cancer",
    "Chronic",
    "Smoking",
    "Reproductive Health",
  ]); // Main Categories
  const [selectedDisease, setSelectedDisease] = useState("Cancer");
  const [selectedCancerType, setSelectedCancerType] = useState("all"); // For cancer subtypes
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedAge, setSelectedAge] = useState("");
  const [selectedYear, setSelectedYear] = useState("2020"); // ✅ Default Year
  const [selectedGender, setSelectedGender] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [minRate, setMinRate] = useState(0);
  const [maxRate, setMaxRate] = useState(100); // Default
  const [geoJsonKey, setGeoJsonKey] = useState(0); // ✅ Key to re-render GeoJSON

  const navigate = useNavigate(); // ✅ Initialize navigation hook

  const handleDetailedAnalysis = () => {
    navigate("/analysis", { state: { selectedRegion, selectedCancerType } });
  };

  // ✅ Fetch available cancer types when "Cancer" is selected
  useEffect(() => {
    if (selectedDisease === "Cancer") {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cancer-types`)
        .then((response) => response.json())
        .then((data) => {
          console.log("✅ Fetched Cancer Types:", data);
          setCancerTypes(data); // ✅ Set Default Cancer Type
        })
        .catch((error) =>
          console.error("❌ Error fetching cancer types:", error)
        );
    }
  }, [selectedDisease]);

  // ✅ Fetch available years when the component loads or when a cancer type is selected
  useEffect(() => {
    if (!selectedCancerType) return;

    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/available-years?type=${selectedCancerType}`
    )
      .then((response) => response.json())
      .then((years) => {
        console.log("✅ Available Years:", years);
        setAvailableYears(years);
        setSelectedYear(years[0]); // ✅ Default to most recent year
      })
      .catch((error) => console.error("❌ Error fetching years:", error));
  }, [selectedCancerType]);

  // ✅ Load GeoJSON Data
  useEffect(() => {
    fetch(
      "https://services9.arcgis.com/a03W7iZ8T3s5vB7p/arcgis/rest/services/MOH_PHU_BOUNDARY/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson"
    )
      .then((response) => response.json())
      .then((geojson) => {
        console.log("🗺️ GeoJSON Data Loaded:", geojson);
        setGeoData(geojson);
      })
      .catch((error) => console.error("❌ Error loading GeoJSON data:", error));
  }, []);

  // ✅ Fetch PHU Data
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/phu-data`)
      .then((response) => response.json())
      .then((data) => {
        console.log("✅ Fetched PHU Data");
        setPhuData(data);
      })
      .catch((error) => console.error("❌ Error fetching PHU data:", error));
  }, []);

  // ✅ Function to Generate High-Contrast Colors Based on Rate
  const getColor = (rate) => {
    if (!rate) return "#ffffcc"; // Light Yellow (Lowest for missing data)

    const normalizedRate = (rate - minRate) / (maxRate - minRate); // Normalize between 0-1
    const colorScale = [
      "#ffffcc", // Very Low → Pale Yellow
      "#ffeda0", // Low → Soft Yellow
      "#feb24c", // Moderate → Orange
      "#fd8d3c", // High → Deep Orange
      "#f03b20", // Very High → Red
      "#bd0026", // Severe → Dark Red
      "#800026", // Extreme → Purple-Black
    ];

    const index = Math.floor(normalizedRate * (colorScale.length - 1));
    return colorScale[index];
  };

  // ✅ Fetch available cancer types when "Cancer" is selected
  useEffect(() => {
    if (selectedDisease === "Cancer") {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cancer-types`)
        .then((response) => response.json())
        .then((data) => {
          console.log("✅ Fetched Cancer Types:", data);
          setCancerTypes(data); // ✅ Set Default Cancer Type
        })
        .catch((error) =>
          console.error("❌ Error fetching cancer types:", error)
        );
    }
  }, [selectedDisease]);

  // ✅ Fetch available years when the component loads or when a cancer type is selected
  useEffect(() => {
    if (!selectedCancerType) return;

    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/available-years?type=${selectedCancerType}`
    )
      .then((response) => response.json())
      .then((years) => {
        console.log("✅ Available Years:", years);
        setAvailableYears(years);
        setSelectedYear(years[0]); // ✅ Default to most recent year
      })
      .catch((error) => console.error("❌ Error fetching years:", error));
  }, [selectedCancerType]);

  // ✅ Fetch Cancer Data with Filters
  useEffect(() => {
    if (!selectedCancerType) return;

    let apiUrl = `${
      import.meta.env.VITE_BACKEND_URL
    }/api/cancer-data?type=${selectedCancerType}&year=${selectedYear}&age=${selectedAge}&gender=${selectedGender}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          console.log("✅ Fetched Cancer Data:", data);
          setCancerData(data);
          const rates = data.map((entry) => entry.rate).filter(Boolean);
          setMinRate(Math.min(...rates));
          setMaxRate(Math.max(...rates));
          setMapReady(true);
          // ✅ Trigger re-bind of GeoJSON after fetching cancer data
          setGeoJsonKey((prevKey) => prevKey + 1);
        }
      })

      .catch((error) => console.error("❌ Error fetching cancer data:", error));
  }, [selectedCancerType, selectedYear, selectedAge, selectedGender]);

  // ✅ Reset Filters
  const resetFilters = () => {
    setSelectedAge("");
    setSelectedGender("");
    setSelectedYear("2020"); // ✅ Reset to Default Year
  };

  const onEachFeature = (feature, layer) => {
    if (!feature.properties || !feature.properties.NAME_ENG) {
      console.warn("⚠️ Missing NAME_ENG in feature:", feature);
      return;
    }

    const phuNameGeoJSON = feature.properties.NAME_ENG.trim().toLowerCase();

    // ✅ Find PHU Data
    let matchingPHU = phuData.find(
      (data) => data.phu_name.trim().toLowerCase() === phuNameGeoJSON
    );

    // ✅ Find Cancer Data
    let matchingCancerData = cancerData.filter(
      (entry) => entry.geography.trim().toLowerCase() === phuNameGeoJSON
    );

    // ✅ Log matched cancer data
    console.log(
      "📌 Matching Cancer Data for",
      phuNameGeoJSON,
      matchingCancerData
    );

    // ✅ Add Click Event to Show Data in Right Panel
    layer.on("click", function () {
      setSelectedRegion({
        name: feature.properties.NAME_ENG,
        phu: matchingPHU || {},
        cancerData: matchingCancerData || [],
      });
    });

    // ✅ Popup with basic info
    let popupContent = `<b>${phuNameGeoJSON.toUpperCase()}</b><br/>`;

    if (matchingPHU) {
      popupContent += `
        <b>Region:</b> ${matchingPHU.region || "N/A"}<br/>
        <b>Population:</b> ${matchingPHU.population || "N/A"}<br/>
        <b>Median Income:</b> $${matchingPHU.median_total_income || "N/A"}<br/>
      `;
    } else {
      popupContent += `<i>No PHU data available.</i><br/>`;
    }

    if (matchingCancerData.length > 0) {
      popupContent += `
        <hr/>
        <b>Cancer Type:</b> ${selectedCancerType.toUpperCase()}<br/>
        <b>Incidence Rate:</b> ${
          matchingCancerData[0].rate || "N/A"
        } per 100,000<br/>
        <b>Year:</b> ${matchingCancerData[0].year || "N/A"}<br/>
      `;
    } else {
      popupContent += `<i>No cancer data available.</i>`;
    }

    layer.bindPopup(popupContent);
  };

  const styleFeature = (feature) => {
    const phuName = feature.properties.NAME_ENG;
    const match = cancerData.find((entry) => entry.geography === phuName);
    const rate = match ? match.rate : 0; // Default to 0 if no data

    return {
      fillColor: getColor(rate),
      weight: 1,
      opacity: 1,
      color: "#000", // Border color
      fillOpacity: 0.7,
    };
  };

  // ✅ Legend Component (Dynamically Updates Based on Data)
  const Legend = ({ minRate, maxRate }) => {
    const map = useMap();

    useEffect(() => {
      const legend = L.control({ position: "bottomright" });

      legend.onAdd = function () {
        const div = L.DomUtil.create("div", "info legend");
        const grades = [
          minRate,
          minRate + (maxRate - minRate) * 0.2,
          minRate + (maxRate - minRate) * 0.4,
          minRate + (maxRate - minRate) * 0.6,
          minRate + (maxRate - minRate) * 0.8,
          maxRate,
        ];
        const labels = [];

        div.innerHTML += "<strong> Incidence Rate </strong><br>";
        for (let i = 0; i < grades.length - 1; i++) {
          div.innerHTML +=
            '<i style="background:' +
            getColor(grades[i]) +
            '; width: 18px; height: 18px; display: inline-block; margin-right: 5px;"></i> ' +
            Math.round(grades[i]) +
            (grades[i + 1] ? " - " + Math.round(grades[i + 1]) + "<br>" : "+");
        }
        return div;
      };

      legend.addTo(map);

      return () => {
        map.removeControl(legend);
      };
    }, [minRate, maxRate, map]);

    return null;
  };

  return (
    <div className="flex flex-col h-screen">
      {/* ✅ Disease Selection & Cancer Subtypes */}
      <div className="bg-gray-100 shadow-md p-4 flex justify-between items-center">
        {/* ✅ Main Disease Selection */}
        <div className="flex flex-col space-y-2">
          {/* Main Disease Buttons */}
          <div className="flex space-x-4">
            {diseaseTypes.map((disease) => (
              <button
                key={disease}
                onClick={() => setSelectedDisease(disease)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedDisease === disease
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {disease}
              </button>
            ))}
          </div>

          {/* ✅ Cancer Subtypes as a Horizontal Bar (Only when Cancer is selected) */}
          {selectedDisease === "Cancer" && (
            <div className="flex space-x-2 mt-2">
              {cancerTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedCancerType(type)}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                    selectedCancerType === type
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ✅ Filters Button */}
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center space-x-2 bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          <IoFilter className="text-lg" />
          <span>Filters</span>
        </button>
      </div>
      {/* ✅ Sidebar Filter Panel */}
      {isFilterOpen && (
        <div className="fixed top-0 right-0 w-80 z-10 h-full bg-white shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filter Data</h2>
            <button onClick={() => setIsFilterOpen(false)}>
              <IoClose className="text-2xl" />
            </button>
          </div>

          {/* 🔹 Year Filter (Now Dynamic) */}
          <label className="block font-medium mb-1">Year</label>
          <select
            className="w-full p-2 border rounded-lg mb-4"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            {availableYears.length === 0 ? (
              <option value="">Loading...</option>
            ) : (
              availableYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            )}
          </select>

          {/* 🔹 Age Filter (Disabled if Gender is selected) */}
          <label className="block font-medium mb-1">Age Range</label>
          <select
            className={`w-full p-2 border rounded-lg mb-4 ${
              selectedGender !== ""
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : ""
            }`}
            value={selectedAge}
            onChange={(e) => {
              setSelectedAge(e.target.value);
              setSelectedGender(""); // ✅ Reset Gender
            }}
            disabled={selectedGender !== ""}
            title={
              selectedGender !== ""
                ? "You cannot select Age when Gender is chosen"
                : ""
            }
          >
            <option value="">Select Age</option>
            <option value="0-14">0-14</option>
            <option value="15-29">15-29</option>
            <option value="30-49">30-49</option>
            <option value="50-64">50-64</option>
            <option value="65-79">65-79</option>
            <option value="80+">80+</option>
          </select>

          {/* 🔹 Gender Filter (Disabled if Age is selected) */}
          <label className="block font-medium mb-2">Gender</label>
          <div className="flex space-x-2 mb-6">
            {["Both", "Male", "Female"].map((gender) => (
              <button
                key={gender}
                onClick={() => {
                  setSelectedGender(gender);
                  setSelectedAge(""); // ✅ Reset Age
                }}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedGender === gender
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } ${
                  selectedAge !== ""
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : ""
                }`} // ✅ Disable if Age is selected
                disabled={selectedAge !== ""}
                title={
                  selectedAge !== ""
                    ? "You cannot select Gender when Age is chosen"
                    : ""
                }
              >
                {gender}
              </button>
            ))}
          </div>

          {/* ✅ Apply & Reset Buttons */}
          <div className="flex space-x-4">
            <button
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply Filters
            </button>
            <button
              className="w-full bg-gray-200 px-4 py-2 rounded-lg font-semibold"
              onClick={() => {
                setSelectedAge("");
                setSelectedGender("");
                setSelectedYear("2020"); // ✅ Reset to Default Year
              }}
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* ✅ Map Display */}
      <div className="flex flex-1 flex-row justify-center z-0 items-center p-6 ">
        <MapContainer
          center={[49, -85]}
          zoom={5}
          minZoom={5}
          maxBounds={[
            [41.6, -95],
            [56.9, -74],
          ]}
          maxBoundsViscosity={1.0}
          className="w-full h-full rounded-lg shadow-lg "
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <GeoJSON
            key={geoJsonKey} // ✅ Force Re-render When Key Changes
            data={geoData}
            onEachFeature={onEachFeature}
            style={styleFeature}
          />

          {/* ✅ Add Dynamic Legend */}
          <Legend minRate={minRate} maxRate={maxRate} />
        </MapContainer>

        {/* ✅ Right Sidebar for Selected Region Details (Only Visible When Clicked) */}
        {selectedRegion && (
          <div className="w-100 h-full bg-white shadow-lg p-6 overflow-auto border-l border-gray-300">
            <h2 className="text-xl font-bold mb-4">{selectedRegion.name}</h2>

            {selectedRegion.phu && selectedRegion.phu.population ? (
              <>
                <p>
                  <b>Region:</b> {selectedRegion.phu.region || "N/A"}
                </p>
                <p>
                  <b>Population:</b> {selectedRegion.phu.population || "N/A"}
                </p>
                <p>
                  <b>Median Income:</b> $
                  {selectedRegion.phu.median_total_income || "N/A"}
                </p>
              </>
            ) : (
              <p className="text-gray-500">No PHU data available.</p>
            )}

            <hr className="my-4" />

            <h3 className="text-lg font-semibold">Cancer Data</h3>
            {selectedRegion.cancerData.length > 0 ? (
              selectedRegion.cancerData.map((entry, index) => (
                <div key={index} className="border-b py-2">
                  <p>
                    <b>Type:</b> {selectedCancerType.toUpperCase()}
                  </p>
                  <p>
                    <b>Incidence Rate:</b> {entry.rate || "N/A"} per 100,000
                  </p>
                  <p>
                    <b>Cases:</b> {entry.cases || "N/A"}
                  </p>
                  <p>
                    <b>Prevalence:</b> {entry.prevalence || "N/A"}
                  </p>
                  <p>
                    <b>Mortality:</b> {entry.mortality || "N/A"}
                  </p>
                  <p>
                    <b>Confidence Interval:</b> {entry.ci || "N/A"}
                  </p>
                  <p>
                    <b>Year:</b> {entry.year || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">
                No cancer data available for this region.
              </p>
            )}

            {/* ✅ "See Detailed Analysis" Button */}
            <button
              onClick={handleDetailedAnalysis}
              className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              See Detailed Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthMap;
