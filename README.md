<p align="center">
  <img src="https://i.imgur.com/GNPXJQC.png" href="https://www.nasa.gov/" height="256">
  <h2 align="center">NASA CLI</h2>
  <p align="center">🚀 Download NASA Picture of the Day from your terminal!<p>
  
<p align="center"><a href="https://www.npmjs.com/package/nasa-cli"><img src="https://badge.fury.io/js/nasa-cli.svg" alt="npm Package"></a>  <a href="https://travis-ci.org/xxczaki/nasa-cli"><img src="https://travis-ci.org/xxczaki/nasa-cli.svg?branch=master" alt="Build Status"></a> <a href="https://github.com/sindresorhus/xo"><img src="https://img.shields.io/badge/code_style-XO-5ed9c7.svg" alt="XO Code Style"></a> <a class="badge-align" href="https://www.codacy.com/app/xxczaki/nasa-cli?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=xxczaki/nasa-cli&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/de9b2c83749a49799a39ca6277d3eefc"/></a> 
 <a href='https://github.com/agarrharr/awesome-cli-apps'><img src='https://awesome.re/mentioned-badge.svg' alt='Mentioned in Awesome CLI Apps' /></a>
  </p>
  
<p align="center"><img src="https://i.imgur.com/TGG4tXh.gif" alt="Picture of the Day!"></p>

## Installation 

``` 
npm i -g nasa-cli
```
<a href="https://www.patreon.com/akepinski">
	<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## Usage

``` bash
# Download Picture of the Day

$ nasa -t

# Download Picture of the Day from the specific date

$ nasa -d YYMMDD

# Examples:

$ nasa -t

$ nasa -d 171224
```

## How it works?

It downloads the latest Picture of the Day (or from specific date) from [NASA APOD](https://apod.nasa.gov/apod/) and saves it on your computer (in the directory, where terminal is executed :unicorn:).

## npm Dependencies [![Known Vulnerabilities](https://snyk.io/test/github/xxczaki/nasa-cli/badge.svg)](https://snyk.io/test/github/xxczaki/nasa-cli)

- [chalk](https://www.npmjs.com/package/chalk)
- [cheerio](https://www.npmjs.com/package/cheerio)
- [fs-extra](https://www.npmjs.com/package/fs-extra)
- [got](https://www.npmjs.com/package/got)
- [log-symbols](https://www.npmjs.com/package/log-symbols)
- [log-update](https://www.npmjs.com/package/log-update)
- [ora](https://www.npmjs.com/package/ora)
- [xo](https://www.npmjs.com/package/xo)

## Thanks:

- [NASA APOD :rocket:](https://apod.nasa.gov/apod/) for providing marvelous space photos every day!

## Disclaimer

NASA CLI is not affiliated with National Aeronautics and Space Administration.

## License

MIT © [Antoni Kepinski](https://akepinski.me)

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fxxczaki%2Fnasa-cli.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fxxczaki%2Fnasa-cli?ref=badge_large)



