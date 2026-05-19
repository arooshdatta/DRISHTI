import json

log_path = r'C:\Users\Aroosh Datta\.gemini\antigravity\brain\7b995d0a-df43-46b5-8799-7e83bd674ad8\.system_generated\logs\overview.txt'
with open(log_path, 'r', encoding='utf-8') as f:
    content = f.read()

files = ['VirtualMirror.jsx', 'App.jsx', 'WebcamContext.jsx', 'HealthContext.jsx']
results = {}

for line in content.splitlines():
    if 'write_to_file' in line:
        try:
            idx = line.find('{')
            if idx != -1:
                data = json.loads(line[idx:])
                if 'tool_calls' in data:
                    for call in data['tool_calls']:
                        if call.get('name') == 'write_to_file':
                            args = call.get('args', {})
                            target = args.get('TargetFile', '')
                            for f in files:
                                if f in target and f not in results:
                                    results[f] = args.get('CodeContent', '')
        except Exception as e:
            pass

for f, code in results.items():
    print(f'--- {f} ---')
    print(code[:200])
    with open(f'temp_{f}.txt', 'w', encoding='utf-8') as out:
        out.write(code.replace('\\n', '\n').replace('\\"', '"').replace('\\t', '\t').strip('"'))
