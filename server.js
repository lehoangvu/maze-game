var express = require('express');
var app = express();
var request = require("request")


app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https' && process.env.APP_ENV && process.env.APP_ENV === 'production')
    res.redirect('https://' +req.get('host') + req.url);
  else
    next() /* Continue to other routes if we're not redirecting */
})
app.use(
    "/", //the URL throught which you want to access to you static content
    express.static(__dirname) //where your static content is located in your filesystem
);
app.route('/auth').get(function (req, res) {
    res.sendfile(__dirname + '/auth.html');
});

// app.route('/:playlistId').get(function (req, res) {
//     res.sendfile(__dirname + '/index.html');
// });

// app.route('/:playlistId/:songId').get(function (req, res) {
//     res.sendfile(__dirname + '/index.html');
// });
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.route('/pharser').post(function (req, res) {
    request({
        url: req.body.request,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            res.setHeader('Content-Type', 'application/json');
            res.send(body); // Print the json response
        }
    })
});


app.listen(process.env.PORT || 5000); //the port you want to use
