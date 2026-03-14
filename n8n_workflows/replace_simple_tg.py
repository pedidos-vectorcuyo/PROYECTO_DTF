import json
import os

folder = r"c:\Users\Gabriel\Desktop\PROYECTO_DTF\n8n_workflows"
files_to_update = ["Verificacion Pago - MP.json", "Ingreso Orden.json"]

admin_phone = "+54 9 260 460 8539"
wa_phone_id = "980787868452236"
wa_cred_id = "A9Lwdk9EaQzZvz74"
wa_cred_name = "WhatsApp Interno (Envio)"

for filename in files_to_update:
    filepath = os.path.join(folder, filename)
    if not os.path.exists(filepath):
        continue
        
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
        
    modified = False
    
    # Process nodes
    if "nodes" in data:
        for node in data["nodes"]:
            if node["type"] == "n8n-nodes-base.telegram" and node["parameters"].get("text"):
                # We need to transform this node into WhatsApp
                old_name = node["name"]
                
                # Migrate parameters
                text = node["parameters"]["text"]
                chat_id = node["parameters"].get("chatId", "")
                
                # If it's hardcoded to telegram admin, map to whatsapp admin
                # If it's an expression or empty, map appropriately
                recipient = admin_phone if "7813157810" in chat_id else "={{ $('Execute a SQL query').item.json.telefono || $('Code in JavaScript').item.json.telefono || $json.telefono }}"
                
                # Reconstruct parameters for WhatsApp
                node["parameters"] = {
                    "operation": "send",
                    "phoneNumberId": wa_phone_id,
                    "recipientPhoneNumber": recipient,
                    "textBody": text,
                    "additionalFields": {}
                }
                
                node["type"] = "n8n-nodes-base.whatsApp"
                node["typeVersion"] = 1.1
                
                # Replace credentials
                node["credentials"] = {
                    "whatsAppApi": {
                        "id": wa_cred_id,
                        "name": wa_cred_name
                    }
                }
                
                modified = True
                
    # Also process activeVersion if it exists (n8n v1 format keeps a copy)
    if "activeVersion" in data and data["activeVersion"] and "nodes" in data["activeVersion"]:
        for node in data["activeVersion"]["nodes"]:
            if node["type"] == "n8n-nodes-base.telegram" and node["parameters"].get("text"):
                old_name = node["name"]
                text = node["parameters"]["text"]
                chat_id = node["parameters"].get("chatId", "")
                recipient = admin_phone if "7813157810" in chat_id else "={{ $('Execute a SQL query').item.json.telefono || $('Code in JavaScript').item.json.telefono || $json.telefono }}"
                
                node["parameters"] = {
                    "operation": "send",
                    "phoneNumberId": wa_phone_id,
                    "recipientPhoneNumber": recipient,
                    "textBody": text,
                    "additionalFields": {}
                }
                node["type"] = "n8n-nodes-base.whatsApp"
                node["typeVersion"] = 1.1
                node["credentials"] = {
                    "whatsAppApi": {
                        "id": wa_cred_id,
                        "name": wa_cred_name
                    }
                }
                modified = True

    if modified:
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"Updated {filename}")
