"use client";

const DiseaseSelector = ({
  diseaseTypes,
  selectedDisease,
  setSelectedDisease,
  cancerTypes,
  selectedCancerType,
  setSelectedCancerType,
  chronicTypes,
  selectedChronicType,
  setSelectedChronicType,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      {/* Main Disease Buttons */}
      <div className="flex space-x-4">
        {diseaseTypes.map((disease) => (
          <button
            key={disease}
            onClick={() => 
              setSelectedDisease(disease)
            }
            
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

      {/* Cancer Subtypes as a Horizontal Bar (Only when Cancer is selected) */}
      {selectedDisease === "Cancer" && cancerTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {cancerTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                setSelectedCancerType(type);
                console.log("✅ User Selected Cancer Type:", type);
              }}
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

      {/* Chronic Disease Subtypes (Only when Chronic is selected) */}
      {selectedDisease === "Chronic" && (
        <div className="flex flex-wrap gap-2 mt-2">
          {chronicTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedChronicType(type)}
              className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${
                selectedChronicType === type
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
  );
};

export default DiseaseSelector;
