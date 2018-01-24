import test from 'ava';
import execa from 'execa';

test('Test --version flag.', async t => {
	const {stdout} = await execa('./cli.js', ['--version']);
	t.true(stdout.length === 0);
});

test('Test general output with --today flag.', async t => {
	const {stdout} = await execa('./cli.js', ['--today']);
	t.true(stdout.length > 5);
});

test('Test general output with --date flag.', async t => {
	const {stdout} = await execa('./cli.js', ['--date', '171224']);
	t.true(stdout.length > 5);
});
