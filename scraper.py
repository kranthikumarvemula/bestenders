import requests
import json
import time
from datetime import datetime, timedelta

APIFY_TOKEN = "apify_api_TcgEyFgtebKMNw71M4GExPC7N2rSyByGkis"

def fetch_actual_ap_tenders():
    actor_id = "jungle_synthesizer/india-eprocure-tender-scraper"
    run_url = f"https://apify.com{actor_id}/runs?token={APIFY_TOKEN}"
    
    payload = {
        "maxItems": 50,
        "organization": "Andhra Pradesh",
        "sp_intended_usage": "Research and development for startup",
        "sp_contact": "test@bestender.com"
    }
    
    ist_now = datetime.utcnow() + timedelta(hours=5, minutes=30)
    
    try:
        print("Starting Apify Scraper Run...")
        run_response = requests.post(run_url, json=payload, timeout=30)
        
        if run_response.status_code == 201:
            run_data = run_response.json()
            dataset_id = run_data["data"]["defaultDatasetId"]
            
            # సర్వర్ స్కాన్ పూర్తి చేయడానికి 55 సెకన్లు ఆగడం
            print("Waiting 55 seconds for actual data collection...")
            time.sleep(55)
            
            fetch_url = f"https://apify.com{dataset_id}/items?token={APIFY_TOKEN}"
            data_response = requests.get(fetch_url, timeout=30)
            
            if data_response.status_code == 200:
                raw_data = data_response.json()
                tenders_list = []
                
                for item in raw_data:
                    org_name = item.get("organisation", item.get("organization", "Andhra Pradesh Govt"))
                    
                    tenders_list.append({
                        "deptName": str(org_name),
                        "id": str(item.get("tenderId", "AP-LIVE-XYZ")),
                        "noticeNo": str(item.get("tenderReferenceNumber", f"NIT-{item.get('tenderId', '101')}")),
                        "category": str(item.get("tenderCategory", item.get("tenderType", "WORKS"))).upper(),
                        "description": str(item.get("title", "గవర్నమెంట్ కాంట్రాక్ట్ పనులు / సర్వీసెస్")),
                        "value": str(item.get("estimatedValueInInr", item.get("tenderValue", "Refer Document"))),
                        "startDate": str(item.get("publishedDate", ist_now.strftime('%d-%m-%Y %I:%M %p'))),
                        "date": str(item.get("bidSubmissionEndDate", item.get("closingDate", (ist_now + timedelta(days=10)).strftime('%d-%m-%Y %I:%M %p'))))
                    })
                
                if tenders_list:
                    print(f"Success! {len(tenders_list)} REAL tenders fetched.")
                    return tenders_list
                    
    except Exception as e:
        print(f"API Connection Error: {e}")
        
    # డమ్మీ లిస్ట్ మొత్తాన్ని ఇక్కడి నుండి పూర్తిగా తొలగించాను
    print("Govt server blocked the request. No live data available right now.")
    return []

if __name__ == "__main__":
    data = fetch_actual_ap_tenders()
    # కేవలం అసలైన డేటా వస్తేనే ఫైల్ అప్‌డేట్ అవుతుంది
    if data:
        with open("tenders.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print("Live data updated successfully!")
    else:
        print("Skipping update as no real data was fetched.")
