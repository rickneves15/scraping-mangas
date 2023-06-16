/* eslint-disable */
import puppeteer from 'puppeteer'

const BASE_URL1 =
  'https://mangalivre.net/ler/rankers-return-redice-studio/online/320713/1';
const BASE_URL2 =
  'https://mangalivre.net/ler/rankers-return-redice-studio/online/320714/2';

// const search = 'Limit Breaker'
const getToken = async (url:string) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  
  // @ts-ignore
  const lastChapterText = await page.$eval('ul.list-of-chapters li .chapter-info .chapter-info-text .cap-text', els => els.innerText);

  const chapterNumber = parseInt(lastChapterText.match(/\d+/g))

  await browser.close()

  return chapterNumber

}
  (async () => {
    const token = await getToken('https://mangalivre.net/manga/990k-ex-life-hunter/12780');
    console.log('token:', token)
  })()