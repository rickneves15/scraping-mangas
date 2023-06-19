import puppeteer from 'puppeteer'
import SeriesFilter from '../../filters/SeriesFilter'
import MangaLivreResource from '../../resource/MangaLivre'
import { getRequest, postRequest } from './../../utils/request'
import { Serie } from './../../utils/types/models'
import { Service } from './../../utils/types/services'
import {
  BASE_CHAPTERS_LIST,
  BASE_IMAGES_CHAPTER,
  SEARCH_URL,
} from './constants'
import fs from 'fs'
import path from 'path'
import https from 'https'
import archiver from 'archiver'
import {
  MLSerieChapter,
  MLUrlImagesChapter,
} from '../../utils/types/sources/MangaLivre/type'

class MangaLivreService implements Service {
  async getSeries(search: string): Promise<Serie[] | any> {
    try {
      const response = await postRequest({
        url: SEARCH_URL,
        data: {
          search,
        },
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-requested-with': 'XMLHttpRequest',
        },
      })

      if (!response.series) {
        return []
      }

      const seriesFilter = new SeriesFilter(response.series, search)
      const mangaLivreResource = new MangaLivreResource()
      const series: Serie[] = mangaLivreResource.series(seriesFilter.handle())

      return series
    } catch (error) {
      console.error('Error:', error)
    }
  }

  async getLinkChapters(url: string): Promise<MLSerieChapter[]> {
    const response = await getRequest({
      url,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-requested-with': 'XMLHttpRequest',
      },
    })

    return response.chapters
  }

  async getUrlImagesChapter(url: string): Promise<MLUrlImagesChapter[]> {
    const response = await getRequest({
      url,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-requested-with': 'XMLHttpRequest',
      },
    })

    return response.images
  }

  async getChapters(serieId: number, url: string): Promise<MLSerieChapter[]> {
    let chapters: MLSerieChapter[] = []
    const totalPages = await this.getTotalPages(url)

    for (let page = 1; page <= totalPages; page++) {
      const paginationUrl = `${BASE_CHAPTERS_LIST}?id_serie=${serieId}&page=${page}`

      const linksChapters = await this.getLinkChapters(paginationUrl)
      chapters = [...linksChapters, ...chapters]
    }

    return chapters
  }

  async getTotalChapters(url: string) {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.goto(url)

    const lastChapterText = await page.$eval(
      'ul.list-of-chapters li .chapter-info .chapter-info-text .cap-text',
      // @ts-ignore
      (els) => els.innerText,
    )

    const chapterNumber = parseInt(lastChapterText.match(/\d+/g))

    await browser.close()

    return chapterNumber
  }

  async getTotalPages(url: string): Promise<number> {
    const totalChapters = await this.getTotalChapters(url)

    if (!totalChapters) return 0

    return Math.ceil(totalChapters / 30)
  }

  async getToken(url: string) {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.goto(url)

    const READER_TOKEN = await page.evaluate(() => {
      // @ts-ignore
      return window.READER_TOKEN
    })

    await browser.close()

    return READER_TOKEN
  }

  saveImage(
    folderName: string,
    nameImage: number | string,
    imageUrl: string,
  ): void {
    fs.mkdirSync(folderName, { recursive: true })
    const fileExtension = imageUrl.match(/\.([^.?#]+)(\?|$)/)?.[1]
    const fileName = `${nameImage}.${fileExtension}`
    const file = fs.createWriteStream(path.join(folderName, fileName))

    https
      .get(imageUrl, (response) => {
        response.pipe(file)
        file.on('finish', () => {
          file.close()
          // console.log('Image downloaded and saved successfully!')
        })
      })
      .on('error', (err) => {
        // @ts-ignore
        fs.unlinkSync(file)
        console.error('Error downloading the image:', err)
      })
  }

  compressFolder(folderName: string): void {
    const output = fs.createWriteStream(`${folderName}.cbr`)
    const archive = archiver('zip')

    output.on('close', () => {
      fs.rmSync(folderName, { recursive: true, force: true })
    })

    archive.pipe(output)
    archive.directory(folderName, false)
    archive.finalize()
  }

  async download(
    serie: Serie,
    listChapters: MLSerieChapter[],
    chapterSelected: any,
  ) {
    if (!listChapters) {
      console.info('Serie not have chapters.')
      return
    }

    for (const linksChapter of listChapters) {
      const folderName = `${process.env.BASE_PATH}/${serie.name}/${linksChapter.number}`
      const serieChapterId =
        // @ts-ignore
        linksChapter.releases[Object.keys(linksChapter.releases)[0]]?.id_release

      if (serieChapterId) {
        const urlImagesChapter = await this.getUrlImagesChapter(
          `${BASE_IMAGES_CHAPTER}/${serieChapterId}.json`,
        )

        for (let index = 0; index < urlImagesChapter.length; index++) {
          this.saveImage(folderName, index, urlImagesChapter[index].legacy)
        }
        this.compressFolder(folderName)
      }

      console.info(`Downloaded Chapter ${linksChapter.number}`)
      if (chapterSelected) {
        if (Number(linksChapter.number) <= Number(chapterSelected)) {
          break
        }
      }
    }
    console.info(
      `________________________________________________________________`,
    )
    console.info(`Serie '${serie.name}' Downloaded`)
  }
}

export default MangaLivreService
