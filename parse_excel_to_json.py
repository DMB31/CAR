import pandas as pd
import json
import os

def parse_excel_to_cars_json():
    """
    Parse the Excel file and create a new cars.json file with brand-to-models mapping
    """
    try:
        # Read the Excel file
        excel_file_path = "components/cleaned_excel_data.xlsx"
        
        if not os.path.exists(excel_file_path):
            print(f"Error: Excel file not found at {excel_file_path}")
            return
        
        # Read all sheets from the Excel file
        excel_file = pd.ExcelFile(excel_file_path)
        print(f"Found sheets: {excel_file.sheet_names}")
        
        # Dictionary to store brand -> models mapping
        cars_data = {}
        
        # Process each sheet
        for sheet_name in excel_file.sheet_names:
            print(f"Processing sheet: {sheet_name}")
            
            # Read the sheet
            df = pd.read_excel(excel_file_path, sheet_name=sheet_name)
            print(f"Sheet {sheet_name} columns: {list(df.columns)}")
            print(f"Sheet {sheet_name} shape: {df.shape}")
            
            # Look for brand and model columns
            brand_col = None
            model_col = None
            
            # Common column name variations
            brand_variations = ['brand', 'Brand', 'BRAND', 'marque', 'Marque', 'MARQUE', 'make', 'Make', 'MAKE']
            model_variations = ['model', 'Model', 'MODEL', 'modele', 'Modele', 'MODELE', 'name', 'Name', 'NAME']
            
            for col in df.columns:
                if col in brand_variations:
                    brand_col = col
                elif col in model_variations:
                    model_col = col
            
            # If we can't find standard column names, try to infer from data
            if brand_col is None or model_col is None:
                print(f"Could not find brand/model columns in {sheet_name}, trying to infer...")
                
                # Look for columns that might contain brand/model data
                for col in df.columns:
                    if df[col].dtype == 'object':  # String columns
                        unique_values = df[col].dropna().unique()
                        if len(unique_values) <= 50:  # Reasonable number of brands
                            if brand_col is None:
                                brand_col = col
                                print(f"Using {col} as brand column")
                            elif model_col is None:
                                model_col = col
                                print(f"Using {col} as model column")
            
            if brand_col is None or model_col is None:
                print(f"Skipping sheet {sheet_name} - could not identify brand/model columns")
                continue
            
            # Process the data
            for _, row in df.iterrows():
                brand = str(row[brand_col]).strip() if pd.notna(row[brand_col]) else None
                model = str(row[model_col]).strip() if pd.notna(row[model_col]) else None
                
                if brand and model and brand != 'nan' and model != 'nan':
                    # Clean up brand and model names
                    brand = brand.title()
                    model = model.strip()
                    
                    # Initialize brand if not exists
                    if brand not in cars_data:
                        cars_data[brand] = []
                    
                    # Add model if not already present
                    if model not in cars_data[brand]:
                        cars_data[brand].append(model)
        
        # Sort brands and models
        cars_data = dict(sorted(cars_data.items()))
        for brand in cars_data:
            cars_data[brand] = sorted(cars_data[brand])
        
        # Write to JSON file
        output_file = "cars_new.json"
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(cars_data, f, indent=2, ensure_ascii=False)
        
        print(f"\nSuccessfully created {output_file}")
        print(f"Total brands found: {len(cars_data)}")
        print(f"Total models found: {sum(len(models) for models in cars_data.values())}")
        
        # Print summary
        print("\nBrands found:")
        for brand, models in cars_data.items():
            print(f"  {brand}: {len(models)} models")
        
        return cars_data
        
    except Exception as e:
        print(f"Error processing Excel file: {str(e)}")
        return None

if __name__ == "__main__":
    parse_excel_to_cars_json()
