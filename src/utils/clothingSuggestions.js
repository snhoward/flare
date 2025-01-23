const getClothingSuggestions = (temp, condition) => {
  const suggestions = {
    essentials: [],
    recommended: [],
    optional: []
  };

  // Temperature-based suggestions
  if (temp <= 0) {
    suggestions.essentials.push(
      'Heavy winter coat',
      'Thermal underwear',
      'Warm hat',
      'Insulated gloves',
      'Warm boots'
    );
    suggestions.recommended.push(
      'Scarf',
      'Wool socks',
      'Fleece layer'
    );
  } else if (temp <= 10) {
    suggestions.essentials.push(
      'Winter coat',
      'Warm sweater',
      'Long-sleeve shirts',
      'Gloves'
    );
    suggestions.recommended.push(
      'Light scarf',
      'Warm socks',
      'Boots'
    );
  } else if (temp <= 20) {
    suggestions.essentials.push(
      'Light jacket or coat',
      'Long-sleeve shirts',
      'Light sweater'
    );
    suggestions.recommended.push(
      'Closed-toe shoes',
      'Light scarf'
    );
  } else if (temp <= 25) {
    suggestions.essentials.push(
      'Light layers',
      'T-shirts',
      'Light long-sleeve shirts'
    );
    suggestions.recommended.push(
      'Light cardigan',
      'Comfortable walking shoes'
    );
  } else {
    suggestions.essentials.push(
      'Light, breathable clothing',
      'T-shirts',
      'Shorts or light pants'
    );
    suggestions.recommended.push(
      'Sun hat',
      'Sandals'
    );
    suggestions.optional.push(
      'Light cardigan for air-conditioned places'
    );
  }

  // Weather condition-based suggestions
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    suggestions.essentials.push('Rain jacket or umbrella');
    suggestions.recommended.push('Waterproof shoes');
  }
  if (conditionLower.includes('snow')) {
    suggestions.essentials.push(
      'Waterproof boots',
      'Waterproof coat'
    );
    suggestions.recommended.push('Snow pants');
  }
  if (conditionLower.includes('clear') && temp > 20) {
    suggestions.essentials.push(
      'Sunscreen',
      'Sunglasses'
    );
    suggestions.recommended.push('Sun hat');
  }
  if (conditionLower.includes('wind')) {
    suggestions.recommended.push('Windbreaker');
  }

  return suggestions;
};

export default getClothingSuggestions;
