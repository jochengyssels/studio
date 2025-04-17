import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_sardinia_beaches():
    url = "https://www.sardegnaturismo.it/en/explore/beaches"
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(response.text, 'html.parser')
    
    beaches = []
    for card in soup.select('.card'):
        name = card.select_one('h2').text.strip()
        description = card.select_one('p').text.strip() if card.select_one('p') else ""
        beaches.append({
            "name": name,
            "type": "beach",
            "description": description,
            "region": "Ogliastra"  # Example - refine with geocoding
        })
    
    pd.DataFrame(beaches).to_csv("sardinia_beaches.csv", index=False)

scrape_sardinia_beaches()