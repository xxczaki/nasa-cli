import test from 'ava';
import execa from 'execa';

test('Test output without arguments', async t => {
	const ret = await execa.shell('node cli.js');
	t.regex(ret.stdout, /Usage/);
});

test('Test --help', async t => {
	const ret = await execa.shell('node cli.js --help');
	t.regex(ret.stdout, /Options/);
});

test('Test --today', async t => {
	const ret = await execa.shell('node cli.js --today');
	t.regex(ret.stdout, /Done/);
});

test('Test --date (picture)', async t => {
	const ret = await execa.shell('node cli.js --date 171224');
	t.regex(ret.stdout, /Done/);
});

test('Test --date (video)', async t => {
	const ret = await execa.shell('node cli.js --date 171220');
	t.regex(ret.stdout, /Today is a video/);
});

test('Test --date without date', async t => {
	const ret = await execa.shell('node cli.js --date');
	t.regex(ret.stdout, /Please provide a valid date!/);
});

test('Test error message', async t => {
	const error = await t.throws(execa.shell('node cli.js --date foo'));
	t.regex(error.message, /Something went wrong/);
});
