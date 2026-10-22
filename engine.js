/* 다시 1단계: 확인 가능한 공식 기관으로 안내하는 보수적인 규칙 기반 탐색 엔진.
   특정 지원제도의 자격·금액·승인 가능성을 판정하지 않는다. */
(function(root){'use strict';
const sources={ccrs:{name:'신용회복위원회',url:'https://www.ccrs.or.kr'},kinfa:{name:'서민금융진흥원',url:'https://www.kinfa.or.kr'},bokjiro:{name:'복지로',url:'https://www.bokjiro.go.kr'},myhome:{name:'마이홈',url:'https://www.myhome.go.kr'},klac:{name:'대한법률구조공단',url:'https://www.klac.or.kr'},court:{name:'대한민국 법원',url:'https://www.scourt.go.kr'},sbiz:{name:'소상공인24',url:'https://www.sbiz24.kr'},work:{name:'고용24',url:'https://www.work24.go.kr'}};
function evaluate(p){const cards=[];const add=(id,title,why,checks,keys,priority)=>cards.push({id,title,why,checks,sources:keys.map(k=>sources[k]),priority});const income=Number(p.income)||0,repay=Number(p.repayment)||0,need=Number(p.needed)||0;const ratio=income>0?repay/income:null;const business=['자영업자','창업자','법인 대표'].includes(p.persona);
if(p.status==='개인회생'){add('rehab','개인회생 진행 상태 확인','현재 진행 중인 변제 절차와 미납 여부를 먼저 확인해야 합니다.',['법원 사건 진행 상태 및 납부 내역','미납 발생 시 공식 통지·절차 확인','법률 상담 필요 여부'],['court','klac'],1)}
if(['연체 중','채무조정 중','상환 부담','신용회복 중'].includes(p.status)){add('adjust','채무조정 상담 경로','연체 여부와 기존 채무조정 이용 상태에 따라 검토할 경로가 달라집니다.',['연체 일수와 채무 유형','기존 채무조정 진행 여부','채권자 및 채무 목록'],['ccrs'],1)}
if(p.status==='파산·면책'){add('bankrupt','파산·면책 관련 절차 확인','면책 결정 및 남아 있는 채무의 법적 상태를 먼저 확인해야 합니다.',['면책 결정문·사건 상태','면책 대상에서 제외되는 채무 여부','법률구조 상담'],['court','klac'],1)}
if(business){add('business','사업 운영·재기 지원 탐색',p.persona==='법인 대표'?'법인 채무와 대표 개인의 보증·채무는 구분해 확인해야 합니다.':'사업 운영 상태와 업력·매출 등에 따라 확인할 사업 지원 경로가 달라집니다.',['사업자 등록 및 영업·폐업 상태','사업 관련 채무와 개인 채무 구분','매출·업력·보증 여부'],['sbiz','ccrs'],2)}
if(need>0){add('urgent','긴급 자금 및 비대출 대안','필요 자금이 있어도 대출 가능 여부는 단정할 수 없습니다. 금융지원과 복지·지출 조정 경로를 함께 확인하세요.',['자금이 필요한 시점','자금 용도와 상환 여력','지원 신청부터 지급까지 걸리는 시간'],['kinfa','bokjiro'],2)}
if(p.housing==='월세' || p.housing==='전세' || p.housing==='주거 불안'){add('housing','주거비 지원 탐색','주거 관련 제도는 지역·가구·소득·자산 조건을 추가 확인해야 합니다.',['거주 지역과 가구원 수','소득·재산 및 보증금','현재 계약 상태'],['myhome','bokjiro'],3)}
if(p.employment==='실직·구직'){add('job','고용·생활 안정 지원','구직·실직 상태라면 고용 지원과 복지 경로를 함께 확인할 수 있습니다.',['고용보험·구직 상태','가구 소득과 재산','지역별 지원 조건'],['work','bokjiro'],2)}
if(!cards.length){add('general','기초 금융·생활 지원 확인','현재 입력값만으로 특정 제도의 적합성을 판단하기 어렵습니다.',['채무 및 상환 현황','소득·가구·재산 조건','지원기관의 최신 공고'],['kinfa','bokjiro','ccrs'],2)}
const warnings=[];if(ratio!==null&&ratio>=.5)warnings.push(`월 상환액이 입력한 월 소득의 약 ${Math.round(ratio*100)}%입니다. 생활비를 제외한 실제 가용 금액을 우선 점검하세요.`);if(income===0&&repay>0)warnings.push('입력된 월 소득이 0원인데 상환액이 있습니다. 긴급 생활 안정과 상환 일정 상담을 우선 검토하세요.');if(p.urgency==='오늘·내일')warnings.push('오늘·내일 필요한 자금은 대부분의 지원제도가 즉시 지급을 보장하지 않습니다. 신청·심사·지급 소요시간을 반드시 확인하세요.');if(p.persona==='법인 대표')warnings.push('법인의 채무를 대표자 개인 채무로 자동 간주하지 마세요. 개인보증 여부를 구분해 확인해야 합니다.');if(p.status==='개인회생'&&p.missed==='있음')warnings.push('변제금 미납이 있다면 미납 횟수만으로 절차 폐지를 단정하지 말고 법원 기록과 통지를 확인하세요.');
return {cards:cards.sort((a,b)=>a.priority-b.priority),warnings,ratio,disclaimer:'본 결과는 입력 조건에 따른 공식 기관 탐색 경로이며, 지원 자격·승인·대출 가능성 또는 법률적 결론을 의미하지 않습니다. 실제 기준은 공식 기관의 최신 안내로 확인하세요.'};}
root.DasiEngine={evaluate,sources};
})(typeof window!=='undefined'?window:globalThis);
