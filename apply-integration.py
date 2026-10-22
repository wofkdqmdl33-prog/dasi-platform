"""Run in repository root after copying Stage 2 files here. Idempotent patch."""
from pathlib import Path
p=Path('diagnosis.js')
s=p.read_text(encoding='utf-8')
needle="$('#result').classList.remove('hidden');"
assert s.count(needle)==1, 'diagnosis.js version mismatch: check manually'
if "dasi:diagnosis-complete" not in s:
    s=s.replace(needle,needle+"window.dispatchEvent(new CustomEvent('dasi:diagnosis-complete',{detail:{...state}}));",1)
    p.write_text(s,encoding='utf-8')
p=Path('diagnosis.html');s=p.read_text(encoding='utf-8')
needle='<script src="diagnosis.js"></script>'
assert needle in s,'diagnosis.html script tag not found'
if 'diagnosis-schemes.js' not in s:
    s=s.replace(needle,'<script src="schemes.js"></script><script src="diagnosis-schemes.js"></script>'+needle,1)
    p.write_text(s,encoding='utf-8')
print('Integrated. Open diagnosis.html and finish the questionnaire to see linked schemes.')
