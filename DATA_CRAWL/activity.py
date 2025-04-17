import requests
import pandas as pd

def scrape_activities():
    api_key = "YOUR_API_KEY"  # Sign up at partner.viator.com
    url = f"https://api.viator.com/partner/products/search?destinationId=2093"  # Sardinia ID
    
    response = requests.get(url, headers={"Accept-Language": "en", "X-Viator-API-Key": api_key})
    activities = []
    
    for item in response.json()['products']:
        activities.append({
            "name": item['title'],
            "type": item['subcategory'][0].lower(),
            "price": item['price']['originalPrice'],
            "duration": item['duration']['duration']
        })
    
    pd.DataFrame(activities).to_csv("sardinia_activities.csv", index=False)

scrape_activities()  # Uncomment after adding API key