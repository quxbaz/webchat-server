var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))

app.use(express.static(__dirname + '/public'))

// // views is directory for all template files
// app.set('views', __dirname + '/views')
// app.set('view engine', 'ejs')

app.get('/foobar', function(request, response) {
  var result = 'foobar'
  response.send(result)
})

app.listen(app.get('port'), function() {
  console.log('App is running on port', app.get('port'))
})
