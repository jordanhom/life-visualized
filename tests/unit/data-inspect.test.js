import { it } from 'vitest';
import { lifeExpectancyData } from '../../js/data.js';

it('inspect lifeExpectancyData keys (debug)', () => {
  // This test is diagnostic only; it will fail if keys are unexpectedly small.
  // Use console.log so output appears in test run.
  // eslint-disable-next-line no-console
  console.log('lifeExpectancyData keys:', Object.keys(lifeExpectancyData), 'male keys:', Object.keys(lifeExpectancyData.male));
});