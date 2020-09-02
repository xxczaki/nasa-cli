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
const youtubeDownload = require('youtube-dl');

const spinner = ora();
const info = chalk.cyan('❯');
const arg = process.argv[2];
const inf = process.argv[3];
const dir = '';

// Help message
if (!arg || arg === '-h' || arg === '--help') {
	console.log(`
 ${chalk.green('NASA CLI')} - Download NASA Picture of the Day from your terminal!

 Usage: ${chalk.cyan('nasa')} ${chalk.magenta('<option>')}

 Options:
  ${chalk.magenta('-t')}   ${chalk.magenta('--today')}     Download Picture of the Day
  ${chalk.magenta('-d')}   ${chalk.magenta('--date')}      Download Picture of the Day from the specific date

 Help:
  ${chalk.magenta('-h')}   ${chalk.magenta('--help')}      Show help message
  ${chalk.magenta('-e')}   ${chalk.magenta('--example')}   Show example message
 `);
	process.exit(0);
}

// Example message
const showExampleMessage = () => {
	console.log(`
 Example:

 Download picture of:

 ${info} 24th December 2017 [24/12/17]
 ${info} 1st January 2000   [01/01/00]

 $ nasa --date ${chalk.green('17')}${chalk.red('12')}${chalk.blue('24')}
 $ nasa --date ${chalk.green('00')}${chalk.red('01')}${chalk.blue('01')}

 Date Format:  YY/MM/DD
		`);
	process.exit(0);
};

if (arg === '-e' || arg === '--example') {
	showExampleMessage();
}

fse.ensureDir(dir, err => {
	if (err) {
		process.exit(1);
	}
});

// Check connection
const checkConnection = () => {
	dns.lookup('apod.nasa.gov', err => {
		if (err) {
			logUpdate(`\n ${logSymbols.error} Please check your Internet Connection! \n`);
			process.exit(1);
		} else {
			logUpdate();
			spinner.text = 'Hacking to NASA servers...';
			spinner.start();
		}
	});
};

const getMediaFromHtml = html => {
	const $ = cheerio.load(html);

	const imageLink = $('img');
	if (imageLink.length > 0) {
		const title = $('center').eq(1).text().split('\n') || $('title').text().split('-');
		const imageName = `${title[1].trim().split(' ').join('-')}.jpg`.replace(/[<>"\/\\|\?*:\/]/g, '');
		const sourceLink = `https://apod.nasa.gov/apod/${imageLink.attr('src')}`;
		return {sourceLink, fileName: imageName, type: 'image'};
	}

	const videos = $('iframe');
	if (videos.length === 0) {
		return;
	}
	const videoSrc = videos.map(function (i, el) {
		return $(this).attr('src');
	}).get();
	const title = $('center').eq(1).text().split('\n') || $('title').text().split('-');
	const videoName = `${title[1].trim().split(' ').join('-')}.mp4`;

	return {sourceLink: videoSrc[0], fileName: videoName, type: 'video'};
};

// Download image
const downloadImage = (imageSource, picture) => {
	const save = fs.createWriteStream(`${dir}${picture}`);

	https.get(imageSource, (res, cb) => {
		res.pipe(save);

		save.on('finish', () => {
			save.close(cb);
			logUpdate(`\n${logSymbols.success} Done ~ ${chalk.dim(`[ ${picture.split('-').join(' ').split('.')[0]} ]`)}\n`);
			spinner.stop();
			save.on('error', () => {
				process.exit(1);
			});
		});
	});
};

// Download Youtube Video
const downloadYoutubeVideo = (videoSource, videoName) => {
	const video = youtubeDownload(videoSource);
	const download = video.pipe(fs.createWriteStream(`${dir}${videoName}`));
	download.on('finish', () => {
		logUpdate(`\n${logSymbols.success} Done ~ Today is a video! ~ ${chalk.dim(`[ ${videoName.split('-').join(' ').split('.')[0]} ]`)}\n`);
		spinner.stop();
		download.on('error', () => {
			process.exit(1);
		});
	});
};

// Error message
const displayError = () => {
	logUpdate(`\n${logSymbols.error} Something went wrong :( Try again later!\n`);
	process.exit(1);
};

// Update
const hacking = () => {
	logUpdate();
	spinner.text = 'Hacked! We are sending you the media...';
};

// Get Media from website response
function getMediaForResponse(res) {
	const {sourceLink, fileName, type} = getMediaFromHtml(res.body);
	if (type === 'image') {
		downloadImage(sourceLink, fileName);
	} else if (type === 'video') {
		downloadYoutubeVideo(sourceLink, fileName);
	}
}

// Today's image
if (arg === '-t' || arg === '--today') {
	checkConnection();
	got('https://apod.nasa.gov/apod/').then(res => {
		hacking();
		getMediaForResponse(res);
	}).catch(error => {
		if (error) {
			displayError();
		}
	});
}

// Image from a specific date
if (arg === '-d' || arg === '--date') {
	if (!inf) {
		console.log(` \n ${logSymbols.warning} Please provide a valid date!\n`);
		console.log('==================================');
		showExampleMessage();
	}
	checkConnection();
	got(`https://apod.nasa.gov/apod/ap${inf}.html`).then(res => {
		hacking();
		getMediaForResponse(res);
	}).catch(error => {
		if (error) {
			console.log(error);
			displayError();
		}
	});
}
