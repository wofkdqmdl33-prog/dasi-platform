/* 다시 2단계: 공식 자료를 바탕으로 한 탐색용 규칙. 확정 자격 심사가 아닙니다. */
(function(root){'use strict';
const checked='2026-10-22';
const schemes=[
{id:'emergency-loan-2026',name:'불법사금융예방대출 (2026 개편)',category:'금융',agency:'서민금융진흥원',url:'https://www.kinfa.or.kr/notificationPromotion/newsDetail.do?seq=29254',source2:'https://www.kinfa.or.kr/notificationPromotion/noticeDetail.do?seq=33654',checked,summary:'연소득 3,500만원 이하 및 신용평점 하위 20% 등 요건. 상품 이용·상환 이력 제한과 금융교육 등 별도 조건 존재.',fields:['annualIncome','creditBottom20','oldEmergencyLoanHistory','taxDelinquency'],rule:'emergency',tags:['긴급자금','저신용'],note:'최대 한도·대출 실행 가능성은 공식 심사에서 확인. 신용점수 하위 20% 해당 여부를 직접 확인해야 합니다.'},
{id:'rapid-adjustment',name:'신속채무조정',category:'채무조정',agency:'신용회복위원회',url:'https://www.newstartfund.or.kr/Contents/Findmatchprogram.do',checked,summary:'정상 상환 중이거나 30일 이하 단기 연체 시 검토하는 채무조정 경로.',fields:['delinquencyDays','otherDebtConditions'],rule:'rapid',tags:['연체','상환부담'],note:'연체일수 외 채무·소득·최근 채무발생 등 추가 요건을 확인해야 합니다.'},
{id:'pre-workout',name:'사전채무조정 (프리워크아웃)',category:'채무조정',agency:'신용회복위원회',url:'https://www.newstartfund.or.kr/Contents/Findmatchprogram.do',checked,summary:'31~89일 연체 시 검토하는 채무조정 경로.',fields:['delinquencyDays','otherDebtConditions'],rule:'pre',tags:['연체'],note:'연체일수만으로 신청 가능 여부를 단정하지 않습니다.'},
{id:'workout',name:'개인워크아웃',category:'채무조정',agency:'신용회복위원회',url:'https://www.newstartfund.or.kr/Contents/Findmatchprogram.do',checked,summary:'90일 이상 연체 시 검토하는 채무조정 경로.',fields:['delinquencyDays','otherDebtConditions'],rule:'workout',tags:['장기연체'],note:'협약채권·채무 구성과 세부 요건을 확인해야 합니다.'},
{id:'newstart',name:'새출발기금',category:'사업·재기',agency:'한국자산관리공사',url:'https://www.newstartfund.or.kr/Contents/Prod.do',source2:'https://www.newstartfund.or.kr/Faq/List.do',checked,summary:'2020년 4월~2025년 6월 중 사업을 영위한 개인사업자 또는 법인 소상공인 등 대상 채무조정. 폐업 법인 신청 불가.',fields:['persona','operatedInPeriod','businessType','businessDebt','distressStatus'],rule:'newstart',tags:['자영업','법인','채무조정'],note:'신규 대출이 아닌 채무조정. 대표자 개인 채무와 법인 채무를 구분해야 합니다.'},
{id:'faithful-repayment',name:'채무조정 성실상환자 정책서민금융 확인',category:'금융',agency:'서민금융진흥원',url:'https://www.kinfa.or.kr/financialProduct/policyMicrofinanceBenefits.do',checked,summary:'개인회생·개인워크아웃·새출발기금 등의 채무조정을 6회차 이상 연체 없이 성실 상환한 경우 일부 정책서민금융 상품을 추가 검토할 수 있음.',fields:['adjustmentKind','onTimeInstallments','otherDebtConditions'],rule:'faithful',tags:['개인회생','성실상환'],note:'6회차 충족만으로 대출 승인이나 모든 상품의 자격이 보장되지 않습니다.'},
{id:'welfare-referral',name:'긴급복지·생활지원 상담',category:'생활·복지',agency:'복지로·보건복지상담센터',url:'https://www.kinfa.or.kr/financialLife/complexSupportDetail.do',checked,summary:'갑작스러운 위기상황의 생계·의료·주거 지원을 확인할 수 있는 상담 경로.',fields:['household','income','assets','crisis'],rule:'directory',tags:['생계','주거'],note:'지역·가구·소득·재산·위기 사유에 따른 자격 기준은 별도 확인 필요.'},
{id:'housing-directory',name:'마이홈 주거지원 탐색',category:'주거',agency:'마이홈',url:'https://www.myhome.go.kr',checked,summary:'공공임대 및 주거지원 공고를 확인하는 공식 안내 경로.',fields:['region','household','income','assets','housing'],rule:'directory',tags:['주거','임대'],note:'개별 모집공고별 자격과 모집기간 확인 필요.'}
];
function num(v){if(v===null||v===undefined||v==='')return null;const n=Number(v);return Number.isFinite(n)&&n>=0?n:null;}
function evaluate(s,p={}){let status='확인 필요',reasons=[],missing=[];const n=num(p.delinquencyDays),income=num(p.annualIncome),installments=num(p.onTimeInstallments);
if(s.rule==='emergency'){
 if(income!==null&&income>3500){status='제한 가능성 높음';reasons.push('입력 연소득이 공식 안내의 3,500만원 기준을 초과합니다.');}
 else if(p.creditBottom20==='아니오'){status='제한 가능성 높음';reasons.push('신용평점 하위 20% 요건과 일치하지 않습니다.');}
 else if(p.taxDelinquency==='예'){status='제한 가능성 높음';reasons.push('조세체납은 공식 안내상 제외 사유입니다.');}
 else {if(income===null)missing.push('연소득');if(!p.creditBottom20||p.creditBottom20==='모름')missing.push('신용평점 하위 20% 여부');if(!p.oldEmergencyLoanHistory||p.oldEmergencyLoanHistory==='모름')missing.push('기존 상품 이용·상환 이력');if(!p.taxDelinquency||p.taxDelinquency==='모름')missing.push('조세체납 여부');if(!missing.length){status='우선 검토';reasons.push('입력한 일부 기본 조건은 충족 방향이나 최종 심사·기타 제외요건 확인이 필요합니다.');}}
}else if(['rapid','pre','workout'].includes(s.rule)){
 const ranges={rapid:[0,30],pre:[31,89],workout:[90,Infinity]};const [min,max]=ranges[s.rule];if(n===null)missing.push('정확한 연체일수');else if(n>=min&&n<=max){status='우선 검토';reasons.push('연체일수 기준의 탐색 구간과 일치합니다.');}else{status='제한 가능성 높음';reasons.push('입력 연체일수가 이 제도의 기본 탐색 구간과 다릅니다.');}
}else if(s.rule==='newstart'){
 if(p.persona&& !['자영업자','법인 대표'].includes(p.persona)){status='제한 가능성 높음';reasons.push('개인사업자 또는 법인 소상공인 대상 제도입니다.');}
 else if(p.businessType==='폐업 법인'){status='제한 가능성 높음';reasons.push('공식 안내상 폐업 법인은 신청 대상에서 제외됩니다.');}
 else if(p.operatedInPeriod==='아니오'){status='제한 가능성 높음';reasons.push('공식 안내의 사업 영위 기간과 일치하지 않습니다.');}
 else{for(const [k,v] of [['persona','사업자 유형'],['operatedInPeriod','2020.4~2025.6 사업 영위 여부'],['businessType','사업자 상태'],['businessDebt','조정 대상 금융채무 여부'],['distressStatus','부실·부실우려 상태']])if(!p[k]||p[k]==='모름')missing.push(v);if(!missing.length){status='우선 검토';reasons.push('입력 조건상 공식 대상 범주를 우선 확인할 수 있습니다.');}}
}else if(s.rule==='faithful'){
 if(installments!==null&&installments<6){status='제한 가능성 높음';reasons.push('공식 안내의 6회차 이상 성실상환 조건에 아직 미달합니다.');}
 else if(installments>=6&&p.adjustmentKind&&p.adjustmentKind!=='없음'){status='우선 검토';reasons.push('성실상환 회차 조건을 충족하는 방향이나 상품별 추가 요건 확인이 필요합니다.');}
 else{missing.push('채무조정 종류','연체 없는 상환 회차');}
}else missing=s.fields.map(x=>({'household':'가구원 수','income':'소득','assets':'재산','crisis':'위기 사유','region':'거주 지역','housing':'주거 상태'})[x]||x);
return {...s,status,reasons,missing,disclaimer:'탐색 결과이며 자격·승인·지급을 확정하지 않습니다.'};}
function analyze(p){return schemes.map(s=>evaluate(s,p));}
const api={schemes,evaluate,analyze,checked};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.DasiSchemes=api;
})(typeof window!=='undefined'?window:globalThis);
