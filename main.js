const { By, Builder, until } = require("selenium-webdriver");
require("chromedriver");
const fs = require("fs");

let reportString = "";
let numberOfTerms = 0;
let scrapeUrl =
  "https://www.misjatravel.pl/?country-phrase%5B%5D=&search=offer&departure_city=&start_date=&end_date=&ppp=999";
const currentDate = new Date();
currentDate.setUTCHours(currentDate.getUTCHours() + 2); // Add 2 hours for GMT+2

const day = currentDate.getUTCDate().toString().padStart(2, "0");
const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, "0"); // Month is zero-based
const year = currentDate.getUTCFullYear().toString();
const hours = currentDate.getUTCHours().toString().padStart(2, "0");
const minutes = currentDate.getUTCMinutes().toString().padStart(2, "0");

const fileName = `Raport MT ${day}-${month}-${year} ${hours}:${minutes}`;

async function closeCookie(driver) {
  try {
    await driver.wait(
      until.elementLocated(By.xpath('//*[@id="CybotCookiebotDialog"]')),
      5000
    );
    let allowAllButton = await driver.findElement(
      By.xpath(
        '//*[@id="CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"]'
      )
    );
    await allowAllButton.click();
  } catch (err) {
    console.log("no cookie");
    return;
  }
}

async function getOffers() {
  let links = [];

  fs.mkdir("raporty", () => {
    return;
  });

  let driver = await new Builder().forBrowser("chrome").build();
  try {
    await driver.get(scrapeUrl);

    await closeCookie(driver);

    // fing //*[@id="ajax-container-r"]
    let offers = await driver.wait(
      until.elementLocated(By.css("#ajax-container-r")),
      1000
    );
    // get all children of offers
    let offersChildren = await offers.findElements(By.className("card-body"));
    // get all links from offers children
    for (let i = 0; i < offersChildren.length; i++) {
      let link = await offersChildren[i].findElement(By.css("a"));
      let price = await offersChildren[i]
        .findElement(By.className("card-price-number-actual"))
        .getText();
      links.push({
        link: await link.getAttribute("href"),
        price: price.replace(" zł", ""),
      });
    }
    console.log("Znaleziono " + links.length + " ofert");

    reportString += `Znaleziono ${links.length} ofert. Rozpoczynanie sprawdzania.\n`;
  } catch (err) {
    console.log(err);
    driver.quit();
  } finally {
    compareOffers(driver, links);
  }
}

async function compareOffers(driver, links) {
  try {
    // loop through all links
    for (let i = 0; i < links.length; i++) {
      await driver.get(links[i].link);
      let singleOffers = {};

      let cardOffers = await driver.wait(
        until.elementsLocated(By.className("card--term-simple")),
        10000
      );
      let tripName = await driver
        .findElement(By.className("hero-title"))
        .getText();
      await driver.sleep(1000);

      // loop through all offers on a trip page and get their price and sykon url
      for (let i = 0; i < cardOffers.length; i++) {
        let date = await cardOffers[i]
          .findElement(By.className("card-term-header"))
          .getAttribute("innerHTML");
        date = date.split("<")[0].trim();
        let price = await cardOffers[i]
          .findElement(By.className("card-price-number-actual"))
          .getAttribute("innerHTML");
        price = price.replace(" zł", "");
        price = price.trim();
        let formUrl = await cardOffers[i]
          .findElement(By.className("btn-rounded"))
          .getAttribute("data-form-url");
        // add to single object
        singleOffers[date] = {
          price: price,
          formUrl: formUrl,
          date: date,
          name: tripName,
        };
      }

      console.log(
        "Sprawdzanie " +
          Object.keys(singleOffers).length +
          " ofert dla " +
          tripName
      );
      reportString += `--------------\n${tripName} (${Object.keys(
        singleOffers
      )} terminów)\n${links[i].link}\n--------------\n`;

      // SYKON LOOP

      // loop through all trips and get price for each departure
      for (let key of Object.keys(singleOffers)) {
        let lowestPrice = 99999999;

        await driver.get(singleOffers[key].formUrl); // redirect

        try {
          selectDepartures = await driver.wait(
            until.elementLocated(By.id("s_busstop")),
            4000
          );

          // get all departure places (select options)
          let optionsDepartures = await selectDepartures.findElements(
            By.css("option")
          );

          console.log(
            `[] Termin ${singleOffers[key].date} - Ilosc odlotow: ${optionsDepartures.length}. Najnizsza wyświetlana cena: ${singleOffers[key].price}zł`
          );
          reportString += `[] Termin ${singleOffers[key].date} - Ilosc odlotow: ${optionsDepartures.length}. Najnizsza wyświetlana cena: ${singleOffers[key].price}zł\n`;

          for (let i = 1; i < optionsDepartures.length; i++) {
            // find new select element
            let localselect = await driver.wait(
              until.elementLocated(By.id("s_busstop")),
              4000
            );
            // get all departure places (select options)
            let localoptions = await localselect.findElements(By.css("option"));
            await localselect.click();
            await driver.sleep(300);
            await localoptions[i].click();
            let price = await driver.wait(
              until.elementLocated(
                By.xpath(
                  '//*[@id="form_names"]/div[1]/div[4]/div[2]/child::*[1]'
                )
              ),
              10000
            );
            await driver.sleep(500);
            price = await price.getAttribute("innerHTML");
            if (price < lowestPrice) {
              lowestPrice = price;
            }
          }

          if (lowestPrice < singleOffers[key].price) {
            console.log(
              ` └─ [!!!] ${lowestPrice}zł - \x1b[31mCena nizsza o ${
                singleOffers[key].price - lowestPrice
              }zł\x1b[0m`
            );
            reportString += ` └─ [!!!] ${lowestPrice}zł - CENA NIŻSZA O ${
              singleOffers[key].price - lowestPrice
            }ZŁ\n`;
          } else {
            console.log(
              ` └─  Najnizsza cena: ${singleOffers[key].price}zł - \x1b[32mCena OK\x1b[0m`
            );
          }
        } catch (err) {
          console.log(err);
          console.log("Error parsing data. Skipping to the next index...");
          reportString += `[] Termin ${singleOffers[key].date} - Oferta nieaktualna...\n`;
        } finally {
          numberOfTerms++;
        }
      }
    }
  } catch (err) {
    console.log(err);
  } finally {
    await driver.quit();
    console.log(
      "\nZakończono sprawdzanie. Pomyślnie sprawdzono " +
        numberOfTerms +
        " terminów"
    );
    reportString += `\nZakończono sprawdzanie. Pomyślnie sprawdzono ${numberOfTerms} terminów\n`;
    fs.writeFile(`raporty/${fileName}.txt`, reportString, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      }
    });
  }
}

getOffers();
