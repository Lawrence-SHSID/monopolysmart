import json

# Load JSON data from file
with open('data/properties.json', 'r', encoding='utf-8') as f:
    properties = json.load(f)

# Extract all 'name' values
property_names = [item['name'] for item in properties]

# Print results
print("Property Names:")
for name in property_names:
    print(f"{name}")