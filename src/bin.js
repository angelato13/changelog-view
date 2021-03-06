import minimist from 'minimist';
import logger from './logger';
import changelogViewPackage from '../package.json';
import packageListChangeLog from './';

const args = minimist(process.argv.slice(2), {
  alias: {
    help: 'h',
    verbose: 'v',
  },
});

if (args.help || args._.length === 0) {
  // If they didn't ask for help, then this is not a "success"
  const log = args.help ? console.log : console.error;
  log(
    'Usage: changelog-view <package@currentVersion> [<package@currentVersion> ...]'
  );
  log(`Current version: ${changelogViewPackage.version}`);
  log('');
  log('  See changelogs for your dependencies.');
  log('');
  log('Options:');
  log('');
  log('  -h, --help     Display this usage info');
  log('  -v, --verbose  Display debug informations');
  process.exit(args.help ? 0 : 1);
} else {
  go(args);
}

function go(args) {
  if (args.verbose) {
    logger.setLogLevel(args.verbose);
  }
  packageListChangeLog(args._);
}
