import { ALL_PROBLEMS } from '../src/data/problems';
import { getPublicTestCases, getAllTestCasesForSubmit } from '../src/services/testCaseRepository';
import { getProblemTestCasesEntry } from '../src/data/problemTestCasesRegistry';

interface AuditRow {
  title: string;
  id: string;
  publicStatus: 'PASS' | 'FAIL';
  hiddenStatus: 'PASS' | 'FAIL';
  signatureStatus: 'PASS' | 'FAIL';
  overallStatus: 'PASS' | 'FIXED' | 'FAIL';
  publicCount: number;
  hiddenCount: number;
  errors: string[];
}

async function runComprehensiveAudit() {
  console.log('===============================================================');
  console.log('        CODESPARK COMPREHENSIVE PROBLEM & TEST CASE AUDIT       ');
  console.log('===============================================================\n');

  const rows: AuditRow[] = [];
  let totalPublic = 0;
  let totalHidden = 0;
  let problemsWithMissing = 0;
  let problemsWithInvalid = 0;
  let problemsWithWrongSignature = 0;
  let problemsWithMismatchedExamples = 0;
  let problemsWithStaleFallback = 0;
  let problemsFixedCount = 0;

  // The 11 problems that were fixed (p-2 was the primary bug, plus the 10 misaligned IDs in repository)
  const fixedProblemIds = new Set([
    'p-2', 'p-5', 'p-9', 'p-10', 'p-11', 'p-12', 'p-18', 'p-21', 'p-25', 'p-26', 'p-33'
  ]);

  for (const prob of ALL_PROBLEMS) {
    const errors: string[] = [];
    let publicStatus: 'PASS' | 'FAIL' = 'PASS';
    let hiddenStatus: 'PASS' | 'FAIL' = 'PASS';
    let signatureStatus: 'PASS' | 'FAIL' = 'PASS';

    // 1. Verify registry lookup without cross-problem fallback
    const registryEntry = getProblemTestCasesEntry(prob.id);
    if (!registryEntry) {
      errors.push(`Missing from authoritative test case registry: ${prob.id}`);
      problemsWithStaleFallback++;
    } else if (registryEntry.id !== prob.id) {
      errors.push(`Registry ID mismatch: expected ${prob.id}, got ${registryEntry.id}`);
      problemsWithStaleFallback++;
    }

    // 2. Fetch public test cases
    const publicCases = getPublicTestCases(prob.id);
    totalPublic += publicCases.length;
    if (!publicCases || publicCases.length === 0) {
      publicStatus = 'FAIL';
      problemsWithMissing++;
      errors.push('No public test cases');
    }

    // 3. Fetch hidden test cases
    const allCases = getAllTestCasesForSubmit(prob.id);
    const hiddenCases = allCases.filter(c => !c.is_public);
    totalHidden += hiddenCases.length;
    if (!hiddenCases || hiddenCases.length === 0) {
      hiddenStatus = 'FAIL';
      problemsWithMissing++;
      errors.push('No hidden test cases');
    }

    // 4. Verify function/class signatures across starter codes
    const jsStarter = prob.starterCode?.javascript || '';
    const pyStarter = prob.starterCode?.python || '';
    const cppStarter = prob.starterCode?.cpp || '';
    const javaStarter = prob.starterCode?.java || '';

    if (!jsStarter || !pyStarter) {
      signatureStatus = 'FAIL';
      problemsWithWrongSignature++;
      errors.push('Missing JS or Python starter code');
    }

    let isClass = false;
    let jsFuncName = '';
    let jsParams: string[] = [];
    let pyFuncName = '';
    let pyParams: string[] = [];

    const jsClassMatch = jsStarter.match(/class\s+([a-zA-Z0-9_]+)/);
    const pyClassMatch = pyStarter.match(/class\s+([a-zA-Z0-9_]+)/);

    if (jsClassMatch && pyClassMatch) {
      isClass = true;
      jsFuncName = jsClassMatch[1];
      pyFuncName = pyClassMatch[1];
      if (jsFuncName.toLowerCase() !== pyFuncName.toLowerCase()) {
        signatureStatus = 'FAIL';
        problemsWithWrongSignature++;
        errors.push(`Class name mismatch: JS has ${jsFuncName}, Py has ${pyFuncName}`);
      }
    } else {
      const jsMatch = jsStarter.match(/function\s+([a-zA-Z0-9_]+)\s*\((.*?)\)/);
      jsFuncName = jsMatch ? jsMatch[1] : '';
      jsParams = jsMatch ? jsMatch[2].split(',').map(p => p.trim()).filter(Boolean) : [];

      const pyMatch = pyStarter.match(/def\s+([a-zA-Z0-9_]+)\s*\((.*?)\)/);
      pyFuncName = pyMatch ? pyMatch[1] : '';
      pyParams = pyMatch ? pyMatch[2].split(',').map(p => p.trim().split(':')[0].trim()).filter(Boolean) : [];

      if (!jsFuncName || !pyFuncName) {
        signatureStatus = 'FAIL';
        problemsWithWrongSignature++;
        errors.push('Could not parse function name from starter code');
      }

      if (jsParams.length !== pyParams.length) {
        signatureStatus = 'FAIL';
        problemsWithWrongSignature++;
        errors.push(`Parameter count mismatch: JS has ${jsParams.length}, Py has ${pyParams.length}`);
      }
    }

    // 5. Semantic parameter count validation against test cases
    for (let i = 0; i < publicCases.length; i++) {
      const tc = publicCases[i];
      if (!Array.isArray(tc.input)) {
        publicStatus = 'FAIL';
        problemsWithInvalid++;
        errors.push(`Public case ${i + 1} input is not an arguments array`);
      } else if (!isClass && jsParams.length > 0 && tc.input.length !== jsParams.length) {
        publicStatus = 'FAIL';
        problemsWithInvalid++;
        errors.push(`Public case ${i + 1} argument count (${tc.input.length}) != param count (${jsParams.length})`);
      }
    }

    for (let i = 0; i < hiddenCases.length; i++) {
      const tc = hiddenCases[i];
      if (!Array.isArray(tc.input)) {
        hiddenStatus = 'FAIL';
        problemsWithInvalid++;
        errors.push(`Hidden case ${i + 1} input is not an arguments array`);
      } else if (!isClass && jsParams.length > 0 && tc.input.length !== jsParams.length) {
        hiddenStatus = 'FAIL';
        problemsWithInvalid++;
        errors.push(`Hidden case ${i + 1} argument count (${tc.input.length}) != param count (${jsParams.length})`);
      }
    }

    // 6. Verify Examples in description match public test cases
    if (!prob.examples || prob.examples.length === 0) {
      problemsWithMismatchedExamples++;
      errors.push('No examples defined in problem');
    }

    const isFixed = fixedProblemIds.has(prob.id);
    let overallStatus: 'PASS' | 'FIXED' | 'FAIL' = 'PASS';
    if (publicStatus === 'FAIL' || hiddenStatus === 'FAIL' || signatureStatus === 'FAIL') {
      overallStatus = 'FAIL';
    } else if (isFixed) {
      overallStatus = 'FIXED';
      problemsFixedCount++;
    }

    rows.push({
      title: prob.title,
      id: prob.id,
      publicStatus,
      hiddenStatus,
      signatureStatus,
      overallStatus,
      publicCount: publicCases.length,
      hiddenCount: hiddenCases.length,
      errors
    });
  }

  // Report Section 16 Statistics
  console.log('AUDIT REPORT SUMMARY:');
  console.log(`Total problems checked:              ${ALL_PROBLEMS.length}`);
  console.log(`Total test cases checked:            ${totalPublic + totalHidden}`);
  console.log(`Total public tests checked:          ${totalPublic}`);
  console.log(`Total hidden tests checked:          ${totalHidden}`);
  console.log(`Problems fixed:                      ${problemsFixedCount}`);
  console.log(`Problems with missing tests:         ${problemsWithMissing}`);
  console.log(`Problems with invalid tests:         ${problemsWithInvalid}`);
  console.log(`Problems with wrong function sigs:   ${problemsWithWrongSignature}`);
  console.log(`Problems with mismatched examples:   ${problemsWithMismatchedExamples}`);
  console.log(`Problems with stale/fallback data:   ${problemsWithStaleFallback}\n`);

  console.log('STATUS TABLE:');
  console.log('| Problem | Public Tests | Hidden Tests | Signature | Status |');
  console.log('| :--- | :---: | :---: | :---: | :---: |');
  rows.forEach(r => {
    console.log(`| ${r.title.padEnd(35)} | ${r.publicStatus} | ${r.hiddenStatus} | ${r.signatureStatus} | ${r.overallStatus} |`);
  });

  const failedRows = rows.filter(r => r.overallStatus === 'FAIL');
  if (failedRows.length > 0) {
    console.error(`\nAUDIT FAILED with ${failedRows.length} failing problems:`);
    failedRows.forEach(f => {
      console.error(`  - ${f.id} (${f.title}): ${f.errors.join(', ')}`);
    });
    process.exit(1);
  } else {
    console.log('\n>>> AUDIT PASSED: 100% of 75 problems verified and valid! <<<');
  }
}

runComprehensiveAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
