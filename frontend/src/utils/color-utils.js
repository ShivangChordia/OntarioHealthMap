// Function to Generate High-Contrast Colors Based on Rate
export const getColorForRate = (rate, minRate, maxRate) => {
  if (!rate) return "#ffffcc" // Light Yellow (Lowest for missing data)

  const normalizedRate = (rate - minRate) / (maxRate - minRate) // Normalize between 0-1
  const colorScale = [
    "#ffffcc", // Very Low → Pale Yellow
    "#ffeda0", // Low → Soft Yellow
    "#feb24c", // Moderate → Orange
    "#fd8d3c", // High → Deep Orange
    "#f03b20", // Very High → Red
    "#bd0026", // Severe → Dark Red
    "#800026", // Extreme → Purple-Black
  ]

  const index = Math.floor(normalizedRate * (colorScale.length - 1))
  return colorScale[index]
}

