"""python tests/browser-regression.py (Playwright + Chromium required). No remote requests."""
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from threading import Thread
import os
from playwright.sync_api import sync_playwright
os.chdir(Path(__file__).resolve().parents[1])
class Quiet(SimpleHTTPRequestHandler):
    def log_message(self,*args): pass
server=ThreadingHTTPServer(('127.0.0.1',0),Quiet)
Thread(target=server.serve_forever,daemon=True).start()
url=f'http://127.0.0.1:{server.server_port}'
with sync_playwright() as pw:
    browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':390,'height':844})
    context.route('**/*',lambda r:r.continue_() if r.request.url.startswith(url) else r.abort())
    context.add_init_script("localStorage.setItem=()=>{throw Error('storage forbidden')};sessionStorage.setItem=()=>{throw Error('storage forbidden')};window.fetch=()=>{throw Error('network forbidden')};navigator.sendBeacon=()=>{throw Error('beacon forbidden')}")
    page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(url+'/index.html')
    page.locator('[data-guide="회생"]').first.focus();page.keyboard.press('Enter')
    assert page.locator('#modal').evaluate("e=>e.classList.contains('open')")
    page.keyboard.press('Escape');assert not page.locator('#modal').evaluate("e=>e.classList.contains('open')")
    page.locator('[data-type="법인"]').click();page.locator('#needed').fill('450');page.locator('#income').fill('320')
    with context.expect_page() as new:page.locator('#analyze').click()
    d=new.value;d.wait_for_load_state();d.on('pageerror',lambda e:errors.append(str(e)))
    assert d.locator('[data-value="법인 대표"]').get_attribute('aria-pressed')=='true'
    d.locator('#next').click();d.locator('[data-value="개인회생"]').click();d.locator('[data-key="missed"][data-value="있음"]').click();d.locator('#next').click()
    assert d.locator('#needed').input_value()=='450'
    d.locator('#needed').fill('');d.locator('#next').click();assert d.locator('#needed').get_attribute('aria-invalid')=='true'
    assert d.locator('#income').is_visible()
    d.locator('#needed').fill('-1');d.locator('#next').click();assert d.locator('#neededError').inner_text()
    d.locator('#needed').fill('450');d.locator('#next').click()
    d.locator('[data-key="guarantee"][data-value="없음"]').click();d.locator('#next').click()
    assert d.locator('#next').is_disabled();d.locator('#agree').check();d.locator('#next').click()
    assert d.locator('#result').is_visible()
    for text in ['우선 확인','추가 확인 필요','판단 불가','대안','다음 행동','검증필요','개인보증 없음']:
        assert text in d.locator('#result').inner_text(),text
    assert d.evaluate('document.documentElement.scrollWidth<=innerWidth')
    d.emulate_media(media='print');assert not d.locator('.result-actions').is_visible();d.pdf(path='/tmp/dasi-result.pdf');d.emulate_media(media='screen')
    d.locator('#restart').click();assert d.locator('[data-value="법인 대표"]').get_attribute('aria-pressed')=='true'
    # Every persona reaches result and edits without losing money; desktop + mobile.
    for width in [390,1280]:
        d.set_viewport_size({'width':width,'height':900})
        for persona in ['개인','직장인','자영업자','창업자','법인 대표']:
            d.locator('[data-key="persona"][data-value="'+persona+'"]').click();d.locator('#next').click()
            d.locator('[data-value="정상 상환"]').click();d.locator('#next').click();d.locator('#next').click()
            if persona=='개인':assert d.locator('[data-key="incomeProof"]').count()==3
            if persona=='직장인':assert d.locator('[data-key="employmentType"]').count()==3
            if persona=='창업자':assert d.locator('[data-key="registration"]').count()==3
            d.locator('#prev').click();assert d.locator('#needed').input_value()=='450';d.locator('#next').click();d.locator('#next').click();d.locator('#next').click()
            assert d.locator('#result').is_visible();assert d.evaluate('document.documentElement.scrollWidth<=innerWidth')
            d.locator('#restart').click()
    d.reload();assert d.locator('[data-value="개인"]').get_attribute('aria-pressed')=='true'
    assert not errors,errors
    browser.close()
server.shutdown()
print('PASS: main guide keyboard/modal, memory handoff, validation, rehabilitation, corporate guarantee, 10 persona/viewport flows, edit/back, progress, print/PDF, reload reset, no runtime errors')
