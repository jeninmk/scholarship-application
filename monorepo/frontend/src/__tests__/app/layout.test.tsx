jest.mock('next/font/google', () => new Proxy({}, { get: () => () => ({}) }));

import * as Layout from '../../app/layout';

test('loads Layout module', () => {
  expect(Layout).toBeTruthy();
});
