/* Stage 3 bridge: memory-only, conservative mapping; no URL/storage/network transfer. */
(function(root){'use strict';
function mapDiagnosis(s){const p={};if(['개인','직장인','자영업자','법인 대표'].includes(s.persona))p.persona=s.persona;
// Monthly take-home income is NOT annual gross income; do not convert it.
// Debt state labels are NOT reliable delinquency-day counts.
if(s.status==='개인회생')p.adjustmentKind='개인회생';
if(s.persona==='자영업자'&&s.businessStatus==='휴·폐업')p.businessType='폐업 개인사업자';
return p;}
function mount(s){const host=document.getElementById('result');if(!host||!root.DasiSchemes)return;const p=mapDiagnosis(s);const items=root.DasiSchemes.analyze(p);
const priority={'우선 검토':0,'확인 필요':1,'제한 가능성 높음':2};items.sort((a,b)=>(priority[a.status]??9)-(priority[b.status]??9));
const section=document.createElement('section');section.id='dasi-linked-schemes';section.style.cssText='margin-top:30px;padding:24px;border:1px solid #dbe6fa;border-radius:20px;background:#f7faff';
const h=document.createElement('h3');h.textContent='내 상황과 연결된 지원제도';section.append(h);
const intro=document.createElement('p');intro.style.cssText='font-size:13px;line-height:1.8;color:#536782';intro.textContent='진단에서 확인된 정보만 연결했습니다. 연체일수, 세전 연소득, 신용점수, 상환 회차 등은 아직 입력되지 않아 자격을 판단할 수 없습니다.';section.append(intro);
const grid=document.createElement('div');grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:12px';
for(const item of items){const card=document.createElement('article');card.style.cssText='background:white;border:1px solid #e2e9f5;border-radius:15px;padding:18px';const name=document.createElement('h4');name.style.cssText='margin:0 0 10px;font-size:17px';name.textContent=item.name;const status=document.createElement('p');status.style.cssText='font-size:12px;font-weight:800;color:#1b57bc';status.textContent=item.status;const note=document.createElement('p');note.style.cssText='font-size:12px;line-height:1.7;color:#536782';note.textContent=item.reasons.join(' ')||('추가 확인: '+item.missing.slice(0,4).join(', '));const a=document.createElement('a');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='공식 자료 확인 ↗';a.style.cssText='color:#1558ed;font-weight:800;font-size:13px';card.append(name,status,note,a);grid.append(card)}section.append(grid);const foot=document.createElement('p');foot.style.cssText='font-size:12px;line-height:1.7;color:#687b94';foot.textContent='우선 검토는 승인 가능성이 아닙니다. 공식 기관의 최신 요건을 반드시 확인하세요.';section.append(foot);const more=document.createElement('a');more.href='schemes.html';more.textContent='세부 조건 직접 입력하고 전체 제도 비교하기 →';more.style.cssText='display:inline-block;margin-top:8px;color:#1558ed;font-weight:800';section.append(more);host.querySelector('#dasi-linked-schemes')?.remove();host.append(section)}
if(typeof root.addEventListener==='function')root.addEventListener('dasi:diagnosis-complete',e=>mount(e.detail||{}));const api={mapDiagnosis};if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
