import httpx
import pandas as pd

async def scrape_agriturismos():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://guide.michelin.com/en/search.json",
            params={"q": "agriturismo sardinia", "types": "restaurant"}
        )
        results = response.json()['restaurants']
        
        agriturismos = []
        for item in results:
            agriturismos.append({
                "name": item['name'],
                "type": "agriturismo",
                "description": f"Michelin-rated: {item.get('description', '')}",
                "lat": item['location']['lat'],
                "lng": item['location']['lng']
            })
        
        pd.DataFrame(agriturismos).to_csv("sardinia_agriturismos.csv", index=False)
import asyncio; asyncio.run(scrape_agriturismos())