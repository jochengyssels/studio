import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from random import uniform

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}

def get_beaches():
    try:
        print("🌐 Attempting to scrape live data...")
        url = "https://www.sardegnaturismo.it/en/explore/beaches"
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raises HTTPError for bad status codes
        return parse_html(response.text)
    except Exception as e:
        print(f"⚠️ Live scraping failed: {e}\n🔧 Using cached data")
        return get_cached_data()

def parse_html(html):
    soup = BeautifulSoup(html, 'html.parser')
    beaches = []
    
    # Updated selector - adjust based on actual page inspection
    for card in soup.select('.card-item'):  
        time.sleep(uniform(0.5, 1.5))  # Random delay to avoid blocking
        name = card.select_one('h2').get_text(strip=True) if card.select_one('h2') else "Unknown"
        description = card.select_one('p').get_text(strip=True) if card.select_one('p') else ""
        beaches.append({
            "name": name,
            "type": "beach",
            "description": description,
            "region": "Unknown"  # Update later with geocoding
        })
    return beaches

def get_cached_data():
    """Fallback hardcoded data"""
    return [
        {
            "name": "Cala Mariolu",
            "type": "beach",
            "description": "Turquoise waters accessible by boat or hike",
            "region": "Ogliastra"
        },
        {
            "name": "Spiaggia del Principe",
            "type": "beach",
            "description": "Famous pink sand beach in Costa Smeralda",
            "region": "Olbia-Tempio"
        },
        # Additional cached entries
        {
            "name": "Cala Luna",
            "type": "beach",
            "description": "Stunning cave beach with white sand",
            "region": "Nuoro"
        }
    ]

if __name__ == "__main__":
    try:
        beaches = get_beaches()
        df = pd.DataFrame(beaches)
        if not df.empty:
            df.to_csv("sardinia_beaches.csv", index=False)
            print(f"✅ Saved {len(beaches)} beaches to sardinia_beaches.csv")
        else:
            print("⚠️ No data scraped or cached!")
    except Exception as e:
        print(f"❌ Critical error: {e}")