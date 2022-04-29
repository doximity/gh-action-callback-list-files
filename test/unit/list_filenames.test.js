const { listFilenames } = require('../../src/list_filenames');

jest.mock('../../src/strategies/pull_request', () => jest.fn().mockImplementation(() => ({
  filenames: () => Promise.resolve(['first_pr_filename.js', 'second_pr_filename.js']),
})));
jest.mock('../../src/strategies/ref', () => jest.fn().mockImplementation(() => ({
  filenames: () => Promise.resolve(['first_ref_filename.js', 'second_ref_filename.js']),
})));

describe('validations', () => {
  test('inputs pr_number and ref inputs are mutually exclusive', async () => {
    const inputs = {
      ref: 'master',
      prNumber: '123',
    };

    const listFilenamesWrapper = () => listFilenames(inputs);
    await expect(listFilenamesWrapper).rejects.toThrow('The inputs ref and pr_number are mutually exclusive — pick one!');
  });

  test('must specify either ref or pr_number inputs', async () => {
    const inputs = {};

    const listFilenamesWrapper = () => listFilenames(inputs);
    await expect(listFilenamesWrapper).rejects.toThrow('You have to specify either ref or pr_number for this action to work');
  });
});

describe('picking a strategy', () => {
  test('chooses ref when ref input is provided', async () => {
    const inputs = {
      ref: 'master',
    };

    const result = await listFilenames(inputs);

    expect(result).toEqual(['first_ref_filename.js', 'second_ref_filename.js']);
  });

  test('chooses PR when PR number input is provided', async () => {
    const inputs = {
      prNumber: '123',
    };

    const result = await listFilenames(inputs);

    expect(result).toEqual(['first_pr_filename.js', 'second_pr_filename.js']);
  });
});
