import wikipediaapi
import pandas as pd

def scrape_nuraghes():
    wiki = wikipediaapi.Wikipedia('en')
    page = wiki.page("List_of_nuraghes_in_Sardinia")
    
    sites = []
    for line in page.text.split('\n'):
        if "*" in line:  # Example crude parsing - refine as needed
            name = line.split('*')[1].split(' - ')[0].strip()
            sites.append({
                "name": name,
                "type": "historic",
                "description": "Nuragic Bronze Age site"
            })
    
    pd.DataFrame(sites).to_csv("sardinia_nuraghes.csv", index=False)

scrape_nuraghes()