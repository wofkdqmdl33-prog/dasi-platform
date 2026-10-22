'use strict';const assert=require('node:assert/strict');const {mapDiagnosis}=require('./diagnosis-schemes.js');
assert.deepEqual(mapDiagnosis({persona:'직장인',status:'정상 상환',income:300}),{persona:'직장인'});
assert.deepEqual(mapDiagnosis({persona:'개인',status:'개인회생',income:200}),{persona:'개인',adjustmentKind:'개인회생'});
assert.deepEqual(mapDiagnosis({persona:'법인 대표',status:'연체',debt:20000}),{persona:'법인 대표'});
assert.deepEqual(mapDiagnosis({persona:'자영업자',businessStatus:'휴·폐업'}),{persona:'자영업자',businessType:'폐업 개인사업자'});
console.log('Integration mapping: 4 tests passed');
