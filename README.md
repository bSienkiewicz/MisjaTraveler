# MisjaTravel Scraper
This project is a web scraper built with JavaScript and Selenium WebDriver to extract travel offers from the MisjaTravel website and compare prices for different departure dates. It uses the ChromeDriver for automating the Chrome browser.

It was created for a testing purpose only. I do not encourage the use of this software for any other purpose.

## Prerequisites
Before running the scraper, make sure you have the following software installed:

- Node.js
- Chrome browser
- ChromeDriver

## Installation
Clone the repository:

`git clone https://github.com/bSienkiewicz/MisjaTraveler.git`

### Install the dependencies:

`cd MisjaTraveler`
`npm install`


### Set up ChromeDriver:

Download the appropriate version of ChromeDriver from the official website: 
Extract the downloaded archive and place the chromedriver executable in a directory included in your system's PATH.


## Usage
1. Open a terminal and navigate to the project directory.
2. Run the scraper: `node main.js`
3. The scraper will launch a Chrome browser and start extracting travel offers from the MisjaTravel website. It will compare prices for different departure dates and generate a report.
4. Once the scraper finishes, a report file will be saved in the raporty directory with the name Raport MT YYYY-MM-DD hh:mm.txt, where YYYY-MM-DD represents the current date and hh:mm represents the current time.