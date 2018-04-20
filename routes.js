const router = require('express').Router()
const shortUrl = require('./ShortUrl.js')
const model = require('./model.js')
const asyncMiddleware = require('./asyncMiddleware')
const currentDomain = require('./config.js').mainDomain

//Define tableName if there is a table else use default 'urlList' 
const table = require('./config.js').table

const tableName = table.length > 0 ? table : 'urlList'

// Redirects the current url to the long url
router.get('/:short_url', asyncMiddleware(async (req, res, next) => {
    //Decode the Short Url to get the id of long_url in DB
    const urlID = shortUrl.decode(req.params.short_url)

    //Query DB to find url
    const { url } = await model.queryTable(tableName, 'id', urlID)

    if (!url) {
        res.status(404).json({errors: {url: "can't be found"}})
    } else {
        //Make sure the url is appended with either https:// or http:// to ensure proper redirect
        const regex = /(https:\/\/)|(http:\/\/)/
        regex.test(url) ? res.redirect(url) : res.redirect("http://".concat(url))
    }
})
)
    
// Returns a short url given a long url
// ASSUMPTION: Requested URL to shorten is always valid
router.post('/shorten', asyncMiddleware(async (req, res, next) => {
    let result 

    if (!req.body.url) {
        return res.status(422).json({errors: {url: "can't be blank"}})
    }

    //Check if the url already exists in database
    const doesExist = await model.queryTable(tableName, 'url',)// req.body.url)
    
    // If it doesn't insert it into the database and get the id back
    if (!doesExist) {
        const { insertId } = await model.insertUrl(tableName, req.body.url)
        result = { id: insertId }
    } else {
        result = doesExist
    }

    const shortenedUrl = currentDomain + shortUrl.encode(result.id)

    return res.status(200).json({shorturl: shortenedUrl})

})
)


//Returns a long url given a short url
router.post('/lengthen', asyncMiddleware(async(req, res, next) => {

    if (!req.body.url) {
        res.status(422).json({errors: {url: "can't be blank"}})
    }

    //Trim the domain from incoming url to allow decoding
    const regex = new RegExp(currentDomain)
    const trimUrl = req.body.url.replace(regex, '')
 
    //Decode the Short Url to get the id of long_url in DB
    const urlID = shortUrl.decode(trimUrl)

    //Query DB to find url
    const { url } = await model.queryTable(tableName, 'id', urlID)

    res.status(200).json({longurl: url})
}))

module.exports = router