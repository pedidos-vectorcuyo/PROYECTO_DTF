import json

path = r'c:\Users\Gabriel\Desktop\PROYECTO_DTF\n8n_workflows\Recuperar Contraseña.json'
with open(path, 'r', encoding='utf8') as f:
    data = json.load(f)

def fix_query(nodes):
    for node in nodes:
        if node.get('name') == 'MySQL' and node.get('type') == 'n8n-nodes-base.mySql':
            query = node['parameters'].get('query', '')
            new_query = query.replace('SELECT nombre,', 'SELECT nombre_completo as nombre,').replace('correo', 'email')
            node['parameters']['query'] = new_query

fix_query(data.get('nodes', []))
active_version = data.get('activeVersion')
if active_version:
    fix_query(active_version.get('nodes', []))

with open(path, 'w', encoding='utf8') as f:
    json.dump(data, f, ensure_ascii=False, separators=(',', ':'))

print("Updated queries in Recovery workflow!")
