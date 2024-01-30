require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");

const authenticate = async () => {
  const outputDirectory = "output";
  // Create the "output" directory if it doesn't exist
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-gpu", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  const username = process.env.USER;
  const password = process.env.PW;

  await page.goto("https://www.instagram.com/");
  await page.waitForSelector('input[name="username"]');
  await page.type('input[name="username"]', username);
  await page.type('input[name="password"]', password);
  await page.click('button[type="submit"]');

  // Wait for navigation to complete
  await page.waitForNavigation({ waitUntil: "domcontentloaded" });

  await page.screenshot({ path: `${outputDirectory}/screenshot.png` });

  await page.close();
  await browser.close();
};

authenticate();
