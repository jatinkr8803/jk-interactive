import os, re

with open(r'd:\jatin2\JK Interactive\portfolio\js\projects-data.js', 'r', encoding='utf-8') as f:
    content = f.read()

img_paths = re.findall(r'[\'\"](/portfolio-assest/[^\'\"]+)[\'\"]', content)
print(f'Total asset references found in projects-data.js: {len(img_paths)}')

missing = []
for p in set(img_paths):
    rel = p.lstrip('/')
    full_path = os.path.join(r'd:\jatin2\JK Interactive', rel.replace('/', os.sep))
    if not os.path.exists(full_path):
        missing.append((p, full_path))

if missing:
    print('MISSING ASSETS:')
    for m in missing:
        print(' -', m)
else:
    print('ALL ASSETS VERIFIED ON DISK! (Zero missing assets)')
