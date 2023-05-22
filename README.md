# MisjaTravel Scraper
This project is a web scraper built with JavaScript and Selenium WebDriver to extract travel offers from the MisjaTravel website and compare prices for different departure dates. It uses the ChromeDriver for automating the Chrome browser.

## Prerequisites
Before running the scraper, make sure you have the following software installed:

- Node.js
- Chrome browser
- ChromeDriver

## Installation
Clone the repository:

`git clone https://github.com/your-username/misjatravel-scraper.git`

### Install the dependencies:

`cd misjatravel-scraper`
`npm install`


### Set up ChromeDriver:

Download the appropriate version of ChromeDriver from the official website: ChromeDriver Downloads
Extract the downloaded archive and place the chromedriver executable in a directory included in your system's PATH.
Usage
Open a terminal and navigate to the project directory.

## Run the scraper:

`node main.js`

The scraper will launch a Chrome browser and start extracting travel offers from the MisjaTravel website. It will compare prices for different departure dates and generate a report.

Once the scraper finishes, a report file will be saved in the raporty directory with the name Raport MT YYYY-MM-DD hh:mm.txt, where YYYY-MM-DD represents the current date and hh:mm represents the current time.