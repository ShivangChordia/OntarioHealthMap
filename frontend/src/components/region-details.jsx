"use client";

const RegionDetails = ({
  selectedRegion,
  selectedDisease,
  selectedCancerType,
  selectedChronicType,
  handleDetailedAnalysis,
}) => {
  // Function to determine the formatted statement based on the disease type
  const generateStatement = () => {
    if (!selectedRegion || !selectedRegion.healthData || selectedRegion.healthData.length === 0) {
      return `No ${selectedDisease.toLowerCase()} data available for this region.`;
    }

    const entry = selectedRegion.healthData[0]; // Assuming first entry is the most relevant

    let statement = `In the ${selectedRegion.name},`;

    if (selectedDisease === "Cancer") {
      statement += ` the estimated incidence rate for ${selectedCancerType.toLowerCase()} cancer was ${entry.rate} per 100,000 individuals in ${entry.year}, with a 95% confidence interval of ${entry.ci}. A total of ${entry.cases} cases were recorded.`;
    } else if (selectedDisease === "Chronic") {
      statement += ` the estimated prevalence rate for ${selectedChronicType.toLowerCase()} was ${entry.rate}% in ${entry.year}, affecting approximately ${entry.cases} individuals. The prevalence was observed with a confidence interval of ${entry.ci}.`;
    } else if (selectedDisease === "Smoking") {
      statement += ` the estimated smoking rate among adults was ${entry.rate}% in ${entry.year}, with a 95% confidence interval of ${entry.ci}. The sample size for this estimate was ${entry.sampleSize || 'N/A'}.`;
    } else if (selectedDisease === "Reproductive") {
      statement += ` the reproductive health indicators showed a rate of ${entry.rate} per 100,000 in ${entry.year}, with a confidence interval of ${entry.ci}.`;
    } else if (selectedDisease === "Overall Health") {
      statement += ` the overall health index was measured at ${entry.rate} in ${entry.year}, with a confidence interval of (${entry.ci}).`;
    }

    statement += ` According to regional estimates, the population of this area was ${selectedRegion.phu?.population || 'N/A'}, with a median income of $${selectedRegion.phu?.median_total_income?.toLocaleString() || 'N/A'}. For more demographic, social, and economic data, visit the Census County Profile.`;
    
    return statement;
  };

  return (
    <div className="w-100 h-full bg-white shadow-lg p-6 overflow-auto border-l border-gray-300">
      <h2 className="text-xl font-bold mb-4">{selectedRegion.name}</h2>
      
      <p className="text-gray-700">{generateStatement()}</p>
      
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
