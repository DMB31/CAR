// Test script to verify CSV data import
// Run this in the browser console or as a Node.js script

// Simulate the JSON import
const testData = [
  {
    "Numero": 1,
    "Periode_validite": 2025,
    "Marque": "VOLKSWAGEN",
    "modele": "T-ROC",
    "Energie": "ESS",
    "Cylindree_cm3": "1,000",
    "Annee_dedouanement": 2025,
    "Pays d'origine": "Europe",
    "Neuf": "22,800",
    "moins d'un an": "22,800",
    "moins d'un 2 ans": "20,500",
    "moins de 3 ans": "18,400",
    "Code_monnaie": "EUR"
  },
  {
    "Numero": 2,
    "Periode_validite": 2025,
    "Marque": "VOLKSWAGEN",
    "modele": "T-ROC",
    "Energie": "ESS",
    "Cylindree_cm3": "1,400",
    "Annee_dedouanement": 2025,
    "Pays d'origine": "Europe",
    "Neuf": "26,500",
    "moins d'un an": "26,500",
    "moins d'un 2 ans": "23,800",
    "moins de 3 ans": "21,400",
    "Code_monnaie": "EUR"
  }
];

// Test functions
const normalizeString = (str) => {
  if (!str) return '';
  return str.toString().toUpperCase().trim().replace(/\s+/g, ' ');
};

const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  const cleaned = priceStr.toString().replace(/[^\d.,]/g, '');
  return parseFloat(cleaned.replace(',', '')) || 0;
};

const findCsvData = (brand, model, engineType, cylindree, origin) => {
  console.log('Testing findCsvData with:', { brand, model, engineType, cylindree, origin });
  
  const engineMap = {
    'essence': 'ESS',
    'diesel': 'DSL',
    'hybride': 'HYB',
    'electrique': 'ELC'
  };
  
  const originMap = {
    'europe': 'Europe',
    'chine': 'Autres pays',
    'dubai': 'Autres pays',
    'usa': 'Autres pays'
  };
  
  const csvEngineType = engineMap[engineType];
  const csvOrigin = originMap[origin];
  
  const normalizedBrand = normalizeString(brand);
  const normalizedModel = normalizeString(model);
  const normalizedCylindree = cylindree.replace(',', '');
  
  console.log('Normalized values:', { normalizedBrand, normalizedModel, normalizedCylindree, csvEngineType, csvOrigin });
  
  const match = testData.find((item) => {
    const itemBrand = normalizeString(item.Marque);
    const itemModel = normalizeString(item.modele);
    const itemCylindree = item.Cylindree_cm3?.replace(',', '') || '';
    
    const isMatch = itemBrand === normalizedBrand &&
                   itemModel === normalizedModel &&
                   item.Energie === csvEngineType &&
                   item['Pays d\'origine'] === csvOrigin &&
                   itemCylindree === normalizedCylindree;
    
    console.log('Checking item:', {
      itemBrand,
      itemModel,
      itemEnergie: item.Energie,
      itemOrigin: item['Pays d\'origine'],
      itemCylindree,
      isMatch
    });
    
    return isMatch;
  });
  
  console.log('Match found:', match);
  return match;
};

const getCsvPrice = (csvData, year, vehicleType) => {
  if (!csvData || !year) return 0;
  
  const currentYear = new Date().getFullYear();
  const vehicleYear = parseInt(year);
  const ageDifference = currentYear - vehicleYear;
  
  console.log('Price calculation:', { currentYear, vehicleYear, ageDifference, vehicleType });
  
  if (vehicleType === 'neuf') {
    const price = parsePrice(csvData.Neuf);
    console.log('New vehicle price:', price);
    return price;
  } else if (vehicleType === 'occasion') {
    if (ageDifference === 0) {
      const price = parsePrice(csvData['moins d\'un an']);
      console.log('Used vehicle (0 years) price:', price);
      return price;
    } else if (ageDifference === 1) {
      const price = parsePrice(csvData['moins d\'un 2 ans']);
      console.log('Used vehicle (1 year) price:', price);
      return price;
    } else if (ageDifference >= 2) {
      const price = parsePrice(csvData['moins de 3 ans']);
      console.log('Used vehicle (2+ years) price:', price);
      return price;
    }
  }
  
  return 0;
};

// Run tests
console.log('=== CSV IMPORT TEST ===');

// Test 1: Basic matching
console.log('\n--- Test 1: Basic matching ---');
const testMatch = findCsvData('VOLKSWAGEN', 'T-ROC', 'essence', '1,000', 'europe');
console.log('Test match result:', testMatch);

// Test 2: Price extraction
if (testMatch) {
  console.log('\n--- Test 2: Price extraction ---');
  const price = getCsvPrice(testMatch, '2025', 'neuf');
  console.log('Extracted price:', price);
}

// Test 3: Case insensitive matching
console.log('\n--- Test 3: Case insensitive matching ---');
const testMatch2 = findCsvData('volkswagen', 't-roc', 'essence', '1,000', 'europe');
console.log('Case insensitive match result:', testMatch2);

// Test 4: Price parsing
console.log('\n--- Test 4: Price parsing ---');
console.log('Parse "22,800":', parsePrice('22,800'));
console.log('Parse "26,500":', parsePrice('26,500'));
console.log('Parse "20,500":', parsePrice('20,500'));

console.log('\n=== TEST COMPLETE ===');

