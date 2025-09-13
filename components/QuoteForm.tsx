'use client'

import { useState, useEffect, useMemo } from 'react'
import { Calculator, Car, MapPin, Euro, Send, CheckCircle, Download, Edit3, Printer as PrintIcon, Sparkles, TrendingUp, Shield, Clock, FileDown } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import newCarData from '../new_car.json'; // Import the new CSV data
import Select from 'react-select';

export default function QuoteForm() {
  const t = useTranslations('QuoteForm');
  const locale = useLocale();
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    vehicleType: '',
    priceEur: '',
    engineType: '',
    cylindree: '',
    origin: '',
    destination: '',
    importType: 'classique' // Ajout du type d'importation
  })

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [calculationResult, setCalculationResult] = useState<{
    priceEur: number;
    prixDZD: number;
    prixBaseTaxes: number;
    droitDouane: number;
    montantDroitDouane: number;
    prct: number;
    tcs: number;
    tva: number;
    tic: number;
    totalDroitsTaxes: number;
    reduction: number;
    montantReduction: number;
    totalFinal: number;
    coutTotalVehicule: number;
    csvPrice: number; // New field for CSV-based price
    csvPriceDZD: number; // CSV price in DZD
  } | null>(null)

  // Taux de change modifiables - Extended to support multiple currencies
  const [exchangeRates, setExchangeRates] = useState({
    marcheNoir: 260,    // EUR -> DZD (marché noir)
    bancaire: 150,      // EUR -> DZD (bancaire)
    usdMarcheNoir: 240, // USD -> DZD (marché noir)
    usdBancaire: 135    // USD -> DZD (bancaire)
  })
  const [isEditingRates, setIsEditingRates] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState('');
  const [csvData, setCsvData] = useState<any>(null); // Store matched CSV data
  const [debugLog, setDebugLog] = useState<string[]>([]); // Store debug information
  const [selectedCurrency, setSelectedCurrency] = useState<string>('EUR'); // Store selected currency from CSV data
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>(['EUR']); // Available currencies for selected model

  // Calculate exchange rates based on selected currency (for display)
  const userBancaireRate = selectedCurrency === 'USD' ? exchangeRates.usdBancaire : exchangeRates.bancaire;
  const userExchangeRate = selectedCurrency === 'USD' ? exchangeRates.usdMarcheNoir : exchangeRates.marcheNoir;

  // Enhanced debugging function
  const addDebugLog = (message: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage, data || '');
    
    // Don't update state during render to prevent infinite loops
    // State updates are only done in event handlers and useEffect
  };

  // Function to get currency symbol and info
  const getCurrencyInfo = (currencyCode: string) => {
    const currencyMap: { [key: string]: { symbol: string, name: string, flag: string } } = {
      'EUR': { symbol: '€', name: 'Euro', flag: '🇪🇺' },
      'USD': { symbol: '$', name: 'Dollar US', flag: '🇺🇸' },
      'GBP': { symbol: '£', name: 'Livre Sterling', flag: '🇬🇧' },
      'JPY': { symbol: '¥', name: 'Yen Japonais', flag: '🇯🇵' },
      'CHF': { symbol: 'CHF', name: 'Franc Suisse', flag: '🇨🇭' },
      'CAD': { symbol: 'C$', name: 'Dollar Canadien', flag: '🇨🇦' },
      'AUD': { symbol: 'A$', name: 'Dollar Australien', flag: '🇦🇺' }
    };
    
    return currencyMap[currencyCode] || { symbol: currencyCode, name: currencyCode, flag: '🌍' };
  };

  // Get currency icon component for the selected currency
  const getCurrencyIcon = (currencyCode: string) => {
    const currencyInfo = getCurrencyInfo(currencyCode);
    
    // For now, we'll use the Euro icon for all currencies as it's already imported
    // You could extend this to import specific currency icons if needed
    return Euro;
  };

  // Debug: Log JSON data on component mount
  useEffect(() => {
    // Only log to console on mount, don't update state to avoid infinite loops
    console.log('=== CSV DATA INITIALIZATION ===');
    console.log('newCarData type:', typeof newCarData);
    console.log('newCarData length:', newCarData?.length);
    
    if (newCarData && Array.isArray(newCarData) && newCarData.length > 0) {
      console.log('First 3 records:', newCarData.slice(0, 3));
      console.log('Sample record structure:', newCarData[0]);
      
      // Check for data integrity - Updated for new format
      const validRecords = newCarData.filter(item => 
        item.Marque && 
        item.modele && 
        (parseFloat((item.Valeur_ref_FOB || '0').toString()) > 0 ||
         parseFloat((item.Valeur_FOB_1 || '0').toString()) > 0 ||
         parseFloat((item.Valeur_FOB_2 || '0').toString()) > 0 ||
         parseFloat((item.Valeur_FOB_3 || '0').toString()) > 0)
      );
      
      console.log('Total records:', newCarData.length);
      console.log('Valid records with prices:', validRecords.length);
      
      // Sample some brands and models
      const uniqueBrands = [...new Set(validRecords.map(item => item.Marque))].slice(0, 10);
      console.log('Sample brands:', uniqueBrands);
    } else {
      console.log('ERROR: newCarData is not valid or empty');
    }
    console.log('=====================');
  }, []);

  // Debug: Log availableCurrencies changes
  useEffect(() => {
    addDebugLog(`availableCurrencies changed: ${availableCurrencies.length} currencies available`);
    if (availableCurrencies.length > 1) {
      addDebugLog('Multiple currencies available:', availableCurrencies);
    }
  }, [availableCurrencies]);

  // Ensure data is loaded and update currencies when brand/model changes
  useEffect(() => {
    // Add a small delay to ensure all state updates are complete
    const timeoutId = setTimeout(() => {
      if (newCarData && Array.isArray(newCarData) && newCarData.length > 0 && 
          formData.brand && formData.model) {
        addDebugLog('Data loaded, updating currencies for current selection');
        addDebugLog(`Current form state - Brand: "${formData.brand}", Model: "${formData.model}"`);
        
        // Currency will be auto-detected when CSV data is found
        setAvailableCurrencies(['EUR']); // Default until auto-detected
      } else {
        addDebugLog('Currency update skipped - missing data or form fields');
        addDebugLog(`Data check - newCarData: ${!!newCarData}, brand: "${formData.brand}", model: "${formData.model}"`);
      }
    }, 100); // Small delay to ensure state updates are complete
    
    return () => clearTimeout(timeoutId);
  }, [newCarData, formData.brand, formData.model, selectedCurrency]);



  // Enhanced function to normalize strings for comparison
  const normalizeString = (str: string, debug: boolean = false): string => {
    if (!str) {
      if (debug) addDebugLog('WARNING: normalizeString received empty/null string');
      return '';
    }
    
    const normalized = str.toString()
      .toUpperCase()
      .trim()
      .replace(/\s+/g, ' ')              // Replace multiple spaces with single space
      .replace(/[àáâãäå]/g, 'A')         // Handle accented characters
      .replace(/[èéêë]/g, 'E')
      .replace(/[ìíîï]/g, 'I')
      .replace(/[òóôõö]/g, 'O')
      .replace(/[ùúûü]/g, 'U')
      .replace(/ç/g, 'C')
      .replace(/ñ/g, 'N')
      .replace(/[^A-Z0-9\s-]/g, '');     // Remove special characters except spaces and hyphens
    
    if (debug) addDebugLog(`String normalized: "${str}" → "${normalized}"`);
    return normalized;
  };

  // Enhanced function to parse price strings with commas and various formats
  const parsePrice = (priceStr: string, debug: boolean = false): number => {
    if (!priceStr) {
      if (debug) addDebugLog('WARNING: parsePrice received empty/null price');
      return 0;
    }
    
    if (debug) addDebugLog(`Parsing price: "${priceStr}"`);
    
    // Handle different formats: "22,800", "22800", "22.800", "22 800"
    let cleaned = priceStr.toString()
      .replace(/[^\d.,]/g, '')           // Remove all non-numeric characters except commas and dots
      .replace(/\s/g, '');              // Remove spaces
    
    // Handle European format (22.800,50) vs US format (22,800.50)
    // If there's a dot followed by exactly 2 digits at the end, it's decimal
    if (/\.\d{2}$/.test(cleaned)) {
      // US format: 22,800.50
      cleaned = cleaned.replace(/,/g, '');
    } else {
      // European format or whole number: 22.800 or 22,800
      // Replace comma with nothing and dot with nothing (assuming whole numbers)
      cleaned = cleaned.replace(/[,.]/g, '');
    }
    
    const parsed = parseFloat(cleaned) || 0;
    if (debug) addDebugLog(`Price parsed: "${priceStr}" → ${parsed}`);
    
    return parsed;
  };

  // Enhanced function to find matching CSV data with comprehensive debugging
  const findCsvData = (brand: string, model: string, engineType: string, cylindree: string, origin: string) => {
    addDebugLog('=== FIND CSV DATA DEBUG ===');
    addDebugLog('Input parameters:', { brand, model, engineType, cylindree, origin });
    
    if (!brand || !model || !engineType) {
      addDebugLog('❌ Missing required fields (brand, model, engineType are mandatory)');
      return null;
    }
    
    if (!newCarData || !Array.isArray(newCarData)) {
      addDebugLog('❌ newCarData is not valid');
      return null;
    }
    
    // Map engine types to CSV format
    const engineMap: { [key: string]: string } = {
      'essence': 'ESS',
      'diesel': 'DSL',
      'hybride': 'HYB',
      'electrique': 'ELC'
    };
    
    // Map origin to CSV format
    const originMap: { [key: string]: string } = {
      'europe': 'Europe',
      'chine': 'Autres pays',
      'dubai': 'Autres pays',
      'usa': 'Autres pays'
    };
    
    // Map origin to currency
    const originToCurrencyMap: { [key: string]: string } = {
      'europe': 'EUR',
      'chine': 'USD',
      'dubai': 'USD',
      'usa': 'USD'
    };
    
    const csvEngineType = engineMap[engineType];
    const csvOrigin = origin ? originMap[origin] : null;
    const expectedCurrency = origin ? originToCurrencyMap[origin] : null;
    
    addDebugLog('Mapped values:', { csvEngineType, csvOrigin, expectedCurrency });
    
    if (!csvEngineType) {
      addDebugLog('❌ Invalid engine type mapping');
      return null;
    }

    // Normalize input values
    const normalizedBrand = normalizeString(brand, false);
    const normalizedModel = normalizeString(model, false);
    const normalizedCylindree = cylindree ? cylindree.toString().replace(/[,.]/g, '') : '';
    
    addDebugLog('Normalized input:', { normalizedBrand, normalizedModel, normalizedCylindree, csvOrigin, selectedCurrency });
    
    // Create matching strategies with different levels of strictness
    const matchingStrategies = [
      {
        name: 'Exact match with origin-based currency',
        filter: (item: any) => {
          const itemBrand = normalizeString(item.Marque || '', false);
          const itemModel = normalizeString(item.modele || '', false);
          const itemCylindree = (item.Cylindree_cm3 || '').toString().replace(/[,.]/g, '');
          const itemOrigin = item['Pays d\'origine'] || '';
          const itemEngine = item.Energie || '';
          const itemCurrency = item.Code_monnaie || '';
          
          return itemBrand === normalizedBrand &&
                 itemModel === normalizedModel &&
                 itemEngine === csvEngineType &&
                 (expectedCurrency ? itemCurrency === expectedCurrency : true) &&
                 (csvOrigin ? itemOrigin === csvOrigin : true) &&
                 (normalizedCylindree ? itemCylindree === normalizedCylindree : true);
        }
      },
      {
        name: 'Match with origin-based currency (no cylindree)',
        filter: (item: any) => {
          const itemBrand = normalizeString(item.Marque || '', false);
          const itemModel = normalizeString(item.modele || '', false);
          const itemOrigin = item['Pays d\'origine'] || '';
          const itemEngine = item.Energie || '';
          const itemCurrency = item.Code_monnaie || '';
          
          return itemBrand === normalizedBrand &&
                 itemModel === normalizedModel &&
                 itemEngine === csvEngineType &&
                 (expectedCurrency ? itemCurrency === expectedCurrency : true) &&
                 (csvOrigin ? itemOrigin === csvOrigin : true);
        }
      },
      {
        name: 'Match with origin-based currency (no origin)',
        filter: (item: any) => {
          const itemBrand = normalizeString(item.Marque || '', false);
          const itemModel = normalizeString(item.modele || '', false);
          const itemCylindree = (item.Cylindree_cm3 || '').toString().replace(/[,.]/g, '');
          const itemEngine = item.Energie || '';
          const itemCurrency = item.Code_monnaie || '';
          
          return itemBrand === normalizedBrand &&
                 itemModel === normalizedModel &&
                 itemEngine === csvEngineType &&
                 (expectedCurrency ? itemCurrency === expectedCurrency : true) &&
                 (normalizedCylindree ? itemCylindree === normalizedCylindree : true);
        }
      },
      {
        name: 'Basic match with origin-based currency',
        filter: (item: any) => {
          const itemBrand = normalizeString(item.Marque || '', false);
          const itemModel = normalizeString(item.modele || '', false);
          const itemEngine = item.Energie || '';
          const itemCurrency = item.Code_monnaie || '';
          
          return itemBrand === normalizedBrand &&
                 itemModel === normalizedModel &&
                 itemEngine === csvEngineType &&
                 (expectedCurrency ? itemCurrency === expectedCurrency : true);
        }
      },
      {
        name: 'Fallback match (any currency)',
        filter: (item: any) => {
          const itemBrand = normalizeString(item.Marque || '', false);
          const itemModel = normalizeString(item.modele || '', false);
          const itemEngine = item.Energie || '';
          
          return itemBrand === normalizedBrand &&
                 itemModel === normalizedModel &&
                 itemEngine === csvEngineType;
        }
      }
    ];
    
    // Try each matching strategy
    for (const strategy of matchingStrategies) {
      addDebugLog(`🔍 Trying strategy: ${strategy.name}`);
      
      const matches = newCarData.filter(strategy.filter);
      
      if (matches.length > 0) {
        addDebugLog(`✅ Found ${matches.length} match(es) with strategy: ${strategy.name}`);
        
        // Log all matches - Updated for new format
        matches.forEach((match, index) => {
          addDebugLog(`Match ${index + 1}:`, {
            Marque: match.Marque,
            modele: match.modele,
            Energie: match.Energie,
            'Pays d\'origine': match['Pays d\'origine'],
            Cylindree_cm3: match.Cylindree_cm3,
            prices: {
              Valeur_ref_FOB: match.Valeur_ref_FOB,
              Valeur_FOB_1: match.Valeur_FOB_1,
              Valeur_FOB_2: match.Valeur_FOB_2,
              Valeur_FOB_3: match.Valeur_FOB_3
            }
          });
        });
        
        // Return the first match (you could implement logic to choose the best match)
        const bestMatch = matches[0];
        addDebugLog('Selected match:', bestMatch);
        
        // Automatically set the currency based on the matched car's currency
        const matchedCurrency = bestMatch.Code_monnaie || expectedCurrency;
        if (matchedCurrency && matchedCurrency !== selectedCurrency) {
          addDebugLog(`🔄 Auto-updating currency from ${selectedCurrency} to ${matchedCurrency} based on car origin`);
          setSelectedCurrency(matchedCurrency);
        }
        
        return bestMatch;
      }
    }
    
    // If no matches found, show debugging information
    addDebugLog('❌ No matches found with any strategy');
    addDebugLog('Showing sample data for debugging:');
    
    // Show some sample records for the same brand
    const brandMatches = newCarData.filter(item => 
      normalizeString(item.Marque || '') === normalizedBrand
    ).slice(0, 5);
    
    if (brandMatches.length > 0) {
      addDebugLog(`Found ${brandMatches.length} records for brand "${brand}":`);
      brandMatches.forEach((item, index) => {
        addDebugLog(`Brand match ${index + 1}:`, {
          Marque: item.Marque,
          modele: item.modele,
          Energie: item.Energie,
          'Pays d\'origine': item['Pays d\'origine'],
          Cylindree_cm3: item.Cylindree_cm3
        });
      });
    } else {
      addDebugLog(`No records found for brand "${brand}"`);
      
      // Show available brands
      const availableBrands = [...new Set(newCarData.map(item => item.Marque))].slice(0, 10);
      addDebugLog('Available brands (first 10):', availableBrands);
    }
    
    return null;
  };

  // Enhanced function to get CSV price with better parsing
  const getCsvPrice = (csvData: any, year: string, vehicleType: string) => {
    addDebugLog('=== GET CSV PRICE DEBUG ===');
    addDebugLog('Input parameters:', { csvData: !!csvData, year, vehicleType });
    
    if (!csvData || !year) {
      addDebugLog('❌ Missing csvData or year in getCsvPrice');
      return 0;
    }
    
    const currentYear = new Date().getFullYear();
    const vehicleYear = parseInt(year);
    const ageDifference = currentYear - vehicleYear;
    
    addDebugLog('Age calculation:', { currentYear, vehicleYear, ageDifference });
    
    // Log all available price fields - Updated for new format
    const priceFields = {
      Valeur_ref_FOB: csvData.Valeur_ref_FOB,
      Valeur_FOB_1: csvData.Valeur_FOB_1,
      Valeur_FOB_2: csvData.Valeur_FOB_2,
      Valeur_FOB_3: csvData.Valeur_FOB_3
    };
    addDebugLog('Available price fields:', priceFields);
    
    let price = 0;
    let priceField = '';
    
    // For new vehicles, always use "Valeur_ref_FOB" price
    if (vehicleType === 'neuf') {
      priceField = 'Valeur_ref_FOB';
      price = parseFloat((csvData.Valeur_ref_FOB || '0').toString()) || 0;
      addDebugLog(`New vehicle - using ${priceField} price:`, price);
    }
    // For used vehicles, use age-based pricing
    else if (vehicleType === 'occasion') {
      if (ageDifference <= 0) {
        // Current year vehicle (2025) - use Valeur_FOB_1 (most recent used price)
        priceField = 'Valeur_FOB_1';
        price = parseFloat((csvData.Valeur_FOB_1 || '0').toString()) || 0;
        addDebugLog(`Used vehicle (current year ${year}) - using ${priceField} price:`, price);
      } else if (ageDifference === 1) {
        // 1 year old vehicle (2024) - use Valeur_FOB_2 (intermediate used price)
        priceField = 'Valeur_FOB_2';
        price = parseFloat((csvData.Valeur_FOB_2 || '0').toString()) || 0;
        addDebugLog(`Used vehicle (1 year old ${year}) - using ${priceField} price:`, price);
      } else if (ageDifference >= 2) {
        // 2+ years old vehicle (2023 and older) - use Valeur_FOB_3 (oldest used price)
        priceField = 'Valeur_FOB_3';
        price = parseFloat((csvData.Valeur_FOB_3 || '0').toString()) || 0;
        addDebugLog(`Used vehicle (2+ years old ${year}) - using ${priceField} price:`, price);
      }
    }
    
    addDebugLog(`Final price determination: ${price} (from field: ${priceField})`);
    
    if (price === 0) {
      addDebugLog('⚠️ Warning: Price is 0, trying alternative fields');
      
      // Try alternative price fields if primary field is 0 - Updated for new format
      const alternativeFields = ['Valeur_ref_FOB', 'Valeur_FOB_1', 'Valeur_FOB_2', 'Valeur_FOB_3'];
      for (const field of alternativeFields) {
        const altPrice = parseFloat((csvData[field] || '0').toString()) || 0;
        if (altPrice > 0) {
          addDebugLog(`Using alternative field ${field}:`, altPrice);
          return altPrice;
        }
      }
      
      addDebugLog('❌ All price fields are 0 or invalid');
      addDebugLog('Raw price values:', priceFields);
    }
    
    return price;
  };

  // Enhanced function to get available cylindrée options
  const getAvailableCylindree = (brand: string, model: string, engineType: string, origin: string) => {
    addDebugLog('=== GET AVAILABLE CYLINDREE DEBUG ===');
    addDebugLog('Input parameters:', { brand, model, engineType, origin });
    
    if (!brand || !model) {
      addDebugLog('❌ Missing brand or model');
      return [];
    }
    
    if (!newCarData || !Array.isArray(newCarData)) {
      addDebugLog('❌ newCarData is not valid');
      return [];
    }
    
    // Map engine types and origin like in findCsvData
    const engineMap: { [key: string]: string } = {
      'essence': 'ESS',
      'diesel': 'DSL',
      'hybride': 'HYB',
      'electrique': 'ELC'
    };
    
    const originMap: { [key: string]: string } = {
      'europe': 'Europe',
      'chine': 'Autres pays',
      'dubai': 'Autres pays',
      'usa': 'Autres pays'
    };
    
    const csvEngineType = engineType ? engineMap[engineType] : null;
    const csvOrigin = origin ? originMap[origin] : null;
    
    addDebugLog('Mapped values for cylindree search:', { csvEngineType, csvOrigin });
    
    // Normalize input values
    const normalizedBrand = normalizeString(brand, false);
    const normalizedModel = normalizeString(model, false);
    
    // Find all matching records
    const matches = newCarData.filter((item: any) => {
      const itemBrand = normalizeString(item.Marque || '', false);
      const itemModel = normalizeString(item.modele || '', false);
      
      const brandMatch = itemBrand === normalizedBrand;
      const modelMatch = itemModel === normalizedModel;
      const engineMatch = csvEngineType ? item.Energie === csvEngineType : true;
      const originMatch = csvOrigin ? item['Pays d\'origine'] === csvOrigin : true;
      
      // Also check if the record has valid prices - Updated for new format
      const hasValidPrice = parseFloat((item.Valeur_ref_FOB || '0').toString()) > 0 ||
                           parseFloat((item.Valeur_FOB_1 || '0').toString()) > 0 ||
                           parseFloat((item.Valeur_FOB_2 || '0').toString()) > 0 ||
                           parseFloat((item.Valeur_FOB_3 || '0').toString()) > 0;
      
      return brandMatch && modelMatch && engineMatch && originMatch && hasValidPrice;
    });
    
    addDebugLog(`Found ${matches.length} matches for cylindree extraction`);
    
    // Extract unique cylindrée values and sort them
    const cylindreeOptions = [...new Set(matches
      .map((item: any) => item.Cylindree_cm3)
      .filter(Boolean))]
      .sort((a, b) => {
        const aNum = parseInt((a || '').toString());
        const bNum = parseInt((b || '').toString());
        return aNum - bNum;
      });
    
    addDebugLog('Extracted cylindrée options:', cylindreeOptions);
    return cylindreeOptions;
  };

  // Enhanced function to get cylindrée options based only on brand and model
  const getCylindreeByModel = (brand: string, model: string) => {
    if (!brand || !model) {
      return []; // Early return without logging for empty parameters
    }
    
    addDebugLog('=== GET CYLINDREE BY MODEL DEBUG ===');
    addDebugLog('Input parameters:', { brand, model });
    
    if (!newCarData || !Array.isArray(newCarData)) {
      addDebugLog('❌ newCarData is not valid');
      return [];
    }
    
    // Normalize input values
    const normalizedBrand = normalizeString(brand, false);
    const normalizedModel = normalizeString(model, false);
    
    // Find all records for this brand/model combination with valid prices
    const matches = newCarData.filter((item: any) => {
      const itemBrand = normalizeString(item.Marque || '', false);
      const itemModel = normalizeString(item.modele || '', false);
      
      if (itemBrand !== normalizedBrand || itemModel !== normalizedModel) return false;
      
      // Check for valid prices - Updated for new format
      const hasValidPrice = parseFloat((item.Valeur_ref_FOB || '0').toString()) > 0 ||
                           parseFloat((item.Valeur_FOB_1 || '0').toString()) > 0 ||
                           parseFloat((item.Valeur_FOB_2 || '0').toString()) > 0 ||
                           parseFloat((item.Valeur_FOB_3 || '0').toString()) > 0;
      
      if (hasValidPrice) {
        addDebugLog('Valid price found for cylindree extraction:', {
          Marque: item.Marque,
          modele: item.modele,
          Energie: item.Energie,
          Cylindree_cm3: item.Cylindree_cm3,
          prices: {
            Valeur_ref_FOB: item.Valeur_ref_FOB,
            Valeur_FOB_1: item.Valeur_FOB_1,
            Valeur_FOB_2: item.Valeur_FOB_2,
            Valeur_FOB_3: item.Valeur_FOB_3
          }
        });
      }
      
      return hasValidPrice;
    });
    
    addDebugLog(`Found ${matches.length} valid matches for ${brand} ${model}`);
    
    // Extract unique cylindrée values and sort them
    const cylindreeOptions = [...new Set(matches
      .map((item: any) => item.Cylindree_cm3)
      .filter(Boolean))]
      .sort((a, b) => {
        const aNum = parseInt((a || '').toString());
        const bNum = parseInt((b || '').toString());
        return aNum - bNum;
      });
    
    addDebugLog('Final cylindrée options:', cylindreeOptions);
    return cylindreeOptions;
  };

  // Function to get price label based on vehicle type and age
  const getPriceLabel = (vehicleType: string, year: string) => {
    if (!year) return '';
    
    const currentYear = new Date().getFullYear();
    const vehicleYear = parseInt(year);
    const ageDifference = currentYear - vehicleYear;
    
    if (vehicleType === 'neuf') {
      return 'Prix neuf (officiel)';
    } else if (vehicleType === 'occasion') {
      if (ageDifference <= 0) {
        return `Prix ${year} (officiel)`; // Current year uses current year price
      } else if (ageDifference === 1) {
        return `Prix ${year} (officiel)`; // 1 year old uses same year price
      } else if (ageDifference >= 2) {
        return `Prix ${year} (officiel)`; // 2+ years old uses same year price
      }
    }
    
    return 'Prix officiel';
  };

  const calculateCustomsDuty = () => {
    addDebugLog('=== CALCULATE CUSTOMS DUTY DEBUG ===');
    addDebugLog('Input formData:', formData);
    
    if (!formData.priceEur || !formData.engineType || !formData.vehicleType) {
      addDebugLog('❌ Missing required fields for calculation:', {
        priceEur: formData.priceEur,
        engineType: formData.engineType,
        vehicleType: formData.vehicleType
      });
      return null;
    }

    // Find matching CSV data using enhanced matching logic
    const matchedCsvData = findCsvData(
      formData.brand, 
      formData.model, 
      formData.engineType, 
      formData.cylindree, 
      formData.origin
    );
    
    addDebugLog('✅ Matched CSV data result:', !!matchedCsvData);
    if (matchedCsvData) {
      addDebugLog('CSV data details:', {
        Marque: matchedCsvData.Marque,
        modele: matchedCsvData.modele,
        Energie: matchedCsvData.Energie,
        'Pays d\'origine': matchedCsvData['Pays d\'origine'],
        Cylindree_cm3: matchedCsvData.Cylindree_cm3
      });
    }
    
    // Get CSV price for customs calculation
    const csvPrice = matchedCsvData ? getCsvPrice(matchedCsvData, formData.year, formData.vehicleType) : 0;
    
    // Convert CSV price to DZD using the appropriate exchange rate based on CSV currency
    let csvPriceDZD = 0;
    if (csvPrice > 0 && matchedCsvData && matchedCsvData.Code_monnaie) {
      const csvCurrency = matchedCsvData.Code_monnaie;
      if (csvCurrency === 'USD') {
        // For USD prices, use the USD bancaire rate directly
        csvPriceDZD = csvPrice * exchangeRates.usdBancaire;
        addDebugLog(`USD price converted: ${csvPrice} USD → ${csvPriceDZD} DZD (using USD bancaire rate: ${exchangeRates.usdBancaire})`);
      } else if (csvCurrency === 'EUR') {
        // For EUR prices, use the existing bancaire rate
        csvPriceDZD = csvPrice * exchangeRates.bancaire;
        addDebugLog(`EUR price converted: ${csvPrice} EUR → ${csvPriceDZD} DZD (using EUR bancaire rate: ${exchangeRates.bancaire})`);
      } else {
        // For other currencies, fallback to EUR rate (you can add more currency handling here)
        csvPriceDZD = csvPrice * exchangeRates.bancaire;
        addDebugLog(`Other currency (${csvCurrency}) price converted using EUR rate: ${csvPrice} ${csvCurrency} → ${csvPriceDZD} DZD`);
      }
    } else {
      csvPriceDZD = csvPrice * exchangeRates.bancaire; // Fallback to EUR rate
    }
    
    addDebugLog('💰 CSV price calculation:', { 
      csvPrice, 
      csvPriceDZD, 
      exchangeRateBancaire: exchangeRates.bancaire,
      csvDataFound: !!matchedCsvData
    });
    
    // Store CSV data for display
    setCsvData(matchedCsvData);
    
    // Update selected currency based on CSV data
    if (matchedCsvData && matchedCsvData.Code_monnaie) {
      const csvCurrency = matchedCsvData.Code_monnaie;
      setSelectedCurrency(csvCurrency);
      setAvailableCurrencies([csvCurrency]); // Set available currencies to only the auto-detected one
      addDebugLog('Currency updated from CSV data:', csvCurrency);
      
      // Also update the form data to reflect the new currency
      // This ensures the user knows what currency they should enter
      addDebugLog('Form currency context updated to match CSV data');
    }

    const userPrice = parseFloat(formData.priceEur);
    
    // Use the correct exchange rates based on selected currency
    const userBancaireRate = selectedCurrency === 'USD' ? exchangeRates.usdBancaire : exchangeRates.bancaire;
    const userExchangeRate = selectedCurrency === 'USD' ? exchangeRates.usdMarcheNoir : exchangeRates.marcheNoir;
    
    // If no CSV data found, use user price for customs calculation (fallback)
    const basePriceForTaxes = csvPrice > 0 ? csvPriceDZD : userPrice * userBancaireRate;
    
    addDebugLog('💡 Base price for taxes calculation:', {
      csvPrice,
      csvPriceDZD,
      userPrice: userPrice,
      userPriceDZD: userPrice * userBancaireRate,
      basePriceForTaxes,
      usingCsvPrice: csvPrice > 0
    });

    // Gestion des cas spéciaux
    if (formData.importType === 'moujahidine') {
      addDebugLog('Special case: Moujahidine - total exemption');
      return {
        priceEur: userPrice,
        prixDZD: userPrice * userExchangeRate,
        prixBaseTaxes: basePriceForTaxes,
        droitDouane: 0,
        montantDroitDouane: 0,
        prct: 0,
        tcs: 0,
        tva: 0,
        tic: 0,
        totalDroitsTaxes: 0,
        reduction: 100,
        montantReduction: 0,
        totalFinal: 0,
        coutTotalVehicule: userPrice * userExchangeRate,
        csvPrice: csvPrice,
        csvPriceDZD: csvPriceDZD
      };
    }
    
    const cylindree = parseInt(String(formData.cylindree || '0').replace(/[,.]/g, '')) || 0;
    addDebugLog('Cylindrée parsed:', { original: formData.cylindree, parsed: cylindree });
    
    // Prix en DZD (marché noir) - User's actual price
    const prixDZD = userPrice * userExchangeRate;
    
    // Prix de base pour calcul des taxes (official price with bancaire rate, or fallback to user price)
    const prixBaseTaxes = basePriceForTaxes;

    // Calcul du droit de douane
    let droitDouane = 0;
    
    if (formData.engineType === 'electrique') {
      droitDouane = 0.30; // 30%
    } else if (formData.engineType === 'essence' || formData.engineType === 'diesel' || formData.engineType === 'hybride') {
      if (cylindree < 1000) {
        droitDouane = 0.15; // 15%
      } else if (cylindree >= 1000 && cylindree <= 1500) {
        droitDouane = 0.15; // 15%
      } else if (cylindree > 1500 && cylindree <= 1800) {
        droitDouane = 0.30; // 30%
      } else if (cylindree > 1800) {
        droitDouane = 0.30; // 30%
      }
    }

    addDebugLog('Customs duty rate calculated:', {
      engineType: formData.engineType,
      cylindree,
      droitDouane: droitDouane * 100 + '%'
    });

    // Application réduction CCR
    let montantDroitDouane = prixBaseTaxes * droitDouane;
    if (formData.importType === 'ccr') {
      montantDroitDouane = montantDroitDouane * 0.15; // 85% de réduction
      addDebugLog('CCR reduction applied: 85% reduction on customs duty');
    }
 
    // Calcul des taxes
    const prct = prixBaseTaxes * 0.02; // 2%
    const tcs = prixBaseTaxes * 0.02; // 2%
    
    // Base pour TVA
    const baseTVA = prixBaseTaxes + montantDroitDouane + prct + tcs;
    const tva = baseTVA * 0.19; // 19%
    
    // TIC (Taxe Intérieure de Consommation) pour cylindrée > 2000cm³
    let tic = 0;
    if (cylindree > 2000) {
      tic = prixBaseTaxes * 0.60; // 60%
      addDebugLog('TIC applied for cylindree > 2000cm³:', { cylindree, tic });
    }
 
    // Total des droits et taxes
    let totalDroitsTaxes = montantDroitDouane + prct + tcs + tva + tic;
 
    addDebugLog('Tax calculation details:', {
      prixBaseTaxes,
      montantDroitDouane,
      prct,
      tcs,
      baseTVA,
      tva,
      tic,
      totalDroitsTaxes
    });
 
    // Réductions pour véhicules d'occasion (selon loi de finances 2023)
    let reduction = 0;
    if (formData.vehicleType === 'occasion') {
      if (formData.engineType === 'electrique') {
        reduction = 0.80; // 80%
      } else if ((formData.engineType === 'essence' || formData.engineType === 'diesel' || formData.engineType === 'hybride') && cylindree <= 1800) {
        reduction = 0.50; // 50%
      } else if ((formData.engineType === 'essence' || formData.engineType === 'diesel' || formData.engineType === 'hybride') && cylindree > 1800) {
        reduction = 0.20; // 20%
      }
      
      addDebugLog('Used vehicle reduction applied:', {
        vehicleType: formData.vehicleType,
        engineType: formData.engineType,
        cylindree,
        reduction: reduction * 100 + '%'
      });
    }
 
    const montantReduction = totalDroitsTaxes * reduction;
    const totalFinal = totalDroitsTaxes - montantReduction;
    const coutTotalVehicule = prixDZD + totalFinal; // User price + customs
 
    const result = {
      priceEur: userPrice,
      prixDZD,
      prixBaseTaxes,
      droitDouane: droitDouane * 100,
      montantDroitDouane,
      prct,
      tcs,
      tva,
      tic,
      totalDroitsTaxes,
      reduction: reduction * 100,
      montantReduction,
      totalFinal,
      coutTotalVehicule,
      csvPrice: csvPrice,
      csvPriceDZD: csvPriceDZD
    };
 
    addDebugLog('Final calculation result:', result);
    return result;
  }
 
  const getPdfContent = () => {
    if (!calculationResult) return '';
    
    // Détermination de la note selon le type d'importation (multilingue)
    let importNote = '';
    if (formData.importType === 'moujahidine') {
      importNote = t('pdf_note_moujahidine');
    } else if (formData.importType === 'ccr') {
      importNote = t('pdf_note_ccr');
    } else {
      importNote = t('pdf_note_classique');
    }
 
    // Add official price information note
    let officialPriceNote = '';
    if (calculationResult.csvPrice > 0) {
      const officialCurrency = csvData?.Code_monnaie || 'EUR';
      const officialRate = officialCurrency === 'USD' ? exchangeRates.usdBancaire : exchangeRates.bancaire;
      officialPriceNote = `Note: Les droits de douane ont été calculés sur la base du prix officiel (${calculationResult.csvPrice.toLocaleString()} ${officialCurrency}) converti au taux ${officialRate} DZD/${officialCurrency} et non sur le prix utilisateur.`;
    } else {
      officialPriceNote = 'Note: Aucune donnée officielle correspondante trouvée. Les droits de douane ont été calculés sur la base du prix utilisateur.';
    }
    
    // Calculate exchange rates based on selected currency (for template string)
    const userBancaireRate = selectedCurrency === 'USD' ? exchangeRates.usdBancaire : exchangeRates.bancaire;
    const userExchangeRate = selectedCurrency === 'USD' ? exchangeRates.usdMarcheNoir : exchangeRates.marcheNoir;
 
    return `
        <!DOCTYPE html>
        <html dir="${locale === 'ar' ? 'rtl' : 'ltr'}">
        <head>
          <meta charset="UTF-8">
          <title>${t('result_calculation_title')}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; }
            th { background: #f5f5f5; }
            tr.total { font-weight: bold; background: #f0f0f0; }
          </style>
        </head>
        <body>
          <h1>${t('result_calculation_title')}</h1>
          <p>${t('result_calculation_subtitle')}</p>
          <p style="text-align:right; color:#666; font-size:14px; margin-bottom:24px;">
            <strong>Devis généré le:</strong> ${new Date().toLocaleDateString('fr-FR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          
          <h2>🚗 Informations du véhicule</h2>
          <table style="margin-bottom:24px; border:2px solid #1e40af;">
            <tr style="background-color:#f8fafc;">
              <td style="padding:12px; font-weight:bold; color:#1e40af; border:1px solid #1e40af;">Marque:</td>
              <td style="padding:12px; border:1px solid #1e40af;">${formData.brand || 'Non spécifiée'}</td>
            </tr>
            <tr style="background-color:#f8fafc;">
              <td style="padding:12px; font-weight:bold; color:#1e40af; border:1px solid #1e40af;">Modèle:</td>
              <td style="padding:12px; border:1px solid #1e40af;">${formData.model || 'Non spécifié'}</td>
            </tr>
            <tr style="background-color:#f8fafc;">
              <td style="padding:12px; font-weight:bold; color:#1e40af; border:1px solid #1e40af;">Année:</td>
              <td style="padding:12px; border:1px solid #1e40af;">${formData.year || 'Non spécifiée'}</td>
            </tr>
            <tr style="background-color:#f8fafc;">
              <td style="padding:12px; font-weight:bold; color:#1e40af; border:1px solid #1e40af;">Type:</td>
              <td style="padding:12px; border:1px solid #1e40af;">${formData.vehicleType === 'neuf' ? 'Véhicule neuf' : 'Véhicule d\'occasion'}</td>
            </tr>
            <tr style="background-color:#f8fafc;">
              <td style="padding:12px; font-weight:bold; color:#1e40af; border:1px solid #1e40af;">Motorisation:</td>
              <td style="padding:12px; border:1px solid #1e40af;">${formData.engineType || 'Non spécifiée'}</td>
            </tr>
            <tr style="background-color:#f8fafc;">
              <td style="padding:12px; font-weight:bold; color:#1e40af; border:1px solid #1e40af;">Cylindrée:</td>
              <td style="padding:12px; border:1px solid #1e40af;">${formData.cylindree ? formData.cylindree + ' cm³' : 'Non spécifiée'}</td>
            </tr>
            <tr style="background-color:#f8fafc;">
              <td style="padding:12px; font-weight:bold; color:#1e40af; border:1px solid #1e40af;">Origine:</td>
              <td style="padding:12px; border:1px solid #1e40af;">${formData.origin || 'Non spécifiée'}</td>
            </tr>
            <tr style="background-color:#f8fafc;">
              <td style="padding:12px; font-weight:bold; color:#1e40af; border:1px solid #1e40af;">Type d'importation:</td>
              <td style="padding:12px; border:1px solid #1e40af;">${formData.importType === 'ccr' ? 'CCR (Changement de Résidence)' : formData.importType === 'moujahidine' ? 'Moudjahidine' : 'Classique'}</td>
            </tr>
          </table>
          
          <h2>💰 Informations sur les prix</h2>
          <table style="margin-bottom:24px;">
            <tr>
              <td style="padding:8px; font-weight:bold; color:#1e40af;">Prix utilisateur (marché parallèle):</td>
              <td style="padding:8px;">${calculationResult.priceEur.toLocaleString()} ${selectedCurrency}</td>
              <td style="padding:8px;">${calculationResult.prixDZD.toLocaleString()} DZD</td>
            </tr>
            <tr>
              <td style="padding:8px; font-weight:bold; color:#059669;">${getPriceLabel(formData.vehicleType, formData.year)}:</td>
              <td style="padding:8px;">${calculationResult.csvPrice.toLocaleString()} ${csvData?.Code_monnaie || 'EUR'}</td>
              <td style="padding:8px;">${calculationResult.csvPriceDZD.toLocaleString()} DZD</td>
            </tr>
            ${selectedCurrency === 'USD' ? `
            <tr style="background-color:#f0f9ff;">
              <td style="padding:8px; font-size:12px; color:#0369a1;" colspan="3">
                💱 Taux USD utilisé: 1 USD = ${exchangeRates.usdBancaire} DZD
              </td>
            </tr>
            ` : ''}
          </table>
          
          <h2>${t('result_costs_title')}</h2>
          <table>
            <thead>
              <tr>
                <th>${t('result_table_header_element')}</th>
                <th>${t('result_table_header_base')}</th>
                <th>${t('result_table_header_rate')}</th>
                <th>${t('result_table_header_amount')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${t('result_table_item_price')}</td>
                <td>${calculationResult.priceEur.toLocaleString()} ${selectedCurrency}</td>
                <td>${t('exchange_rate_marcheNoir_label')} (${userExchangeRate})</td>
                <td>${calculationResult.prixDZD.toLocaleString()} DZD</td>
              </tr>
              <tr>
                <td>${t('result_table_item_customs')}</td>
                <td>${calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                <td>${calculationResult.droitDouane}%</td>
                <td>${calculationResult.montantDroitDouane.toLocaleString()} DZD</td>
              </tr>
              <tr>
                <td>${t('result_table_item_prct')}</td>
                <td>${calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                <td>2%</td>
                <td>${calculationResult.prct.toLocaleString()} DZD</td>
              </tr>
              <tr>
                <td>${t('result_table_item_tcs')}</td>
                <td>${calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                <td>2%</td>
                <td>${calculationResult.tcs.toLocaleString()} DZD</td>
              </tr>
              <tr>
                <td>${t('result_table_item_tva')}</td>
                <td>${(calculationResult.prixBaseTaxes + calculationResult.montantDroitDouane + calculationResult.prct + calculationResult.tcs).toLocaleString()} DZD</td>
                <td>19%</td>
                <td>${calculationResult.tva.toLocaleString()} DZD</td>
              </tr>
              <tr>
                <td>${t('result_table_item_tic')}</td>
                <td>${calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                <td>60%</td>
                <td>${calculationResult.tic.toLocaleString()} DZD</td>
              </tr>
              <tr class="total">
                <td>${t('result_table_item_total_taxes')}</td>
                <td>-</td>
                <td>-</td>
                <td>${calculationResult.totalDroitsTaxes.toLocaleString()} DZD</td>
              </tr>
              <tr>
                <td>${t('result_table_item_reduction')}</td>
                <td>${calculationResult.totalDroitsTaxes.toLocaleString()} DZD</td>
                <td>-${calculationResult.reduction}%</td>
                <td>-${calculationResult.montantReduction.toLocaleString()} DZD</td>
              </tr>
              <tr class="total">
                <td>${t('result_table_item_total_after_reduction')}</td>
                <td>-</td>
                <td>-</td>
                <td>${calculationResult.totalFinal.toLocaleString()} DZD</td>
              </tr>
              <tr class="total">
                <td>${t('result_total_cost')}</td>
                <td>-</td>
                <td>-</td>
                <td>${calculationResult.coutTotalVehicule.toLocaleString()} DZD</td>
              </tr>
            </tbody>
          </table>
          
          <h3 style="margin-top:24px; color:#1e40af;">💱 Taux de change utilisés:</h3>
          <table style="margin-bottom:24px; border:1px solid #ddd;">
            <tr style="background-color:#f0f9ff;">
              <td style="padding:8px; font-weight:bold; color:#0369a1;">Taux du marché:</td>
              <td style="padding:8px;">1 ${selectedCurrency} = ${userExchangeRate} DZD</td>
              <td style="padding:8px; font-size:12px; color:#666;">(Utilisé pour le prix utilisateur)</td>
            </tr>
            <tr style="background-color:#f0f9ff;">
              <td style="padding:8px; font-weight:bold; color:#0369a1;">Taux bancaire:</td>
              <td style="padding:8px;">1 ${selectedCurrency} = ${userBancaireRate} DZD</td>
              <td style="padding:12px; font-size:12px; color:#666;">(Utilisé pour les taxes)</td>
            </tr>
          </table>
          ${selectedCurrency === 'USD' ? `
          <p style="margin-top:16px; padding:12px; background-color:#f0f9ff; border:1px solid #0369a1; border-radius:8px; color:#0369a1; font-size:14px; text-align:center;">
            💱 <strong>Véhicule avec prix en USD</strong> - Taux USD utilisé pour les taxes
          </p>
          ` : ''}
          
          <h3 style="margin-top:24px; color:#1e40af;">📊 Répartition du coût total:</h3>
          <ul style="margin-bottom:24px;">
            <li>Prix utilisateur (marché parallèle): ${calculationResult.prixDZD.toLocaleString()} DZD</li>
            <li>Droits de douane: ${calculationResult.totalFinal.toLocaleString()} DZD</li>
            <li><strong>Total: ${calculationResult.coutTotalVehicule.toLocaleString()} DZD</strong></li>
          </ul>
          <p style="margin-top:24px; font-size:14px; color:#555;">
            <strong>${t('pdf_note_label')} :</strong> ${importNote}
          </p>
          <p style="margin-top:12px; font-size:14px; color:#555;">
            <strong>Information prix officiel :</strong> ${officialPriceNote}
          </p>
        </body>
        </html>
      `;
  };
 
  const generatePDF = async () => {
    if (!calculationResult) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const pdfContent = getPdfContent();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(pdfContent);
        printWindow.document.close();
      }
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(t('error_generating_pdf'));
    } finally {
      setIsGeneratingPDF(false);
    }
  };
 
  const downloadPDF = async () => {
    if (!calculationResult) return;
    
    setIsGeneratingPDF(true);
    
    try {
      const pdfContent = getPdfContent();
      
      // Créer un blob avec le contenu HTML
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Créer un lien de téléchargement
      const link = document.createElement('a');
      link.href = url;
      const vehicleInfo = formData.brand && formData.model ? `${formData.brand}-${formData.model}` : 'vehicule';
      const yearInfo = formData.year ? `-${formData.year}` : '';
      link.download = `devis-importation-${vehicleInfo}${yearInfo}-${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Nettoyer l'URL
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert(t('error_generating_pdf'));
    } finally {
      setIsGeneratingPDF(false);
    }
  };
 
  const resetForm = () => {
    addDebugLog('Form reset initiated');
    setIsSubmitted(false);
    setCalculationResult(null);
    setCsvData(null);
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedCurrency('EUR'); // Reset to default currency (will be auto-updated when car is selected)
    setDebugLog([]); // Clear debug log
    setFormData({
      brand: '',
      model: '',
      year: '',
      vehicleType: '',
      priceEur: '',
      engineType: '',
      cylindree: '',
      origin: '',
      destination: '',
      importType: 'classique'
    });
    // Reset exchange rates to defaults
    setExchangeRates({
      marcheNoir: 260,    // EUR -> DZD (marché noir)
      bancaire: 150,      // EUR -> DZD (bancaire)
      usdMarcheNoir: 240, // USD -> DZD (marché noir)
      usdBancaire: 135    // USD -> DZD (bancaire)
    });
    // Reset available currencies
    setAvailableCurrencies(['EUR']);
  };
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addDebugLog('Form submission started');
    setIsSubmitting(true);
    
    try {
      // Calculer les droits de douane
      const calculation = calculateCustomsDuty();
      
      if (!calculation) {
        addDebugLog('❌ Calculation failed');
        alert('Erreur lors du calcul. Veuillez vérifier les données saisies.');
        return;
      }
      
      // Préparer les données pour Google Sheets
      const submissionData = {
        timestamp: new Date().toLocaleString('fr-FR'),
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        vehicleType: formData.vehicleType,
        priceEur: formData.priceEur,
        engineType: formData.engineType,
        cylindree: formData.cylindree,
        origin: formData.origin,
        destination: formData.destination,
        importType: formData.importType,
        selectedCurrency: selectedCurrency,
        exchangeRateMarcheNoir: exchangeRates.marcheNoir,
        exchangeRateBancaire: exchangeRates.bancaire,
        exchangeRateUsdMarcheNoir: exchangeRates.usdMarcheNoir,
        exchangeRateUsdBancaire: exchangeRates.usdBancaire,
        csvCurrency: csvData?.Code_monnaie || 'EUR',
        calculatedTotal: calculation.coutTotalVehicule,
        customsDutyAmount: calculation.totalFinal,
        csvPriceUsed: calculation.csvPrice,
        csvDataFound: !!csvData
      };
 
      addDebugLog('Submitting data to API:', submissionData);
 
      // Envoyer vers MongoDB via l'API Next.js
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });
 
      if (response.ok) {
        addDebugLog('✅ Form submitted successfully to MongoDB');
      } else {
        addDebugLog('⚠️ API response not OK:', response.status);
      }
 
      setCalculationResult(calculation);
      setIsSubmitted(true);
      
    } catch (error) {
      addDebugLog('❌ Error submitting form:', error);
      console.error('Error submitting form:', error);
      alert(t('error_submitting_form'));
    } finally {
      setIsSubmitting(false);
    }
  };
 
  // Enhanced handleChange function
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    addDebugLog(`Form field changed: ${name} = "${value}"`);
    
    if (name === 'brand') {
      setSelectedBrand(value);
      setSelectedModel('');
      setFormData({ ...formData, brand: value, model: '', cylindree: '', engineType: '' });
      setCsvData(null);
      setSelectedCurrency('EUR'); // Reset to default currency (will be auto-updated when car is selected)
      setAvailableCurrencies(['EUR']); // Reset available currencies
      addDebugLog('Brand changed, clearing dependent fields');
    } else if (name === 'model') {
      setSelectedModel(value);
      setFormData({ ...formData, model: value, cylindree: '', engineType: '' });
      setCsvData(null);
      setSelectedCurrency('EUR'); // Reset to default currency (will be auto-updated when car is selected)
      setAvailableCurrencies(['EUR']); // Reset to default (will be auto-updated when CSV data is found)
      addDebugLog('Model changed, clearing dependent fields');
    } else if (name === 'engineType') {
      setFormData({ ...formData, engineType: value, cylindree: '' });
      setCsvData(null);
      setSelectedCurrency('EUR'); // Reset to default currency (will be auto-updated when car is selected)
      addDebugLog('Engine type changed, clearing cylindree');
    } else if (name === 'origin') {
      setFormData({ ...formData, origin: value });
      setCsvData(null);
      
      // Auto-detect currency based on origin selection
      const originToCurrencyMap: { [key: string]: string } = {
        'europe': 'EUR',
        'chine': 'USD',
        'dubai': 'USD',
        'usa': 'USD'
      };
      
      const detectedCurrency = originToCurrencyMap[value] || 'EUR';
      setSelectedCurrency(detectedCurrency);
      setAvailableCurrencies([detectedCurrency]);
      
      addDebugLog(`Origin changed to ${value}, currency auto-detected as ${detectedCurrency}`);
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // Check for CSV data when relevant fields change
      if (['year', 'vehicleType', 'cylindree'].includes(name)) {
        setCsvData(null);
        // Only reset currency to default if origin is not set
        // If origin is set, respect the origin-based currency
        if (!formData.origin) {
          setSelectedCurrency('EUR'); // Reset to default currency only if no origin is set
        }
        addDebugLog(`${name} changed, clearing CSV data`);
      }
    }
  };
 
  const handleExchangeRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value) || 0;
    addDebugLog(`Exchange rate changed: ${e.target.name} = ${newValue}`);
    setExchangeRates({
      ...exchangeRates,
      [e.target.name]: newValue
    });
  };

  // Handle currency change when user selects different currency (now auto-determined)
  const handleCurrencyChange = (currency: string) => {
    addDebugLog(`Currency auto-updated to ${currency} based on car origin`);
    setSelectedCurrency(currency);
    
    // Clear CSV data to force re-matching with new currency
    setCsvData(null);
    
    // Re-find CSV data with the new currency context
    if (formData.brand && formData.model && formData.engineType) {
      const newCsvData = findCsvData(
        formData.brand, 
        formData.model, 
        formData.engineType, 
        formData.cylindree, 
        formData.origin
      );
      if (newCsvData) {
        setCsvData(newCsvData);
        addDebugLog('CSV data updated for auto-detected currency:', currency);
      } else {
        addDebugLog('No CSV data found for auto-detected currency:', currency);
      }
    }
  };
 
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);
 
  // Options pour les marques de véhicules
  const vehicleBrands = [
    'Audi', 'BMW', 'Mercedes-Benz', 'Volkswagen', 'Peugeot', 'Renault', 'Citroën',
    'Toyota', 'Honda', 'Nissan', 'Ford', 'Hyundai', 'Kia', 'Mazda', 'Mitsubishi',
    'Subaru', 'Volvo', 'Skoda', 'SEAT', 'Fiat', 'Alfa Romeo', 'Jaguar', 'Land Rover',
    'Porsche', 'Tesla', 'Autre'
  ];
 
  // Fonction pour vérifier si le véhicule doit être considéré comme occasion
  const isVehicleUsed = (year: string) => {
    if (!year) return false;
    const vehicleYear = parseInt(year);
    return vehicleYear < (currentYear - 2);
  };
 
  // Enhanced year change handler
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    addDebugLog(`Year changed to: ${newYear}`);
    
    const newFormData = {
      ...formData,
      year: newYear
    };
    
    // Si le véhicule a plus de 3 ans, forcer le type à "occasion"
    if (isVehicleUsed(newYear)) {
      newFormData.vehicleType = 'occasion';
      addDebugLog('Vehicle forced to "occasion" due to age');
    }
    
    setFormData(newFormData);
    setCsvData(null);
    setSelectedCurrency('EUR'); // Reset to default currency (will be auto-updated when car is selected)
  };
 
  // Enhanced vehicle type change handler
  const handleVehicleTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVehicleType = e.target.value;
    addDebugLog(`Vehicle type changed to: ${newVehicleType}`);
    
    const newFormData = {
      ...formData,
      vehicleType: newVehicleType
    };
    
    // Si le type est "neuf", mettre automatiquement l'année courante
    if (newVehicleType === 'neuf') {
      newFormData.year = new Date().getFullYear().toString();
      addDebugLog('Year automatically set to current year for new vehicle');
    }
    
    setFormData(newFormData);
    setCsvData(null);
    setSelectedCurrency('EUR'); // Reset to default currency (will be auto-updated when car is selected)
  };
 
  // Function to check for CSV data availability
  const checkCsvData = () => {
    if (!formData.brand || !formData.model || !formData.engineType || !formData.year) {
      return null;
    }
    
    const result = findCsvData(
      formData.brand, 
      formData.model, 
      formData.engineType, 
      formData.cylindree, 
      formData.origin
    );
    
    return result;
  };
 
  // Function to get unique brands from CSV data (only with valid prices)
  const getUniqueBrands = () => {
    if (!newCarData || !Array.isArray(newCarData)) {
      addDebugLog('❌ Cannot get brands: newCarData is not valid');
      return [];
    }
    
    const brandsWithValidPrices = newCarData.filter((item: any) => {
      const neufPrice = parseFloat((item.Valeur_ref_FOB || '0').toString()) || 0;
      const moinsUnAnPrice = parseFloat((item.Valeur_FOB_1 || '0').toString()) || 0;
      const moinsDeuxAnsPrice = parseFloat((item.Valeur_FOB_2 || '0').toString()) || 0;
      const moinsTroisAnsPrice = parseFloat((item.Valeur_FOB_3 || '0').toString()) || 0;
      
      return neufPrice > 0 || moinsUnAnPrice > 0 || moinsDeuxAnsPrice > 0 || moinsTroisAnsPrice > 0;
    });
    
    const brands = [...new Set(brandsWithValidPrices.map((item: any) => item.Marque))]
      .filter(Boolean)
      .sort();
    
    addDebugLog(`Found ${brands.length} unique brands with valid prices`);
    return brands.map(brand => ({ value: brand, label: brand }));
  };
 
  // Function to get models for a specific brand from CSV data (only with valid prices)
  const getModelsForBrand = (brand: string) => {
    if (!brand) {
      return []; // Early return without logging for empty brand
    }
    
    if (!newCarData || !Array.isArray(newCarData)) {
      return [];
    }
    
    const modelsWithValidPrices = newCarData.filter((item: any) => {
      if (item.Marque !== brand) return false;
      
      const neufPrice = parseFloat((item.Valeur_ref_FOB || '0').toString()) || 0;
      const moinsUnAnPrice = parseFloat((item.Valeur_FOB_1 || '0').toString()) || 0;
      const moinsDeuxAnsPrice = parseFloat((item.Valeur_FOB_2 || '0').toString()) || 0;
      const moinsTroisAnsPrice = parseFloat((item.Valeur_FOB_3 || '0').toString()) || 0;
      
      return neufPrice > 0 || moinsUnAnPrice > 0 || moinsDeuxAnsPrice > 0 || moinsTroisAnsPrice > 0;
    });
    
    const models = [...new Set(modelsWithValidPrices.map((item: any) => item.modele))]
      .filter(Boolean)
      .sort();
    
    addDebugLog(`Found ${models.length} models for brand ${brand}`);
    return models.map(model => ({ value: model, label: model }));
  };
 
  // Function to get available engine types for a specific brand and model from CSV data
  const getAvailableEngineTypes = (brand: string, model: string) => {
    if (!brand || !model) {
      return []; // Early return without logging for empty parameters
    }
    
    if (!newCarData || !Array.isArray(newCarData)) {
      return [];
    }
    
    // Get all records for this brand/model combination with valid prices - Updated for new format
    const matches = newCarData.filter((item: any) => {
      if (item.Marque !== brand || item.modele !== model) return false;
      
      const neufPrice = parseFloat((item.Valeur_ref_FOB || '0').toString()) || 0;
      const moinsUnAnPrice = parseFloat((item.Valeur_FOB_1 || '0').toString()) || 0;
      const moinsDeuxAnsPrice = parseFloat((item.Valeur_FOB_2 || '0').toString()) || 0;
      const moinsTroisAnsPrice = parseFloat((item.Valeur_FOB_3 || '0').toString()) || 0;
      
      return neufPrice > 0 || moinsUnAnPrice > 0 || moinsDeuxAnsPrice > 0 || moinsTroisAnsPrice > 0;
    });
    
    // Extract unique engine types and map them to display values
    const engineTypes = [...new Set(matches.map((item: any) => item.Energie))].filter(Boolean);
    
    // Map CSV engine codes to display values
    const engineTypeMap: { [key: string]: { value: string; label: string } } = {
      'ESS': { value: 'essence', label: t('form_engineType_option_essence') },
      'DSL': { value: 'diesel', label: t('form_engineType_option_diesel') },
      'HYB': { value: 'hybride', label: t('form_engineType_option_hybride') },
      'ELC': { value: 'electrique', label: t('form_engineType_option_electrique') }
    };
    
    const availableEngineTypes = engineTypes
      .map(type => engineTypeMap[type])
      .filter(Boolean)
      .sort((a, b) => a.label.localeCompare(b.label));
    
    addDebugLog(`Found ${availableEngineTypes.length} engine types for ${brand} ${model}`);
    return availableEngineTypes;
  };

  // Function to get available currencies for a specific brand and model from CSV data
  const getAvailableCurrencies = (brand: string, model: string) => {
    if (!brand || !model) {
      addDebugLog(`getAvailableCurrencies: Missing brand (${brand}) or model (${model})`);
      return ['EUR']; // Default to EUR if no brand/model
    }
    
    // Enhanced data loading check
    if (!newCarData) {
      addDebugLog('getAvailableCurrencies: newCarData is null/undefined');
      return ['EUR'];
    }
    
    if (!Array.isArray(newCarData)) {
      addDebugLog('getAvailableCurrencies: newCarData is not an array:', typeof newCarData);
      return ['EUR'];
    }
    
    if (newCarData.length === 0) {
      addDebugLog('getAvailableCurrencies: newCarData is empty array');
      return ['EUR'];
    }
    
    addDebugLog(`getAvailableCurrencies: Searching for ${brand} ${model} in ${newCarData.length} records`);
    
    // Get all records for this brand/model combination with valid prices
    // Use case-insensitive matching to handle JSON data format
    const matches = newCarData.filter((item: any) => {
      const itemBrand = (item.Marque || '').toString().trim();
      const itemModel = (item.modele || '').toString().trim();
      const searchBrand = brand.toString().trim();
      const searchModel = model.toString().trim();
      
      // Case-insensitive comparison
      if (itemBrand.toLowerCase() !== searchBrand.toLowerCase() || 
          itemModel.toLowerCase() !== searchModel.toLowerCase()) {
        return false;
      }
      
      const neufPrice = parseFloat((item.Valeur_ref_FOB || '0').toString()) || 0;
      const moinsUnAnPrice = parseFloat((item.Valeur_FOB_1 || '0').toString()) || 0;
      const moinsDeuxAnsPrice = parseFloat((item.Valeur_FOB_2 || '0').toString()) || 0;
      const moinsTroisAnsPrice = parseFloat((item.Valeur_FOB_3 || '0').toString()) || 0;
      
      return neufPrice > 0 || moinsUnAnPrice > 0 || moinsDeuxAnsPrice > 0 || moinsTroisAnsPrice > 0;
    });
    
    // Extract unique currencies
    const currencies = [...new Set(matches.map((item: any) => item.Code_monnaie))].filter(Boolean);
    
    addDebugLog(`Found ${currencies.length} currencies for ${brand} ${model}:`, currencies);
    addDebugLog(`Matches found: ${matches.length} records for ${brand} ${model}`);
    
    // Debug: Log some sample matches
    if (matches.length > 0) {
      addDebugLog('Sample matches:', matches.slice(0, 3).map(item => ({
        Marque: item.Marque,
        modele: item.modele,
        Code_monnaie: item.Code_monnaie,
        Valeur_ref_FOB: item.Valeur_ref_FOB
      })));
    } else {
      // Debug: Show some records with similar names to help troubleshoot
      const similarBrands = newCarData.filter(item => 
        item.Marque && item.Marque.toLowerCase().includes(brand.toLowerCase())
      ).slice(0, 3);
      addDebugLog('Similar brands found:', similarBrands.map(item => item.Marque));
      
      const similarModels = newCarData.filter(item => 
        item.modele && item.modele.toLowerCase().includes(model.toLowerCase())
      ).slice(0, 3);
      addDebugLog('Similar models found:', similarModels.map(item => item.modele));
    }
    
    return currencies.length > 0 ? currencies : ['EUR'];
  };
 
  // Get current CSV data
  const currentCsvData = useMemo(() => {
    if (!formData.brand || !formData.model || !formData.engineType) {
      return null;
    }
    return checkCsvData();
  }, [formData.brand, formData.model, formData.engineType, formData.cylindree, formData.origin, formData.year]);
 
  // Get available cylindrée options (simpler approach - based only on brand and model)
  const availableCylindree = useMemo(() => {
    if (!formData.brand || !formData.model) {
      return [];
    }
    // Use the more comprehensive function that considers engine type and origin
    return getAvailableCylindree(formData.brand, formData.model, formData.engineType, formData.origin);
  }, [formData.brand, formData.model, formData.engineType, formData.origin]);

  // Auto-select first available cylindrée when options change
  useEffect(() => {
    if (availableCylindree.length > 0) {
      addDebugLog(`Found ${availableCylindree.length} cylindrée options:`, availableCylindree);
      if (!formData.cylindree) {
        const firstCylindree = availableCylindree[0];
        setFormData(prev => ({ ...prev, cylindree: firstCylindree }));
        addDebugLog(`Auto-selected first cylindrée: ${firstCylindree}`);
      }
    } else {
      addDebugLog('No cylindrée options found for current selection');
    }
  }, [availableCylindree, formData.cylindree]);

  // Test function to debug CSV data matching with real examples
  const testCsvMatching = () => {
    addDebugLog('=== TESTING CSV MATCHING WITH REAL DATA ===');
    
    if (!newCarData || !Array.isArray(newCarData) || newCarData.length === 0) {
      addDebugLog('❌ Cannot test: newCarData is not available');
      return;
    }
    
    // Get first few records with valid prices for testing - Updated for new format
    const testRecords = newCarData
      .filter(item => parseFloat((item.Valeur_ref_FOB || '0').toString()) > 0)
      .slice(0, 3);
    
    addDebugLog(`Testing with ${testRecords.length} sample records:`);
    
    testRecords.forEach((record, index) => {
      addDebugLog(`\n--- Test ${index + 1} ---`);
      addDebugLog('Test record:', {
        Marque: record.Marque,
        modele: record.modele,
        Energie: record.Energie,
        Cylindree_cm3: record.Cylindree_cm3,
        'Pays d\'origine': record['Pays d\'origine'],
        Valeur_ref_FOB: record.Valeur_ref_FOB
      });
      
      // Map CSV values back to form values for testing
      const engineTypeMap: { [key: string]: string } = { 'ESS': 'essence', 'DSL': 'diesel', 'HYB': 'hybride', 'ELC': 'electrique' };
      const originMap: { [key: string]: string } = { 'Europe': 'europe', 'Autres pays': 'chine' };
      
      const testBrand: string = String(record.Marque || '');
      const testModel: string = String(record.modele || '');
      const testEngineType: string = engineTypeMap[record.Energie as string] || 'essence';
      const testCylindree: string = String(record.Cylindree_cm3 || '');
      const testOrigin: string = originMap[record['Pays d\'origine'] as string] || 'europe';
      
      addDebugLog('Mapped test values:', {
        testBrand, testModel, testEngineType, testCylindree, testOrigin
      });
      
      // Test the matching function
      const testResult = findCsvData(testBrand, testModel, testEngineType, testCylindree, testOrigin);
      
      if (testResult) {
        addDebugLog('✅ Match found!');
        const testPrice = getCsvPrice(testResult, '2025', 'neuf');
        addDebugLog('Test price extracted:', testPrice);
      } else {
        addDebugLog('❌ No match found');
      }
    });
    
    addDebugLog('=== END TEST ===');
  };
 
 
  // Préparer les options pour react-select
  const brandOptions = useMemo(() => getUniqueBrands(), []);
  const modelOptions = useMemo(() => getModelsForBrand(selectedBrand), [selectedBrand]);
  const availableEngineTypes = useMemo(() => getAvailableEngineTypes(formData.brand, formData.model), [formData.brand, formData.model]);
 
  if (isSubmitted && calculationResult) {
    return (
      <section id="devis" className="min-h-screen bg-gradient-to-br from-gray-50 via-red-100 to-gray-50 section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Results Header with Modern Design */}
            <div className="text-center mb-12">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gray-500 rounded-full blur-2xl opacity-20 scale-110"></div>
                <div className="relative w-24 h-24 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-3xl md:text-3xl font-bold bg-gradient-to-r from-gray-500 to-red-700 bg-clip-text text-transparent mb-4">
                {t('result_calculation_title')}
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
               {t('result_calculation_subtitle')}
             </p>
           </div>

           {/* Modern Action Buttons */}
           <div className="flex flex-wrap gap-4 justify-center items-center mb-12">
             <button
               onClick={generatePDF}
               disabled={isGeneratingPDF}
               className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                 isGeneratingPDF 
                   ? 'bg-gray-400 cursor-not-allowed' 
                   : 'bg-gradient-to-r from-gray-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl'
               }`}
             >
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
               <div className="relative flex items-center space-x-3">
                 {isGeneratingPDF ? (
                   <>
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     <span>{t('result_button_generating_pdf')}</span>
                   </>
                 ) : (
                   <>
                     <Download className="w-5 h-5" />
                     <span>{t('result_button_open_pdf')}</span>
                   </>
                 )}
               </div>
             </button>
             
             <button
               onClick={downloadPDF}
               disabled={isGeneratingPDF}
               className={`group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                 isGeneratingPDF 
                   ? 'bg-gray-400 cursor-not-allowed' 
                   : 'bg-gradient-to-r from-gray-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl'
               }`}
             >
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
               <div className="relative flex items-center space-x-3">
                 {isGeneratingPDF ? (
                   <>
                     <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     <span>{t('result_button_generating_pdf')}</span>
                   </>
                 ) : (
                   <>
                     <FileDown className="w-5 h-5" />
                     <span>{t('button_download_pdf')}</span>
                   </>
                 )}
               </div>
             </button>
             
             <button
               onClick={() => window.print()}
               className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-gray-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
             >
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
               <div className="relative flex items-center space-x-3">
                 <PrintIcon className="w-5 h-5" />
                 <span>{t('result_button_print')}</span>
               </div>
             </button>
             
             <button
               onClick={resetForm}
               className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-gray-500 to-red-600 hover:from-red-600 hover:to-red-900 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
             >
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
               <div className="relative flex items-center space-x-3">
                 <Calculator className="w-5 h-5" />
                 <span>{t('result_button_new_calc')}</span>
               </div>
             </button>
           </div>

           {/* Modern Results Container */}
           <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
             {/* Exchange Rates Notice */}
             <div className="bg-gradient-to-r from-gray-50 to-red-100 border border-gray-200 rounded-2xl p-6 mb-8">
               <div className="flex items-center space-x-3 mb-4">
                 <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                   <TrendingUp className="w-4 h-4 text-white" />
                 </div>
                 <h4 className="font-bold text-red-600">{t('result_rates_title')}</h4>
               </div>
               <div className="grid md:grid-cols-2 gap-4 text-sm">
                 <div className="bg-white/60 rounded-lg p-3">
                   <p className="font-semibold text-red-600">{t('result_rates_price_note')}</p>
                   <p className="text-2xl font-bold text-red-700">1 {selectedCurrency} = {userExchangeRate} DZD</p>
                 </div>
                 <div className="bg-white/60 rounded-lg p-3">
                   <p className="font-semibold text-red-600">{t('result_rates_tax_note')}</p>
                   <p className="text-2xl font-bold text-red-700">
                     {selectedCurrency === 'USD' 
                       ? `1 USD = ${exchangeRates.usdBancaire} DZD` 
                       : `1 EUR = ${exchangeRates.bancaire} DZD`
                     }
                   </p>
                 </div>
               </div>
               {selectedCurrency === 'USD' && (
                 <div className="mt-4 text-center">
                   <p className="text-sm text-red-600 bg-white/40 rounded-lg p-2">
                     💱 Véhicule avec prix en USD - Taux USD utilisé pour les taxes
                   </p>
                 </div>
               )}
             </div>

             {/* Price Information */}
             <div className="mb-8">
               <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center space-x-3">
                 <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                   <Calculator className="w-4 h-4 text-white" />
                 </div>
                 <span>Informations sur les prix</span>
               </h3>
               
               <div className="grid md:grid-cols-2 gap-6 mb-8">
                 <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                       <Euro className="w-4 h-4 text-white" />
                     </div>
                     <h4 className="font-semibold text-red-700">Prix utilisateur (marché parallèle)</h4>
                   </div>
                     <p className="text-3xl font-bold text-red-600 mb-2">
                       {calculationResult.priceEur.toLocaleString()} {selectedCurrency}
                     </p>
                   <p className="text-xl text-red-500">
                     {calculationResult.prixDZD.toLocaleString()} DZD
                   </p>
                 </div>
                 
                 <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                       <Shield className="w-4 h-4 text-white" />
                     </div>
                     <h4 className="font-semibold text-red-700">Prix officiel (base pour taxes)</h4>
                   </div>
                   <p className="text-3xl font-bold text-red-600 mb-2">
                     {calculationResult.csvPrice.toLocaleString()} {csvData?.Code_monnaie || 'EUR'}
                   </p>
                   <p className="text-xl text-red-500">
                     {calculationResult.csvPriceDZD.toLocaleString()} DZD
                   </p>
                   {calculationResult.csvPrice > 0 && (
                     <p className="text-sm text-red-600 mt-2">
                       💱 Taux: 1 {selectedCurrency} = {selectedCurrency === 'USD' ? exchangeRates.usdBancaire : exchangeRates.bancaire} DZD
                     </p>
                   )}
                   {calculationResult.csvPrice === 0 && (
                     <p className="text-sm text-red-600 mt-2">
                       ⚠️ Prix officiel non trouvé - calcul basé sur prix utilisateur
                     </p>
                   )}
                 </div>
               </div>
             </div>

             {/* Results Table */}
             <div className="mb-8">
               <h3 className="text-2xl font-bold text-gray-700 mb-6 flex items-center space-x-3">
                 <div className="w-8 h-8 bg-gray-500 rounded-lg flex items-center justify-center">
                   <Calculator className="w-4 h-4 text-white" />
                 </div>
                 <span>{t('result_costs_title')}</span>
               </h3>
               
               <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg">
                 <table className="w-full">
                   <thead>
                     <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                       <th className="px-6 py-4 text-left font-semibold text-gray-700">{t('result_table_header_element')}</th>
                       <th className="px-6 py-4 text-left font-semibold text-gray-700">{t('result_table_header_base')}</th>
                       <th className="px-6 py-4 text-left font-semibold text-gray-700">{t('result_table_header_rate')}</th>
                       <th className="px-6 py-4 text-right font-semibold text-gray-700">{t('result_table_header_amount')}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     <tr className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4 font-semibold text-gray-700">{t('result_table_item_price')}</td>
                       <td className="px-6 py-4 text-gray-600">{calculationResult.priceEur.toLocaleString()} EUR</td>
                       <td className="px-6 py-4 text-gray-600">{t('exchange_rate_marcheNoir_label')} ({exchangeRates.marcheNoir})</td>
                       <td className="px-6 py-4 text-right font-bold text-gray-700">{calculationResult.prixDZD.toLocaleString()} DZD</td>
                     </tr>
                     <tr className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4 text-gray-700">{t('result_table_item_customs')}</td>
                       <td className="px-6 py-4 text-gray-600">{calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                       <td className="px-6 py-4 text-gray-600">{calculationResult.droitDouane}%</td>
                       <td className="px-6 py-4 text-right font-semibold text-gray-700">{calculationResult.montantDroitDouane.toLocaleString()} DZD</td>
                     </tr>
                     <tr className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4 text-gray-700">{t('result_table_item_prct')}</td>
                       <td className="px-6 py-4 text-gray-600">{calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                       <td className="px-6 py-4 text-gray-600">2%</td>
                       <td className="px-6 py-4 text-right font-semibold text-gray-700">{calculationResult.prct.toLocaleString()} DZD</td>
                     </tr>
                     <tr className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4 text-gray-700">{t('result_table_item_tcs')}</td>
                       <td className="px-6 py-4 text-gray-600">{calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                       <td className="px-6 py-4 text-gray-600">2%</td>
                       <td className="px-6 py-4 text-right font-semibold text-gray-700">{calculationResult.tcs.toLocaleString()} DZD</td>
                     </tr>
                     <tr className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4 text-gray-700">{t('result_table_item_tva')}</td>
                       <td className="px-6 py-4 text-gray-600">{(calculationResult.prixBaseTaxes + calculationResult.montantDroitDouane + calculationResult.prct + calculationResult.tcs).toLocaleString()} DZD</td>
                       <td className="px-6 py-4 text-gray-600">19%</td>
                       <td className="px-6 py-4 text-right font-semibold text-gray-700">{calculationResult.tva.toLocaleString()} DZD</td>
                     </tr>
                     {calculationResult.tic > 0 && (
                       <tr className="hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-4 text-gray-700">{t('result_table_item_tic')}</td>
                         <td className="px-6 py-4 text-gray-600">{calculationResult.prixBaseTaxes.toLocaleString()} DZD</td>
                         <td className="px-6 py-4 text-gray-600">60%</td>
                         <td className="px-6 py-4 text-right font-semibold text-gray-700">{calculationResult.tic.toLocaleString()} DZD</td>
                       </tr>
                     )}
                     <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300">
                       <td className="px-6 py-4 font-bold text-gray-700">{t('result_table_item_total_taxes')}</td>
                       <td className="px-6 py-4 text-gray-600">-</td>
                       <td className="px-6 py-4 text-gray-600">-</td>
                       <td className="px-6 py-4 text-right font-bold text-gray-700 text-lg">{calculationResult.totalDroitsTaxes.toLocaleString()} DZD</td>
                     </tr>
                     {calculationResult.reduction > 0 && (
                       <>
                         <tr className="hover:bg-gray-50 transition-colors bg-red-25">
                           <td className="px-6 py-4 text-red-600">{t('result_table_item_reduction')}</td>
                           <td className="px-6 py-4 text-gray-700">{calculationResult.totalDroitsTaxes.toLocaleString()} DZD</td>
                           <td className="px-6 py-4 text-gray-700">-{calculationResult.reduction}%</td>
                           <td className="px-6 py-4 text-right font-semibold text-red-600">-{calculationResult.montantReduction.toLocaleString()} DZD</td>
                         </tr>
                         <tr className="bg-gradient-to-r from-gray-100 to-gray-50 border-t-2 border-gray-300">
                           <td className="px-6 py-4 font-bold text-red-700">{t('result_table_item_total_after_reduction')}</td>
                           <td className="px-6 py-4 text-gray-700">-</td>
                           <td className="px-6 py-4 text-gray-700">-</td>
                           <td className="px-6 py-4 text-right font-bold text-red-700 text-lg">{calculationResult.totalFinal.toLocaleString()} DZD</td>
                         </tr>
                       </>
                     )}
                   </tbody>
                 </table>
               </div>
             </div>

             {/* Total Cost Highlight */}
             <div className="relative overflow-hidden rounded-3xl p-8 mb-8">
               <div className="absolute inset-0 bg-gradient-to-r from-gray-500 via-red-600 to-gray-500"></div>
               <div className="absolute inset-0 bg-black/10"></div>
               <div className="relative text-center text-white">
                 <div className="flex justify-center mb-4">
                   <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                     <Sparkles className="w-6 h-6" />
                   </div>
                 </div>
                 <p className="text-xl font-semibold mb-2 opacity-90">
                   Coût total du véhicule
                 </p>
                 <p className="text-4xl md:text-5xl font-bold mb-4">
                   {calculationResult.coutTotalVehicule.toLocaleString()} DZD
                 </p>
                 <p className="text-xl opacity-90 mb-4">
                   Équivalent {(calculationResult.coutTotalVehicule / exchangeRates.marcheNoir).toLocaleString()} EUR
                 </p>
                 
                 {/* Breakdown */}
                 <div className="bg-white/10 rounded-2xl p-4 mt-6">
                   <p className="text-sm opacity-90 mb-2">Répartition :</p>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                       <p className="opacity-75">Prix utilisateur :</p>
                       <p className="font-semibold">{calculationResult.prixDZD.toLocaleString()} DZD</p>
                     </div>
                     <div>
                       <p className="opacity-75">Droits de douane :</p>
                       <p className="font-semibold">{calculationResult.totalFinal.toLocaleString()} DZD</p>
                     </div>
                   </div>
                 </div>
               </div>
             </div>

             {/* Additional Information */}
             <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-gradient-to-r from-gray-50 to-red-100 border border-gray-200 rounded-2xl p-6">
                 <div className="flex items-center space-x-3 mb-3">
                   <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                     <Clock className="w-4 h-4 text-white" />
                   </div>
                   <h4 className="font-semibold text-red-700">Notification</h4>
                 </div>
                 <p className="text-red-600">
                   {t('result_email_notification')}
                 </p>
               </div>

               <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
                 <div className="flex items-center space-x-3 mb-3">
                   <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                     <Shield className="w-4 h-4 text-white" />
                   </div>
                   <h4 className="font-semibold text-red-600">{t('result_tip_title')}</h4>
                 </div>
                 <p className="text-gray-700 text-sm">
                   {t('result_tip_content')} <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">Ctrl+P</kbd>
                 </p>
               </div>
             </div>

             {/* Important Notes */}
             <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6">
               <h4 className="font-bold text-red-600 mb-4 flex items-center space-x-2">
                       <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                   <span className="text-white text-xs">!</span>
                 </div>
                 <span>{t('result_notes_title')}</span>
               </h4>
               <ul className="text-sm text-gray-700 space-y-2">
                 <li className="flex items-start space-x-2">
                   <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                   <span>{t('result_note_1')}</span>
                 </li>
                 <li className="flex items-start space-x-2">
                   <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                   <span>{t('result_note_2')}</span>
                 </li>
                 <li className="flex items-start space-x-2">
                   <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                   <span>{t('result_note_3')}</span>
                 </li>
                 <li className="flex items-start space-x-2">
                   <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                   <span>{t('result_note_4')}</span>
                 </li>
               </ul>
             </div>

             {/* Official Data Information */}
             {csvData && (
               <div className="mt-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
                 <h4 className="font-bold text-red-600 mb-4 flex items-center space-x-2">
                   <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                     <span className="text-white text-xs">✓</span>
                   </div>
                   <span>Données officielles utilisées</span>
                 </h4>
                 <div className="grid md:grid-cols-2 gap-4 text-sm">
                   <div>
                     <p className="text-red-600"><strong>Marque:</strong> {csvData.Marque}</p>
                     <p className="text-red-600"><strong>Modèle:</strong> {csvData.modele}</p>
                     <p className="text-red-600"><strong>Énergie:</strong> {csvData.Energie}</p>
                   </div>
                   <div>
                     <p className="text-red-600"><strong>Cylindrée:</strong> {csvData.Cylindree_cm3} cm³</p>
                     <p className="text-red-600"><strong>Origine:</strong> {csvData['Pays d\'origine']}</p>
                     <p className="text-red-600"><strong>Prix utilisé:</strong> {calculationResult.csvPrice.toLocaleString()} {csvData.Code_monnaie}</p>
                     <p className="text-red-600"><strong>Taux utilisé:</strong> 1 {csvData.Code_monnaie} = {csvData.Code_monnaie === 'USD' ? exchangeRates.usdBancaire : exchangeRates.bancaire} DZD</p>
                   </div>
                 </div>
               </div>
             )}

             {!csvData && (
               <div className="mt-6 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
                 <h4 className="font-bold text-red-600 mb-4 flex items-center space-x-2">
                   <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                     <span className="text-white text-xs">!</span>
                   </div>
                   <span>Données officielles non trouvées</span>
                 </h4>
                 <p className="text-red-600 text-sm">
                   Aucune correspondance trouvée dans les données officielles. 
                   Le calcul des droits de douane a été effectué sur la base du prix utilisateur avec le taux de change bancaire.
                 </p>
                 <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                   <p className="text-xs text-red-700">
                     💡 <strong>Note:</strong> Vous pouvez entrer votre prix dans n'importe quelle devise. 
                     Le système utilisera le taux EUR par défaut pour les calculs.
                   </p>
                 </div>
               </div>
             )}
           </div>
         </div>
       </div>
     </section>
   );
 }

 return (
   <section id="devis" className="min-h-screen bg-gradient-to-br from-gray-50 via-red-100 to-gray-50 section-padding scroll-mt-32">
     <div className="container-custom">
       {/* Modern Section Header */}
       <div className="text-center space-y-4 lg:space-y-6 mb-12 lg:mb-20">
         <div className="relative inline-block">
           <div className="absolute inset-0 bg-gray-500 rounded-full blur-3xl opacity-20 scale-110"></div>
           <div className="relative">
             <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold bg-gradient-to-r from-gray-500 via-red-600 to-red-700 bg-clip-text text-transparent mb-6">
               {t('title')}
             </h2>
             <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-gray-500 to-red-600 mx-auto rounded-full"></div>
           </div>
         </div>
         <p className="text-lg sm:text-xl lg:text-1xl text-gray-600 max-w-2xl lg:max-w-4xl mx-auto leading-relaxed px-4">
           {t('subtitle')}
         </p>
       </div>

       {isSubmitted ? (
         <div className="max-w-2xl mx-auto">
           <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20 text-center">
             <div className="relative inline-block mb-8">
               <div className="absolute inset-0 bg-gray-500 rounded-full blur-2xl opacity-30 scale-110"></div>
               <div className="relative w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center mx-auto shadow-xl">
                 <CheckCircle className="w-10 h-10 text-white" />
               </div>
             </div>
             <h3 className="text-3xl font-bold bg-gradient-to-r from-gray-500 to-red-600 bg-clip-text text-transparent mb-4">
               {t('submitted_title')}
             </h3>
             <p className="text-gray-600 mb-8 text-lg">
               {t('submitted_subtitle')}
             </p>
             <button
               onClick={() => {
                 setIsSubmitted(false);
                 setCalculationResult(null);
                 resetForm();
               }}
               className="group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold bg-gradient-to-r from-gray-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
             >
               <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
               <div className="relative flex items-center space-x-2">
                 <Calculator className="w-5 h-5" />
                 <span>{t('result_reset')}</span>
               </div>
             </button>
           </div>
         </div>
       ) : (
         <div className="max-w-4xl lg:max-w-5xl mx-auto">
           {/* Modern Form Container */}
           <div className="bg-white/80 backdrop-blur-sm rounded-2xl lg:rounded-3xl shadow-2xl border border-white/20 overflow-hidden mx-4 sm:mx-0">
             <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8 space-y-8 lg:space-y-10">
               
               {/* Type d'importation et Informations du véhicule */}
               <div className="space-y-4 lg:space-y-6">
                 <div className="flex items-center space-x-3 lg:space-x-4 pb-3 lg:pb-4 border-b border-gray-200">
                   <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-500 to-red-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                     <span className="text-white font-bold text-sm lg:text-base">1</span>
                   </div>
                   <h3 className="text-lg lg:text-xl font-bold text-gray-700">
                     {t('section_import_type_vehicle')}
                   </h3>
                 </div>
                 
                 {/* Type d'importation */}
                 <div className="space-y-4">
                   <p className="text-sm text-gray-600 font-medium">Sélectionnez votre type d'importation :</p>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <label className="flex items-center space-x-3 p-4 bg-white/70 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                     <input
                       type="radio"
                       name="importType"
                       value="classique"
                       checked={formData.importType === 'classique'}
                       onChange={handleChange}
                       className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                     />
                     <span className="text-sm font-medium text-gray-700">Importation Classique</span>
                   </label>
                   <label className="flex items-center space-x-3 p-4 bg-white/70 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                     <input
                       type="radio"
                       name="importType"
                       value="ccr"
                       checked={formData.importType === 'ccr'}
                       onChange={handleChange}
                       className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                     />
                     <span className="text-sm font-medium text-gray-700">CCR (Changement de Résidence)</span>
                   </label>
                   <label className="flex items-center space-x-3 p-4 bg-white/70 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                     <input
                       type="radio"
                       name="importType"
                       value="moujahidine"
                       checked={formData.importType === 'moujahidine'}
                       onChange={handleChange}
                       className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                     />
                     <span className="text-sm font-medium text-gray-700">Moujahidine</span>
                   </label>
                 </div>
               </div>
             </div>

             {/* Vehicle Basic Information Section */}
             <div className="space-y-4 lg:space-y-6">
               <div className="flex items-center space-x-3 lg:space-x-4 pb-3 lg:pb-4 border-b border-gray-200">
                 <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-500 to-red-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                   <span className="text-white font-bold text-sm lg:text-base">2</span>
                 </div>
                 <h3 className="text-lg lg:text-xl font-bold text-gray-700">
                   {t('section_basic_info')}
                 </h3>
               </div>

               {/* Type de véhicule */}
               <div className="space-y-4">
                 <p className="text-sm text-gray-600 font-medium">Sélectionnez le type de véhicule :</p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <label className="flex items-center space-x-3 p-4 bg-white/70 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                     <input
                       type="radio"
                       name="vehicleType"
                       value="neuf"
                       checked={formData.vehicleType === 'neuf'}
                       onChange={handleVehicleTypeChange}
                       disabled={isVehicleUsed(formData.year)}
                       className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                     />
                     <span className="text-sm font-medium text-gray-700">{t('form_vehicleType_option_new')}</span>
                   </label>
                   <label className="flex items-center space-x-3 p-4 bg-white/70 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                     <input
                       type="radio"
                       name="vehicleType"
                       value="occasion"
                       checked={formData.vehicleType === 'occasion'}
                       onChange={handleVehicleTypeChange}
                       className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                     />
                     <span className="text-sm font-medium text-gray-700">{t('form_vehicleType_option_used')}</span>
                   </label>
                 </div>
                 
                 {/* Prix officiel Information - For Customs Calculation Only */}
                 {currentCsvData && formData.vehicleType && formData.year && (
                   <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4">
                     <div className="flex items-center space-x-3 mb-2">
                       <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                         <span className="text-white text-xs">⚖️</span>
                       </div>
                       <h4 className="font-semibold text-red-700 text-sm">Base de calcul des droits de douane</h4>
                     </div>
                     <p className="text-sm text-red-600 mb-2">
                       {getPriceLabel(formData.vehicleType, formData.year)}: {getCsvPrice(currentCsvData, formData.year, formData.vehicleType).toLocaleString()} {currentCsvData.Code_monnaie}
                     </p>
                     <p className="text-xs text-gray-700">
                       Ce prix officiel sera utilisé uniquement pour calculer les droits de douane. Vous devez saisir votre prix d'achat ci-dessous.
                     </p>
                   </div>
                 )}
                 {isVehicleUsed(formData.year) && (
                   <p className="text-sm text-red-600 bg-gray-50 border border-gray-200 rounded-lg p-2 mt-2">
                     <span className="font-medium">Automatique:</span> Véhicule classé comme "occasion" car il a plus de 3 ans.
                   </p>
                 )}
                 {formData.vehicleType === 'occasion' && (
                   <div className="text-sm text-red-600 bg-gray-50 border border-gray-200 rounded-lg p-2 mt-2">
                     <span className="font-medium">Info:</span> Véhicule d'occasion bénéficie de réductions selon la motorisation :
                     <ul className="mt-1 text-xs list-disc list-inside">
                       <li>Électrique : 80% de réduction</li>
                       <li>Essence/Hybride ≤1800cm³ : 50% de réduction</li>
                       <li>Essence/Hybride &gt;1800cm³ : 20% de réduction</li>
                     </ul>
                   </div>
                 )}
                 {formData.vehicleType === 'neuf' && (
                   <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg p-2 mt-2">
                     <span className="font-medium">Info:</span> Véhicule neuf soumis à la taxation complète (pas de réduction).
                   </div>
                 )}
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
                 <div className="space-y-2">
                   <label htmlFor="brand" className="block text-sm font-semibold text-gray-700">{t('form_brand')}</label>
                   <div className="p-4 bg-white/70 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                     <Select
                       inputId="brand"
                       name="brand"
                       options={brandOptions}
                       value={brandOptions.find(option => option.value === selectedBrand) || null}
                       onChange={option => {
                         const newBrand = option ? option.value : '';
                         
                         // Update all related states atomically
                         setSelectedBrand(newBrand);
                         setSelectedModel('');
                         setSelectedCurrency('EUR'); // Reset to default currency (will be auto-updated when car is selected)
                         setAvailableCurrencies(['EUR']); // Reset available currencies
                         setCsvData(null);
                         
                         // Update form data with proper state synchronization
                         setFormData(prevFormData => ({
                           ...prevFormData,
                           brand: newBrand,
                           model: '',
                           cylindree: '',
                           engineType: ''
                         }));
                         
                         addDebugLog(`Brand selected: ${newBrand}`);
                         addDebugLog(`Form brand set to: ${newBrand}`);
                         addDebugLog(`Available currencies reset to: ['EUR']`);
                       }}
                       placeholder={t('form_select_placeholder')}
                       isClearable
                       classNamePrefix="react-select"
                       styles={{ 
                         menu: base => ({ ...base, zIndex: 100 }),
                         control: (base) => ({
                           ...base,
                           border: 'none',
                           boxShadow: 'none',
                           backgroundColor: 'transparent',
                           minHeight: '24px',
                           height: '24px'
                         }),
                         valueContainer: (base) => ({
                           ...base,
                           padding: '0',
                           height: '24px'
                         }),
                         input: (base) => ({
                           ...base,
                           margin: '0',
                           padding: '0',
                           height: '24px'
                         }),
                         placeholder: (base) => ({
                           ...base,
                           margin: '0',
                           color: '#6b7280',
                           fontSize: '14px'
                         }),
                         singleValue: (base) => ({
                           ...base,
                           margin: '0',
                           fontSize: '14px'
                         }),
                         indicatorsContainer: (base) => ({
                           ...base,
                           height: '24px'
                         }),
                         indicatorSeparator: (base) => ({
                           ...base,
                           display: 'none'
                         }),
                         dropdownIndicator: (base) => ({
                           ...base,
                           padding: '0',
                           height: '24px',
                           width: '20px'
                         })
                       }}
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label htmlFor="model" className="block text-sm font-semibold text-gray-700">{t('form_model')}</label>
                   <div className="p-4 bg-white/70 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                     <Select
                       inputId="model"
                       name="model"
                       options={modelOptions}
                       value={modelOptions.find(option => option.value === selectedModel) || null}
                       onChange={option => {
                         const newModel = option ? option.value : '';
                         
                         // Update all related states atomically
                         setSelectedModel(newModel);
                         setCsvData(null);
                         
                         // Update form data with proper state synchronization
                         setFormData(prevFormData => ({
                           ...prevFormData,
                           model: newModel,
                           cylindree: '',
                           engineType: ''
                         }));
                         
                         // Update available currencies for the new model
                         if (formData.brand && newModel) {
                           addDebugLog(`Getting currencies for brand: "${formData.brand}" and model: "${newModel}"`);
                           
                           // Use setTimeout to ensure formData is updated before getting currencies
                           setTimeout(() => {
                             // Use the current formData.brand and the new model
                             const currencies = getAvailableCurrencies(formData.brand, newModel);
                             setAvailableCurrencies(currencies);
                             
                             // Set selected currency to first available currency
                             if (currencies.length > 0) {
                               setSelectedCurrency(currencies[0]);
                               addDebugLog(`Currency set to first available: ${currencies[0]}`);
                             }
                             addDebugLog(`Model changed, updating currencies:`, currencies);
                           }, 50); // Slightly longer delay to ensure state is updated
                         } else {
                           setAvailableCurrencies(['EUR']);
                           setSelectedCurrency('EUR');
                         }
                         
                         addDebugLog(`Model selected: ${newModel}`);
                         addDebugLog(`Form model set to: ${newModel}`);
                       }}
                       placeholder={t('form_select_placeholder')}
                       isClearable
                       isDisabled={!selectedBrand}
                       classNamePrefix="react-select"
                       styles={{ 
                         menu: base => ({ ...base, zIndex: 100 }),
                         control: (base) => ({
                           ...base,
                           border: 'none',
                           boxShadow: 'none',
                           backgroundColor: 'transparent',
                           minHeight: '24px',
                           height: '24px'
                         }),
                         valueContainer: (base) => ({
                           ...base,
                           padding: '0',
                           height: '24px'
                         }),
                         input: (base) => ({
                           ...base,
                           margin: '0',
                           padding: '0',
                           height: '24px'
                         }),
                         placeholder: (base) => ({
                           ...base,
                           margin: '0',
                           color: '#6b7280',
                           fontSize: '14px'
                         }),
                         singleValue: (base) => ({
                           ...base,
                           margin: '0',
                           fontSize: '14px'
                         }),
                         indicatorsContainer: (base) => ({
                           ...base,
                           height: '24px'
                         }),
                         indicatorSeparator: (base) => ({
                           ...base,
                           display: 'none'
                         }),
                         dropdownIndicator: (base) => ({
                           ...base,
                           padding: '0',
                           height: '24px',
                           width: '20px'
                         })
                       }}
                     />
                   </div>
                 </div>
                 <div className="space-y-2">
                   <label htmlFor="year" className={`block text-sm font-semibold ${formData.vehicleType === 'neuf' ? 'text-gray-400' : 'text-gray-700'}`}>
                     {t('form_year')}
                     {formData.vehicleType === 'neuf' && <span className="text-xs text-gray-400 ml-2">(automatiquement défini pour un véhicule neuf)</span>}
                   </label>
                   <div className="p-4 bg-white/70 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                     <select 
                       id="year" 
                       name="year" 
                       value={formData.vehicleType === 'neuf' ? new Date().getFullYear().toString() : formData.year} 
                       onChange={handleYearChange} 
                       disabled={formData.vehicleType === 'neuf'}
                       className={`w-full bg-transparent border-none outline-none text-sm lg:text-base ${
                         formData.vehicleType === 'neuf' 
                           ? 'text-gray-500 cursor-not-allowed' 
                           : 'text-gray-700'
                       }`}
                       required
                     >
                       <option value="">{t('form_select_placeholder')}</option>
                       {years.map(year => (
                         <option key={year} value={year}>{year}</option>
                       ))}
                     </select>
                   </div>
                 </div>
                 
                 {/* Country of Origin - moved here to determine currency before price input */}
                 <div className="space-y-2">
                   <label htmlFor="origin" className="block text-sm font-semibold text-gray-700">{t('form_origin')}</label>
                   <div className="relative">
                     <select
                       id="origin"
                       name="origin"
                       value={formData.origin}
                       onChange={handleChange}
                       className="w-full px-3 lg:px-4 py-2.5 lg:py-3 pl-10 lg:pl-12 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base"
                       required
                     >
                       <option value="">--</option>
                       <option value="europe">Europe</option>
                       <option value="chine">Chine</option>
                       <option value="dubai">Dubai</option>
                       <option value="usa">USA</option>
                     </select>
                     <MapPin className="absolute left-3 lg:left-4 top-3.5 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                   </div>
                 </div>
                 
                 <div className="space-y-2">
                   <div className="space-y-2">
                     <label htmlFor="vehiclePrice" className="block text-sm font-semibold text-gray-700">
                       Prix du véhicule ({selectedCurrency}) {getCurrencyInfo(selectedCurrency).flag}
                     </label>
                   </div>
                   <div className="p-4 bg-white/70 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                     <div className="relative">
                       <input 
                         type="number" 
                         id="vehiclePrice" 
                         name="priceEur" 
                         value={formData.priceEur} 
                         onChange={handleChange} 
                         className="w-full bg-transparent border-none outline-none pl-8 text-sm lg:text-base" 
                         placeholder={`Prix d'achat réel en ${getCurrencyInfo(selectedCurrency).name} (${selectedCurrency})`}
                         required 
                       />
                       <span className="absolute left-0 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400 font-bold text-sm">
                         {getCurrencyInfo(selectedCurrency).flag}
                       </span>
                     </div>
                   </div>
                   <p className="text-xs text-gray-500">
                     Ce prix sera converti au taux {selectedCurrency === 'USD' ? 'USD' : 'EUR'} parallèle pour le coût total du véhicule
                   </p>
                 </div>
                 <div className="space-y-2">
                   <label htmlFor="cylindree" className="block text-sm font-semibold text-gray-700">
                     {t('form_cylindree')}
                   </label>
                   {availableCylindree.length > 0 ? (
                     <div className={`p-4 border border-gray-200 rounded-lg transition-colors ${
                       formData.brand && formData.model 
                         ? 'bg-white/70 hover:bg-gray-50' 
                         : 'bg-gray-100 cursor-not-allowed'
                     }`}>
                       <select 
                         id="cylindree" 
                         name="cylindree" 
                         value={formData.cylindree} 
                         onChange={handleChange} 
                         disabled={!formData.brand || !formData.model}
                         className={`w-full bg-transparent border-none outline-none text-sm lg:text-base ${
                           !formData.brand || !formData.model ? 'text-gray-400 cursor-not-allowed' : ''
                         }`}
                         required
                       >
                         <option value="">
                           {!formData.brand || !formData.model 
                             ? 'Sélectionnez d\'abord la marque et le modèle' 
                             : t('form_select_placeholder')
                           }
                         </option>
                         {availableCylindree.map((cylindree) => (
                           <option key={cylindree} value={cylindree}>
                             {cylindree} cm³
                           </option>
                         ))}
                       </select>
                     </div>
                   ) : (
                     <div className={`p-4 border border-gray-200 rounded-lg transition-colors ${
                       formData.brand && formData.model 
                         ? 'bg-white/70 hover:bg-gray-50' 
                         : 'bg-gray-100 cursor-not-allowed'
                     }`}>
                       <input 
                         type="text" 
                         id="cylindree" 
                         name="cylindree" 
                         value={formData.cylindree} 
                         onChange={handleChange} 
                         disabled={!formData.brand || !formData.model}
                         className={`w-full bg-transparent border-none outline-none text-sm lg:text-base ${
                           !formData.brand || !formData.model ? 'text-gray-400 cursor-not-allowed' : ''
                         }`}
                         placeholder={
                           !formData.brand || !formData.model 
                             ? 'Sélectionnez d\'abord la marque et le modèle' 
                             : 'Saisissez manuellement (ex: 1,500)'
                         }
                         required
                       />
                     </div>
                   )}
                   {formData.brand && formData.model && availableCylindree.length === 0 && (
                     <p className="text-xs text-red-600 mt-1">
                       Aucune cylindrée trouvée dans les données officielles pour cette configuration
                     </p>
                   )}
                 </div>
               </div>

               {/* Type de motorisation - Après sélection marque et modèle */}
               {formData.brand && formData.model && (
                 <div className="space-y-4">
                   <p className="text-sm text-gray-600 font-medium">
                     {availableEngineTypes.length > 0 
                       ? `Sélectionnez le type de motorisation disponible pour ${formData.brand} ${formData.model} :`
                       : 'Sélectionnez le type de motorisation :'
                     }
                   </p>
                   {availableEngineTypes.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       {availableEngineTypes.map((engineType) => (
                         <label key={engineType.value} className="flex items-center space-x-3 p-4 bg-white/70 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                           <input
                             type="radio"
                             name="engineType"
                             value={engineType.value}
                             checked={formData.engineType === engineType.value}
                             onChange={handleChange}
                             className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                           />
                           <span className="text-sm font-medium text-gray-700">{engineType.label}</span>
                         </label>
                       ))}
                     </div>
                   ) : (
                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                       <label className="flex items-center space-x-3 p-4 bg-white/70 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                         <input
                           type="radio"
                           name="engineType"
                           value="essence"
                           checked={formData.engineType === 'essence'}
                           onChange={handleChange}
                           className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                         />
                         <span className="text-sm font-medium text-gray-700">{t('form_engineType_option_essence')}</span>
                       </label>
                       <label className="flex items-center space-x-3 p-4 bg-white/70 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                         <input
                           type="radio"
                           name="engineType"
                           value="diesel"
                           checked={formData.engineType === 'diesel'}
                           onChange={handleChange}
                           className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                         />
                         <span className="text-sm font-medium text-gray-700">{t('form_engineType_option_diesel')}</span>
                       </label>
                       <label className="flex items-center space-x-3 p-4 bg-white/70 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                         <input
                           type="radio"
                           name="engineType"
                           value="hybride"
                           checked={formData.engineType === 'hybride'}
                           onChange={handleChange}
                           className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                         />
                         <span className="text-sm font-medium text-gray-700">{t('form_engineType_option_hybride')}</span>
                       </label>
                       <label className="flex items-center space-x-3 p-4 bg-white/70 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                         <input
                           type="radio"
                           name="engineType"
                           value="electrique"
                           checked={formData.engineType === 'electrique'}
                           onChange={handleChange}
                           className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                         />
                         <span className="text-sm font-medium text-gray-700">{t('form_engineType_option_electrique')}</span>
                       </label>
                     </div>
                   )}
                   {availableEngineTypes.length > 0 && (
                     <div className="text-sm text-red-600 bg-gray-50 border border-gray-200 rounded-lg p-2">
                       <span className="font-medium">✓</span> Options disponibles extraites du catalogue officiel de la douane
                     </div>
                   )}
                 </div>
               )}
             </div>

             {/* Cylindrée Information */}
             {availableCylindree.length > 0 && (
               <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-4 mb-6">
                 <div className="flex items-center space-x-3 mb-2">
                   <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                     <span className="text-white text-xs">✓</span>
                   </div>
                   <h4 className="font-semibold text-red-700 text-sm">Cylindrées disponibles dans les données officielles</h4>
                 </div>
                 <p className="text-sm text-red-600">
                   {availableCylindree.length} option(s) trouvée(s) pour {formData.brand} {formData.model}
                 </p>
                 <p className="text-xs text-gray-700 mt-1">
                   Options: {availableCylindree.join(', ')} cm³
                 </p>
               </div>
             )}


             {/* CSV Data Not Found Warning */}
             {formData.brand && formData.model && formData.engineType && formData.origin && formData.year && !currentCsvData && (
               <div className="space-y-4 lg:space-y-6">
                 <div className="flex items-center space-x-3 lg:space-x-4 pb-3 lg:pb-4 border-b border-gray-200">
                   <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-500 to-amber-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                     <span className="text-white font-bold text-sm lg:text-base">!</span>
                   </div>
                   <h3 className="text-lg lg:text-xl font-bold text-red-600">
                     Données officielles non trouvées
                   </h3>
                 </div>
                 
                 <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
                   <div className="flex items-center space-x-3 mb-4">
                     <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                       <span className="text-white text-sm">!</span>
                     </div>
                     <h4 className="font-semibold text-red-700">Aucune correspondance trouvée</h4>
                   </div>
                   <p className="text-red-600 mb-4">
                     Aucune donnée officielle correspondante n'a été trouvée pour cette configuration. 
                     Veuillez vérifier que tous les champs correspondent aux données officielles.
                   </p>
                   <div className="bg-white/60 rounded-lg p-3">
                     <p className="text-sm font-semibold text-red-700 mb-2">Configuration actuelle :</p>
                     <ul className="text-sm text-red-600 space-y-1">
                       <li>• Marque: {formData.brand}</li>
                       <li>• Modèle: {formData.model}</li>
                       <li>• Énergie: {formData.engineType}</li>
                       <li>• Cylindrée: {formData.cylindree || 'Non sélectionnée'} cm³</li>
                       <li>• Origine: {formData.origin}</li>
                       <li>• Année: {formData.year}</li>
                     </ul>
                     {availableCylindree.length > 0 && (
                       <div className="mt-3 pt-3 border-t border-gray-200">
                         <p className="text-sm font-semibold text-red-700 mb-1">Cylindrées disponibles :</p>
                         <p className="text-sm text-red-600">
                           {availableCylindree.join(', ')} cm³
                         </p>
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             )}

             {/* Location & Additional Info Section */}
             <div className="space-y-4 lg:space-y-6">
             <div className="flex items-center space-x-3 lg:space-x-4 pb-3 lg:pb-4 border-b border-gray-200">
                   <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-500 to-red-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                     <span className="text-white font-bold text-sm lg:text-base">3</span>
                   </div>
                   <h3 className="text-lg lg:text-xl font-bold text-gray-700">
                     {t('section_additional_info')}
                   </h3>
                 </div>
                 <div className="space-y-4 lg:space-y-6 mb-6">
                   <div className="space-y-2">
                     <label htmlFor="destination" className="block text-sm font-semibold text-gray-700">{t('form_destination')}</label>
                     <div className="relative">
                       <input 
                         type="text" 
                         id="destination" 
                         name="destination" 
                         value={formData.destination} 
                         onChange={handleChange} 
                         className="w-full px-3 lg:px-4 py-2.5 lg:py-3 pl-10 lg:pl-12 rounded-lg lg:rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white/70 backdrop-blur-sm text-sm lg:text-base"
                         placeholder="Ville de destination"
                       />
                       <MapPin className="absolute left-3 lg:left-4 top-3.5 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                     </div>
                   </div>
                 </div>
               </div>

               {/* Exchange Rates Section */}
               <div className="space-y-4 lg:space-y-6">
                 <div className="flex items-center space-x-3 lg:space-x-4 pb-3 lg:pb-4 border-b border-gray-200">
                   <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-500 to-red-600 rounded-lg lg:rounded-xl flex items-center justify-center">
                     <span className="text-white font-bold text-sm lg:text-base">4</span>
                   </div>
                   <h3 className="text-lg lg:text-xl font-bold text-gray-700">{t('exchange_rate_title')}</h3>
                 </div>
                 <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-2xl p-6">
                   <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center space-x-3">
                       <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gray-500 rounded-lg lg:rounded-xl flex items-center justify-center">
                         <TrendingUp className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                       </div>
                       <h4 className="text-lg lg:text-xl font-bold text-red-700">Taux de Change</h4>
                     </div>
                     <button 
                       type="button" 
                       onClick={() => setIsEditingRates(!isEditingRates)} 
                       className="flex items-center space-x-2 text-sm bg-gray-200 hover:bg-gray-300 text-red-700 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl transition-colors"
                     >
                       <Edit3 className="w-4 h-4 lg:w-5 lg:h-5" />
                       <span>{isEditingRates ? t('exchange_rate_save') : t('exchange_rate_edit')}</span>
                     </button>
                   </div>
                   {isEditingRates ? (
                     <div className="grid md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="block text-sm font-semibold text-red-700">
                           Taux EUR marché (1 EUR = ? DZD)
                         </label>
                         <input
                           type="number"
                           name="marcheNoir"
                           value={exchangeRates.marcheNoir}
                           onChange={handleExchangeRateChange}
                           className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80"
                           min="1"
                           step="1"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="block text-sm font-semibold text-red-700">
                           Taux EUR bancaire (1 EUR = ? DZD)
                         </label>
                         <input
                           type="number"
                           name="bancaire"
                           value={exchangeRates.bancaire}
                           onChange={handleExchangeRateChange}
                           className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80"
                           min="1"
                           step="1"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="block text-sm font-semibold text-red-700">
                           Taux USD bancaire (1 USD = ? DZD)
                         </label>
                         <input
                           type="number"
                           name="usdBancaire"
                           value={exchangeRates.usdBancaire}
                           onChange={handleExchangeRateChange}
                           className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80"
                           min="1"
                           step="1"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="block text-sm font-semibold text-red-700">
                           Taux USD marché (1 USD = ? DZD)
                         </label>
                         <input
                           type="number"
                           name="usdMarcheNoir"
                           value={exchangeRates.usdMarcheNoir}
                           onChange={handleExchangeRateChange}
                           className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80"
                           min="1"
                           step="1"
                         />
                       </div>
                     </div>
                   ) : (
                     <div className="grid md:grid-cols-2 gap-6">
                                          <div className={`bg-white/60 rounded-xl p-4 ${selectedCurrency === 'EUR' ? 'ring-2 ring-gray-300' : ''}`}>
                     <p className="text-red-700 font-semibold">Taux EUR Bancaire:</p>
                     <p className="text-2xl font-bold text-red-600">1 EUR = {exchangeRates.bancaire} DZD</p>
                     <p className="text-xs text-gray-700 mt-1">Utilisé pour les taxes officielles EUR</p>
                     {selectedCurrency === 'EUR' && (
                       <p className="text-xs text-red-600 mt-1 font-semibold">✓ Actuellement sélectionné</p>
                     )}
                   </div>
                   <div className={`bg-white/60 rounded-xl p-4 ${selectedCurrency === 'EUR' ? 'ring-2 ring-gray-300' : ''}`}>
                     <p className="text-red-700 font-semibold">Taux EUR marché :</p>
                     <p className="text-2xl font-bold text-red-600">1 EUR = {exchangeRates.marcheNoir} DZD</p>
                     <p className="text-xs text-gray-700 mt-1">Utilisé pour votre prix EUR</p>
                     {selectedCurrency === 'EUR' && (
                       <p className="text-xs text-red-600 mt-1 font-semibold">✓ Actuellement sélectionné</p>
                     )}
                   </div>
                   <div className={`bg-white/60 rounded-xl p-4 ${selectedCurrency === 'USD' ? 'ring-2 ring-gray-300' : ''}`}>
                     <p className="text-red-700 font-semibold">Taux USD Bancaire:</p>
                     <p className="text-2xl font-bold text-red-600">1 USD = {exchangeRates.usdBancaire} DZD</p>
                     <p className="text-xs text-gray-700 mt-1">Utilisé pour les taxes officielles USD</p>
                     {selectedCurrency === 'USD' && (
                       <p className="text-xs text-red-600 mt-1 font-semibold">✓ Actuellement sélectionné</p>
                     )}
                   </div>
                   <div className={`bg-white/60 rounded-xl p-4 ${selectedCurrency === 'USD' ? 'ring-2 ring-gray-300' : ''}`}>
                     <p className="text-red-700 font-semibold">Taux USD marché :</p>
                     <p className="text-2xl font-bold text-red-600">1 USD = {exchangeRates.usdMarcheNoir} DZD</p>
                     <p className="text-xs text-gray-700 mt-1">Utilisé pour votre prix USD</p>
                     {selectedCurrency === 'USD' && (
                       <p className="text-xs text-red-600 mt-1 font-semibold">✓ Actuellement sélectionné</p>
                     )}
                   </div>
                     </div>
                   )}
                   <p className="text-sm text-red-600 mt-4 text-center bg-white/40 rounded-lg p-3">
                     {t('exchange_rate_note')} Les taux USD sont utilisés pour les véhicules avec prix en dollars, les taux EUR pour les autres.
                   </p>
                 </div>
               </div>

               {/* Form Actions */}
               <div className="flex flex-col lg:flex-row gap-4 pt-8 border-t border-gray-200">
                 <button 
                   type="button" 
                   onClick={() => {
                     addDebugLog('Calculate button clicked');
                     const result = calculateCustomsDuty();
                     if (result) {
                       addDebugLog('Calculation successful', result);
                       setCalculationResult(result);
                     } else {
                       addDebugLog('❌ Calculation failed');
                       alert('Erreur lors du calcul. Veuillez vérifier les données saisies.');
                     }
                   }} 
                   className="group relative overflow-hidden flex-1 px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-gray-500 to-red-600 hover:from-red-600 hover:to-red-900 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                 >
                   <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                   <div className="relative flex items-center justify-center space-x-3">
                     <Calculator className="w-6 h-6" />
                     <span className="text-lg">{t('button_calculate')}</span>
                   </div>
                 </button>
                 <button 
                   type="submit" 
                   disabled={isSubmitting} 
                   className="group relative overflow-hidden flex-1 px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-gray-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                 >
                   <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                   <div className="relative flex items-center justify-center space-x-3">
                     {isSubmitting ? (
                       <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                     ) : (
                       <Send className="w-6 h-6" />
                     )}
                     <span className="text-lg">{isSubmitting ? 'Envoi...' : t('button_submit')}</span>
                   </div>
                 </button>
               </div>
               
             </form>

             {/* Calculation Result - Show in same container */}
             {calculationResult && (
               <div className="bg-gradient-to-r from-gray-50 to-red-100 border-t border-gray-200 p-8">
                 <div className="flex items-center space-x-4 mb-6">
                   <div className="w-12 h-12 bg-gray-500 rounded-2xl flex items-center justify-center">
                     <CheckCircle className="w-6 h-6 text-white" />
                   </div>
                   <h3 className="text-2xl font-bold text-red-700">{t('result_title')}</h3>
                 </div>
                 
                 {/* Price Summary */}
                 <div className="grid md:grid-cols-2 gap-4 mb-6">
                   <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                     <p className="text-sm font-semibold text-red-600 mb-1">Prix utilisateur</p>
                     <p className="text-2xl font-bold text-red-700">
                       {calculationResult.priceEur.toLocaleString()} {selectedCurrency}
                     </p>
                     <p className="text-sm text-gray-700">
                       {calculationResult.prixDZD.toLocaleString()} DZD
                     </p>
                   </div>
                   <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                     <p className="text-sm font-semibold text-red-600 mb-1">
                       {calculationResult.csvPrice > 0 ? getPriceLabel(formData.vehicleType, formData.year) : 'Prix de base (utilisateur)'}
                     </p>
                     <p className="text-2xl font-bold text-red-700">
                       {calculationResult.csvPrice > 0 
                         ? `${calculationResult.csvPrice.toLocaleString()} ${csvData?.Code_monnaie || 'EUR'}`
                         : `${calculationResult.priceEur.toLocaleString()} EUR`
                       }
                     </p>
                     <p className="text-sm text-gray-700">
                       {calculationResult.csvPrice > 0 
                         ? `${calculationResult.csvPriceDZD.toLocaleString()} DZD`
                         : `${(calculationResult.priceEur * exchangeRates.bancaire).toLocaleString()} DZD`
                       }
                     </p>
                     {calculationResult.csvPrice > 0 && (
                       <p className="text-xs text-red-600 mt-1">
                         💱 Taux: 1 {selectedCurrency} = {selectedCurrency === 'USD' ? exchangeRates.usdBancaire : exchangeRates.bancaire} DZD
                       </p>
                     )}
                     {calculationResult.csvPrice === 0 && (
                       <p className="text-xs text-red-600 mt-1">
                         ⚠️ Prix officiel non trouvé - prix utilisateur utilisé
                       </p>
                     )}
                   </div>
                 </div>
                 
                 <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-lg">
                   <div className="flex justify-between items-center">
                     <span className="text-xl font-semibold text-gray-700">{t('result_total_cost')}</span>
                     <span className="text-3xl font-bold bg-gradient-to-r from-gray-500 to-red-600 bg-clip-text text-transparent">
                       {calculationResult.coutTotalVehicule.toLocaleString()} DZD
                     </span>
                   </div>
                     <div className="mt-2 text-sm text-red-600">
                     Prix utilisateur ({calculationResult.prixDZD.toLocaleString()} DZD) + Droits de douane ({calculationResult.totalFinal.toLocaleString()} DZD)
                   </div>
                   {calculationResult.reduction > 0 && (
                     <div className="mt-2 text-sm text-red-600">
                       ✅ Réduction de {calculationResult.reduction}% appliquée pour véhicule d'occasion
                     </div>
                   )}
                 </div>
                 
                 <div className="flex flex-col lg:flex-row gap-4">
                   <button 
                     onClick={generatePDF} 
                     disabled={isGeneratingPDF} 
                     className="group relative overflow-hidden flex-1 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-gray-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                   >
                     <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                     <div className="relative flex items-center justify-center space-x-2">
                       {isGeneratingPDF ? (
                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                       ) : (
                         <Download className="w-5 h-5" />
                       )}
                       <span>{isGeneratingPDF ? t('pdf_generating') : t('result_button_open_pdf')}</span>
                     </div>
                   </button>
                   
                   <button 
                     onClick={downloadPDF} 
                     disabled={isGeneratingPDF} 
                     className="group relative overflow-hidden flex-1 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-gray-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50"
                   >
                     <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                     <div className="relative flex items-center justify-center space-x-2">
                       {isGeneratingPDF ? (
                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                       ) : (
                         <FileDown className="w-5 h-5" />
                       )}
                       <span>{isGeneratingPDF ? t('pdf_generating') : t('button_download_pdf')}</span>
                     </div>
                   </button>
                   <button
                     onClick={() => {
                       setCalculationResult(null);
                       // Don't reset form, just clear calculation
                     }}
                     className="group relative overflow-hidden flex-1 px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-gray-500 to-red-600 hover:from-red-600 hover:to-red-900 text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                   >
                     <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                     <div className="relative flex items-center justify-center space-x-2">
                       <Calculator className="w-5 h-5" />
                       <span>Nouveau calcul</span>
                     </div>
                   </button>
                 </div>
               </div>
             )}
           </div>
         </div>
       )}
     </div>
     
   </section>
 );
}