# MisjaTravel Scraper
MisjaTraveler is a tool I developed to identify and report discrepancies in flight pricing on MisjaTravel.pl. It's purpose was to address the issue of inconsistent flight prices due to occasional failures in updating the internal database with the latest prices from an external flights database. 

By automating the process of price comparison, MisjaTraveler helped finding flights with price differences, which ultimately lead to resolution of the issue.

## Prerequisites
Before running the scraper, make sure you have the following software installed:

- Node.js
- Chrome browser
- ChromeDriver

## Setup and Installation
1. Clone the Repository:
```
git clone https://github.com/bSienkiewicz/MisjaTraveler.git
cd misjatraveler`
```

2. Install the dependencies:
```
npm i
```

3. Run the script:
```
node main.js
```

## Usage
1. Open a terminal and navigate to the project directory.
2. Run the scraper: `node main.js`
3. The scraper will launch a Chrome browser and start extracting travel offers from the MisjaTravel website. It will compare prices for different departure dates and generate a report.
4. Once the scraper finishes, a report file will be saved in the raporty directory with the name Raport MT YYYY-MM-DD hh:mm.txt, where YYYY-MM-DD represents the current date and hh:mm represents the current time.
