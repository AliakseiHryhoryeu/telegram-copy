export default {
    "db": {
        "user": "todo",
        "pass": "oa9bu2WhXafAUA7D",
        "host": "cluster0.afohgnu.mongodb.net",
        "port": '',
        "database": "todo",
        // https://stackoverflow.com/questions/40608669/what-does-authsource-means-in-mongo-database-url
        "authSource": null
    },
    "host": {
        "url": "<server-url>",
        "port": "3000"
    },
    "jwt": {
        "secretOrKey": "secret",
        "expiresIn": 36000000
    },
    "mail":{
        "host": "<smtp-host>",
        "port": "<port>",
        "secure": false,
        "user": "<username>",
        "pass": "<password>"
    }
  }

// "mongodb+srv://<username>:<password>@cluster0.afohgnu.mongodb.net/?retryWrites=true&w=majority"
  
