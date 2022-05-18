/* eslint-disable linebreak-style */
const axios = require('axios')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const schedule = require('node-schedule')

class CafeArticleCrawler {
    /**
   * @typedef Article
   * @property {string} name
   * @property {string} href
   * @property {string} title
   * @property {string} article
   */

    #cafeLink = ''
    #articleListLink = ''
    /** @type {Article[]} */
    #articles = []
    #loading = true

    /**
   * @param {string} articleListLink 
   */
    constructor(articleListLink) {
        this.#cafeLink = articleListLink.split('?')[0]
        this.#articleListLink = articleListLink
        this.#articles = []

        this.#init()
    }

    async #init() {
        await this.#initArticleList()
        this.#loading = false
    }

    /**
   * @param {string} link 
   */
    async #getHtml(link) {
        let html = await axios.get(
            link,
            {responseType: 'arraybuffer', responseEncoding: 'binary'}
        )
        html = iconv.decode(Buffer.from(html.data), 'KSC5601')
        return cheerio.load(html)
    }

    async #initArticleList() {
        const $ = await this.#getHtml(this.#articleListLink)
  
        const listEls = $('div.article-board').last().find('table > tbody > tr .article')
        const listElArr = listEls.toArray()

        const names = listEls.text().split('\n').map(v => v.trim()).filter(v => v.length > 0)

        for (let i = 0; i < listElArr.length; i++) {
            const itemEl = listElArr[i]
            const href = itemEl ? this.#cafeLink + itemEl.attribs.href : ''
            const article = await this.#getArticle(href)

            this.#articles.push({
                name: names[i],
                href,
                title: article.title,
                article: article.article
            })
        }
    }

    /**
   * @param {string} herf 
   */
    async #getArticle(link) {
        if (!link) return {
            title: '',
            article: ''
        }

        const $ = await this.#getHtml(link)

        const title = $('#spiButton').attr('data-title') ?? ''
    
        const rawArticle = $('.se-main-container').text()
        const article = rawArticle ? rawArticle.trim() : ''
    
        return { title, article }
    }

    /**
   * @returns {Promise<boolean>}


   */
    async #waitLoading() {
        if (!this.#loading) {
            return true
        }
        return await new Promise((res) => {
            let looper = setInterval(() => {
                if (this.#loading) {
                    return
                } else {
                    res(true)
                    clearInterval(looper)
                }
            }, 1000)
        })
    }

    async getArticleList() {
        await this.#waitLoading()
        return this.#articles.map(item => ({...item}))
    }

    /**
   * @param {number} idx 
   * @returns {Promise<Article>}


   */
    async getArticle(idx) {
        await this.#waitLoading()
        const article = this.#articles[idx]
        return article ?? {
            article: '',
            href: '',
            name: '',
            title: ''
        }
    }
}

// Pre-generate elements
const cAnnounceEl = document.getElementById('c_announce')
const mAnnounceEl = document.getElementById('m_announce')
for (let i = 0; i < 5; i++) {
    const el = document.createElement('div')
    el.innerText = 'loading...'
    cAnnounceEl.appendChild(el)
}
for (let i = 0; i < 5; i++) {
    const el = document.createElement('div')
    el.innerText = 'loading...'
    mAnnounceEl.appendChild(el)
}


async function updateList() {
    const commonAnnounceList = new CafeArticleCrawler('https://cafe.naver.com/ArticleList.nhn?search.clubid=30239635&search.menuid=86&search.boardtype=L')
    const maintainanceAnnounceList = new CafeArticleCrawler('https://cafe.naver.com/ArticleList.nhn?search.clubid=30239635&search.menuid=48&search.boardtype=L')
    
    for (let i = 0; i < 5; i++) {
        const article = await commonAnnounceList.getArticle(i)
        console.log(article)
        cAnnounceEl.children[i].innerText = article.name
    }

    for (let i = 0; i < 5; i++) {
        const article = await maintainanceAnnounceList.getArticle(i)
        console.log(article)
        mAnnounceEl.children[i].innerText = article.name
    }
}

updateList()
setInterval(updateList, 5*60_000)

document.getElementById('announce_button').onclick = (e) => {
    // eslint-disable-next-line quotes
    alert(`죄송합니다!\n현재 기능은 개발중입니다!`)
}