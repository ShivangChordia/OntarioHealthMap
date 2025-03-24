"use client";

const RegionDetails = ({
  selectedRegion,
  selectedDisease,
  selectedCancerType,
  selectedChronicType,
  handleDetailedAnalysis,
}) => {
  // Determine the data type title and details based on selected disease
  const getDataTypeInfo = () => {
    if (selectedDisease === "Cancer") {
      return {
        title: "Cancer Data",
        typeLabel: selectedCancerType.toUpperCase(),
        rateLabel: "Incidence Rate",
      };
    } else if (selectedDisease === "Chronic") {
      return {
        title: "Chronic Disease Data",
        typeLabel: selectedChronicType,
        rateLabel: "Prevalence Rate",
      };
    } else if (selectedDisease === "Smoking") {
      return {
        title: "Smoking Statistics",
        typeLabel: "Tobacco Use",
        rateLabel: "Usage Rate",
      };
    } else if (selectedDisease === "Reproductive") {
      return {
        title: "Reproductive Health",
        typeLabel: "Reproductive Indicators",
        rateLabel: "Rate",
      };
    } else if (selectedDisease === "Overall Health") {
      return {
        title: "Overall Health Metrics",
        typeLabel: "Health Indicators",
        rateLabel: "Health Index",
      };
    } else {
      return {
        title: "Health Data",
        typeLabel: "General",
        rateLabel: "Rate",
      };
    }
  };

  const dataTypeInfo = getDataTypeInfo();

  return (
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
        <p className="text-gray-500">No demographic data available.</p>
      )}

      <hr className="my-4" />

      <h3 className="text-lg font-semibold">{dataTypeInfo.title}</h3>
      {selectedRegion.healthData && selectedRegion.healthData.length > 0 ? (
        selectedRegion.healthData.map((entry, index) => (
          <div key={index} className="border-b py-2">
            <p>
              <b>Type:</b> {dataTypeInfo.typeLabel}
            </p>
            <p>
              <b>{dataTypeInfo.rateLabel}:</b> {entry.rate || "N/A"} per 100,000
            </p>
            <p>
              <b>Cases:</b> {entry.cases || "N/A"}
            </p>
            {entry.prevalence && (
              <p>
                <b>Prevalence:</b> {entry.prevalence || "N/A"}
              </p>
            )}
            {entry.mortality && (
              <p>
                <b>Mortality:</b> {entry.mortality || "N/A"}
              </p>
            )}
            {entry.ci && (
              <p>
                <b>Confidence Interval:</b> {entry.ci || "N/A"}
              </p>
            )}
            <p>
              <b>Year:</b> {entry.year || "N/A"}
            </p>
            {/* Display additional metrics based on disease type */}
            {selectedDisease === "Chronic" && entry.comorbidity && (
              <p>
                <b>Comorbidity Rate:</b> {entry.comorbidity || "N/A"}%
              </p>
            )}
            {selectedDisease === "Smoking" && entry.quittingRate && (
              <p>
                <b>Quitting Success Rate:</b> {entry.quittingRate || "N/A"}%
              </p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">
          No {selectedDisease.toLowerCase()} data available for this region.
        </p>
      )}

      {/* "See Detailed Analysis" Button with dynamic text */}
      <button
        onClick={handleDetailedAnalysis}
        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        See Detailed {selectedDisease} Analysis
      </button>
    </div>
  );
};

export default RegionDetails;
