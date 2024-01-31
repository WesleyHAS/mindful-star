require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const cookiesPath = "cookies.txt";

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
  // If the cookies file exists, read the cookies.
  const previousSession = fs.existsSync(cookiesPath);
  if (previousSession) {
    const content = fs.readFileSync(cookiesPath);
    const cookiesArr = JSON.parse(content);
    if (cookiesArr.length !== 0) {
      for (let cookie of cookiesArr) {
        await page.setCookie(cookie);
      }
      console.log("Session has been loaded in the browser");
    }
  }

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

  // Write Cookies
  const cookiesObject = await page.cookies();
  fs.writeFileSync(cookiesPath, JSON.stringify(cookiesObject));
  console.log("Session has been saved to " + cookiesPath);

  await page.close();
  await browser.close();
};

authenticate();
