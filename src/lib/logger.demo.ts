import { format, logger } from './logger.ts';

console.log(
	'entity formatting:',
	format.name('name'),
	format.path('path'),
	format.cmd('cmd'),
);

logger.error('simple error');
logger.error('complex error', {
	aside: 'some other info',
});
logger.error('complex error', {
	prompt: 'a suggested fix',
	aside: 'some other info',
});
logger.error('complex error', {
	prompt: 'a suggested fix',
});

logger.info('simple info');
logger.info('complex info', { aside: 'some other info' });

logger.log('simple log');
logger.log('complex log', { aside: 'some other info' });

logger.quiet('simple quiet');
logger.quiet('complex quiet', { aside: 'some other info' });

logger.success('simple success');
logger.success('complex success', { aside: 'some other info' });

logger.alert('simple alert');
logger.alert('complex alert', {
	aside: 'some other info',
});
logger.alert('complex alert', {
	prompt: 'a suggested fix',
	aside: 'some other info',
});
logger.alert('complex alert', {
	prompt: 'a suggested fix',
});

logger.help('helpful info');
