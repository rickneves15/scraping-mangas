import cheerio from 'cheerio'
import axios from 'axios'
import Fs from 'fs'
import Path from 'path'
import https from 'https'
import { XMLHttpRequest } from 'xmlhttprequest'

const BASE_URL = 'https://mangalivre.net/lib/search/series.json'
const search = 'Limit Breaker'

async function performScraping() {
  const { data } = await axios.post(
    BASE_URL,
    {
      search,
    },
    {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-requested-with': 'XMLHttpRequest',
      },
    },
  )

  const folderName = `/mnt/b/Mangas/${search}`
  const imageUrl = data.series[0].cover
  const fileName = 'cover.jpg'

  Fs.mkdirSync(folderName, { recursive: true })
  const file = Fs.createWriteStream(Path.join(folderName, fileName))

  https
    .get(imageUrl, (response) => {
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        console.log('Image downloaded and saved successfully!')
      })
    })
    .on('error', (err) => {
      Fs.unlinkSync(file)
      console.error('Error downloading the image:', err)
    })

  return
  const url = data.series[0].cover
  const path = '/mnt/c/Users/rickn/Downloads'
  const pathResolver = Path.resolve(
    '/mnt/c/Users/rickn/Downloads',
    'images',
    search,
    'cover.jpg',
  )

  Fs.mkdir(
    Path.resolve('/mnt/c/Users/rickn/Downloads', 'images', search),
    (err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('Folder created successfully!')
      }
    },
  )

  const writer = Fs.createWriteStream(pathResolver)

  console.log(pathResolver)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })

  // const $ = cheerio.load(response.data)
  // $('.tab-content-wrap')
  //   .find(".c-tabs-item__content")
  //   .each((index, element) => {
  //     const mangaURL = $(element).find('.post-title a').attr("href")
  //     console.log(mangaURL)
  //   })
}

performScraping()
