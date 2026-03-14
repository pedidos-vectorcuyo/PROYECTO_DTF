const fs = require('fs');
const path = require('path');

const folder = __dirname;
const filesToUpdate = ["Verificacion Pago - MP.json", "Ingreso Orden.json"];

const adminPhone = "+54 9 260 460 8539";
const waPhoneId = "980787868452236";
const waCredId = "A9Lwdk9EaQzZvz74";
const waCredName = "WhatsApp Interno (Envio)";

function processNodes(nodes) {
    let modified = false;
    if (!nodes) return false;

    for (const node of nodes) {
        if (node.type === "n8n-nodes-base.telegram" && (node.parameters.text || node.parameters.chatId !== undefined)) {
            const text = node.parameters.text || "";
            const chatId = node.parameters.chatId || "";

            const isToAdmin = chatId.includes("7813157810");
            const recipient = isToAdmin
                ? adminPhone
                : "={{ $('Execute a SQL query').item?.json?.telefono || $('Code in JavaScript').item?.json?.telefono || $json.telefono }}";

            node.parameters = {
                operation: "send",
                phoneNumberId: waPhoneId,
                recipientPhoneNumber: recipient,
                textBody: text,
                additionalFields: {}
            };

            node.type = "n8n-nodes-base.whatsApp";
            node.typeVersion = 1.1;
            node.name = node.name.replace(/telegram/i, "WhatsApp");

            node.credentials = {
                whatsAppApi: {
                    id: waCredId,
                    name: waCredName
                }
            };

            modified = true;
        }
    }
    return modified;
}

for (const filename of filesToUpdate) {
    const filepath = path.join(folder, filename);
    if (!fs.existsSync(filepath)) continue;

    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    let modified1 = false;
    let modified2 = false;

    if (data.nodes) {
        modified1 = processNodes(data.nodes);
    }
    if (data.activeVersion && data.activeVersion.nodes) {
        modified2 = processNodes(data.activeVersion.nodes);
    }

    if (modified1 || modified2) {
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
        console.log("Updated", filename);
    }
}
