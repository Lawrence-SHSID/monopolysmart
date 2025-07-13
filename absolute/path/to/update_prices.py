import json

# Load both datasets
with open('data/PROPERTY_PRICE.json', 'r') as f:
    price_data = json.load(f)

with open('data/properties.json', 'r') as f:
    properties = json.load(f)

# Create price lookup dictionary
price_lookup = {item['property_name']: item['price'] 
                for item in price_data if item['price'] != 'N/A'}

# Update prices in properties.json
updated = 0
for prop in properties:
    if prop['name'] in price_lookup:
        new_price = price_lookup[prop['name']]
        
        # Preserve existing price format (integer values)
        prop['price'] = int(new_price) if isinstance(new_price, (int, float)) else new_price
        
        # Update price text formatting
        if prop['pricetext'].startswith('$'):
            prop['pricetext'] = f"${new_price}"
        
        updated += 1

# Save updated properties
with open('data/properties.json', 'w') as f:
    json.dump(properties, f, indent=2)

print(f"Successfully updated {updated} properties")
print("Note: The following properties weren't updated due to missing/N/A prices:")
print(" - " + "\n - ".join([prop['name'] for prop in properties 
                          if prop['name'] not in price_lookup]))