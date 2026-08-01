import requests
import json
from datetime import datetime, timedelta

# ఇక్కడ మీ Apify పర్సనల్ API టోకెన్‌ను సింగిల్ కోట్స్ మధ్య పేస్ట్ చేయండి
APIFY_TOKEN = "apify_api_TcgEyfgtebKHWaC7i34gEsPC7N2r5y0yGkis"

def fetch_actual_ap_tenders():
    # ఇది ఇండియా గవర్నమెంట్ టెండర్ల డేటాను సేకరించే అఫీషియల్ Apify యాక్టర్ లింక్
    # దీని ద్వారా ఏపీ ఈ-ప్రొక్యూర్‌మెంట్ (Andhra Pradesh) డేటాను మాత్రమే ఫిల్టర్ చేసి తెచ్చుకుంటాం
    actor_id = "jungle_synthesizer/india-eprocure-tender-scraper"
    url = f"https://apify.com{actor_id}/run-sync-get-dataset-items?token={APIFY_TOKEN}"
    
    # ఏపీ డేటా మాత్రమే కావాలని అడగడానికి పారామీటర్స్
    payload = {
        "state": "Andhra Pradesh",
        "maxItems": 100
    }
    
    ist_now = datetime.utcnow() + timedelta(hours=5, minutes=30)
    
    try:
        # రన్ సింక్ ద్వారా లైవ్ డేటాను అడగడం
        response = requests.post(url, json=payload, timeout=60)
        if response.status_code == 200 or response.status_code == 201:
            raw_data = response.json()
            tenders_list = []
            
            for item in raw_data:
                # థర్డ్ పార్టీ సర్వర్ నుండి వచ్చే ఒరిజినల్ డేటా కీలను మన సైట్ ఫార్మాట్ లోకి మార్చడం
                tenders_list.append({
                    "deptName": str(item.get("department", "Andhra Pradesh Government")),
                    "id": str(item.get("tenderId", "AP-LIVE-XYZ")),
                    "noticeNo": str(item.get("tenderReferenceNumber", f"NIT-{item.get('tenderId', '000')}")),
                    "category": str(item.get("tenderType", "WORKS")),
                    "description": str(item.get("title", "ప్రభుత్వ పనులు / సర్వీసెస్")),
                    "value": str(item.get("tenderValue", "Refer Document")),
                    "startDate": str(item.get("publishedDate", ist_now.strftime('%d-%m-%Y %I:%M %p'))),
                    "date": str(item.get("closingDate", (ist_now + timedelta(days=7)).strftime('%d-%m-%Y %I:%M %p')))
                })
            
            if tenders_list:
                return tenders_list
    except Exception as e:
        print(f"Error connecting to Tenders API: {e}")
        
    # ఒకవేళ ఏ కారణం చేతనైనా API కనెక్ట్ అవ్వకపోతే తాత్కాలికంగా పాత డేటా కనిపించకుండా ఖాళీ లిస్ట్ పంపుతుంది
    return []

if __name__ == "__main__":
    data = fetch_actual_ap_tenders()
    
    # ఒకవేళ నిజమైన డేటా వస్తేనే సేవ్ చేస్తుంది, లేదంటే పాత డేటాను అలాగే ఉంచుతుంది
    if data:
        with open("tenders.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)
        print(f"Successfully loaded {len(data)} ACTUAL government tenders!")
    else:
        print("No new data received from API. Keeping previous data.")
