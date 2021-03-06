jest.mock('fs');
jest.mock('composer.lock');
import fs from 'fs';
import path from 'path';
import composerFile from 'composer.lock';
import getPackageInfo from './packageInfo';

describe('package info', () => {
  test('get package info from string', () => {
    const packageInfo = getPackageInfo('foo/bar@1.0.0');

    expect(packageInfo).toEqual({ packageName: 'foo/bar', version: '1.0.0' });
  });

  test('get package info from package.json', () => {
    // complete repository info
    const fullRepoPackageFile = {
      version: '2.0.0',
      repository: {
        url: 'git+https://github.com/fullrepo/foo.git',
      },
    };

    const stringRepoPackageFile = {
      version: '2.0.0',
      repository: 'git+https://github.com/stringrepo/foo',
    };
    const shortRepoPackageFile = {
      version: '2.0.0',
      repository: 'github:shortrepo/foo',
    };

    const veryShortRepoPackageFile = {
      version: '2.1.0',
      repository: 'veryshortrepo/foo',
    };

    const urijsRepoPackageFile = {
      version: '1.19.0',
      repository: {
        type: 'git',
        url: 'https://github.com/medialize/URI.js.git',
      },
    };

    const fullrepoPath = path.join(
      process.cwd(),
      'node_modules/fullrepo/package.json'
    );
    const stringrepoPath = path.join(
      process.cwd(),
      'node_modules/stringrepo/package.json'
    );
    const shortrepoPath = path.join(
      process.cwd(),
      'node_modules/shortrepo/package.json'
    );

    const veryShortRepoPath = path.join(
      process.cwd(),
      'node_modules/veryshortrepo/package.json'
    );

    const urijsRepoPath = path.join(
      process.cwd(),
      'node_modules/urijs/package.json'
    );

    fs.__setMockFiles({
      [fullrepoPath]: JSON.stringify(fullRepoPackageFile),
      [stringrepoPath]: JSON.stringify(stringRepoPackageFile),
      [shortrepoPath]: JSON.stringify(shortRepoPackageFile),
      [veryShortRepoPath]: JSON.stringify(veryShortRepoPackageFile),
      [urijsRepoPath]: JSON.stringify(urijsRepoPackageFile),
    });

    // string repository info
    expect(getPackageInfo('fullrepo')).toEqual({
      packageName: 'fullrepo/foo',
      version: '2.0.0',
    });

    expect(getPackageInfo('stringrepo')).toEqual({
      packageName: 'stringrepo/foo',
      version: '2.0.0',
    });

    // short repository info
    expect(getPackageInfo('fullrepo')).toEqual({
      packageName: 'fullrepo/foo',
      version: '2.0.0',
    });

    expect(getPackageInfo('shortrepo')).toEqual({
      packageName: 'shortrepo/foo',
      version: '2.0.0',
    });

    expect(getPackageInfo('veryshortrepo')).toEqual({
      packageName: 'veryshortrepo/foo',
      version: '2.1.0',
    });

    expect(getPackageInfo('urijs')).toEqual({
      packageName: 'medialize/URI.js',
      version: '1.19.0',
    });
  });

  test('package without repository info', () => {
    jest.mock(
      'norepo/package.json',
      () => ({
        version: '2.0.0',
      }),
      { virtual: true }
    );

    expect(getPackageInfo('norepo')).toEqual(null);
  });

  test('get package info from composer.lock', () => {
    fs.__setMockFiles({
      [path.join(process.cwd(), 'composer.lock')]: JSON.stringify(composerFile),
    });

    expect(getPackageInfo('behat/transliterator')).toEqual({
      version: 'v1.2.0',
      packageName: 'Behat/Transliterator',
    });
  });
});
