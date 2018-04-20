## ShortUrlServer
This is a simple bit.ly like server written in node.js with express and mysql database

To start run `npm install`, `npm start`

### Configuration
There is a config file which you must edit to support your mysql db configuration.

Inside this config file there is also a `mainDomain` which should just be the domain you are hosting this app on.

There is also a `table` string which can be customised if you already have an auto increment table with `id` & `url` in your database

### Assumptions

The main assumption I made was that every url you are sending to be shortened is already valid. 

### Endpoints:

#### Shorten:

`POST /api/shorten`

Example request body:
```JSON
{
  "url": "validurl.com"
}
```

Required fields: `url`

#### Lengthen:

`POST /api/lengthen`

Example request body:
```JSON
{
  "url": "yourdomain.com\b"
}
```

Required fields: `url`

#### Redirect:

`POST /api/:short_url`

Returns a redirect to the original long url
Required params: `short_url`
