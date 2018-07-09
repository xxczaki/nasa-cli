#!/usr/bin/env node

'use strict';

const https = require('https');
const fs = require('fs');
const dns = require('dns');
const fse = require('fs-extra');
const got = require('got');
const chalk = require('chalk');
const cheerio = require('cheerio');
const logUpdate = require('log-update');
const logSymbols = require('log-symbols');
const ora = require('ora');

const spinner = ora();
const info = chalk.cyan('❯'); // Because 'logSymbols.info' on Windows looks like shit
const arg = process.argv[2];
const inf = process.argv[3];
const dir = ``; // Specify the directory where the image should be downloaded.

if (!arg || arg === '-h' || arg === '--help') { // Display help message
	console.log(`
 ${chalk.green('NASA CLI')} - Download NASA Picture of the Day from your terminal!

 Usage: ${chalk.cyan('nasa')} ${chalk.magenta('<option>')}

 Options:
  ${chalk.magenta('-t')}   ${chalk.magenta('--today')}     Download Picture of the Day
  ${chalk.magenta('-d')}   ${chalk.magenta('--date')}      Download Picture of the Dat from the specific date

 Help:
  ${chalk.magenta('-h')}   ${chalk.magenta('--help')}   Show help message
  ${chalk.magenta('-e')}   ${chalk.magenta('--example')}   Show example message
 `);
	process.exit(1);
}

const showExampleMessage = () => { // Display example message
	console.log(`
 Example:

 Download picture of:

 ${info} 24th December 2017 [24/12/17]
 ${info} 1st January 2000   [01/01/00]

 $ nasa --date ${chalk.green('17')}${chalk.red('12')}${chalk.blue('24')}
 $ nasa --date ${chalk.green('00')}${chalk.red('01')}${chalk.blue('01')}

 Date Format:  YY/MM/DD
		`);
	process.exit(1);
};

if (arg === '-e' || arg === '--example') {
	showExampleMessage();
}

fse.ensureDir(dir, err => {
	if (err) {
		process.exit(1);
	}
});

const checkConnection = () => { // Check internet connection
	dns.lookup('apod.nasa.gov', err => {
		if (err) {
			logUpdate(`\n ${logSymbols.error} Please check your Internet Connection! \n`);
			process.exit(1);
		} else { // If internet connection is good, then start searching for image
			logUpdate();
			spinner.text = `Hacking to NASA servers...`;
			spinner.start();
		}
	});
};

const linkSplitter = data => {
	return data.split('<a href="image')[1].split('"')[0]; // Search for picture
};

const downloadImage = (imageSource, picture) => { // Download picture
	const save = fs.createWriteStream(`${dir}${picture}`);

	https.get(imageSource, (res, cb) => {
		res.pipe(save);

		save.on('finish', () => {
			save.close(cb);
			logUpdate(`\n${logSymbols.success} Done ~ ${chalk.dim(`[ ${picture.split('-').join(' ').split('.')[0]} ]`)}\n`); // Notify the user if the download was successful
			spinner.stop();
			save.on('error', () => {
				process.exit(1);
			});
		});
	});
};

const displayError = () => {
	logUpdate(`\n${logSymbols.error} Something went wrong :( Try again later!\n`); // Display error message, when something went wrong
	process.exit(1);
};

const hacking = () => {
	logUpdate();
	spinner.text = 'Hacked! We are sending you the image...'; // Notify the user, while downloading image
};

if (arg === '-t' || arg === '--today') { // Today argument
	checkConnection(); // Check connection
	got('https://apod.nasa.gov/apod/').then(res => { // Get image url
		hacking();
		const $ = cheerio.load(res.body);
		const aboutImage = `${$('center').eq(1).text().split('\n')[1].trim().split(' ').join('-')}.jpg`;
		const link = linkSplitter(res.body);
		const fullUrl = `https://apod.nasa.gov/apod/image${link}`; // Get full image url

		downloadImage(fullUrl, aboutImage); // Download image
	}).catch(err => { // Catch Error
		if (err) {
			displayError(); // Display error message
		}
	});
}

if (arg === '-d' || arg === '--date') { // Specific date argument
	if (!inf) {
		console.log(` \n ${logSymbols.warning} Please provide a valid date!\n`); // Inform user if the date is invalid
		console.log('==================================');
		showExampleMessage();
	}
	checkConnection(); // Check connection
	got(`https://apod.nasa.gov/apod/ap${inf}.html`).then(res => { // Get image url
		hacking();
		const $ = cheerio.load(res.body);
		const link = linkSplitter(res.body);
		const imageName = `${$('title').text().split('-')[1].trim().split(' ').join('-')}.jpg`; // Get image name
		const sourceLink = `https://apod.nasa.gov/apod/image${link}`; // Get source link

		downloadImage(sourceLink, imageName); // Download image
	}).catch(err => {
		if (err) {
			displayError(); // Display error message
		}
	});
}
