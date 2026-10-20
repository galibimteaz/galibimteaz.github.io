"""
Adds the Halloween theme to every .html page in a folder.

How to use:
  1. Download / copy your site files into one folder (keep a backup copy).
  2. Put halloween.css, halloween.js and this script in that same folder.
  3. Open a terminal in the folder and run:   python add_halloween.py
  4. Upload the changed .html files plus halloween.css and halloween.js to GitHub.

Safe to run more than once: pages that already have the lines are skipped.
"""
import glob
import os
import re

LINK = '<link rel="stylesheet" href="halloween.css">'
SCRIPT = '<script src="halloween.js"></script>'
HEAD_END = re.compile(r'</head>', re.IGNORECASE)

changed, skipped = [], []

for path in sorted(glob.glob('*.html')):
    with open(path, 'r', encoding='utf-8', newline='') as f:
        html = f.read()

    if 'halloween.css' in html or 'halloween.js' in html:
        skipped.append(path + ' (already done)')
        continue
    if not HEAD_END.search(html):
        skipped.append(path + ' (no </head> found)')
        continue

    nl = '\r\n' if '\r\n' in html else '\n'
    block = LINK + nl + SCRIPT + nl
    html = HEAD_END.sub(lambda m: block + m.group(0), html, count=1)

    with open(path, 'w', encoding='utf-8', newline='') as f:
        f.write(html)
    changed.append(path)

print('Updated %d page(s):' % len(changed))
for p in changed:
    print('  +', p)
if skipped:
    print('Skipped:')
    for p in skipped:
        print('  -', p)
if not os.path.exists('halloween.css') or not os.path.exists('halloween.js'):
    print('\nReminder: halloween.css and halloween.js must be uploaded to your site too.')
