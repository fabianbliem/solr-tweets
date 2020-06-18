var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);

app.use(express.static(path.join(__dirname, 'dist')));

http.listen(process.env.PORT || 3000, function () {
    console.log(`listening on port: ${process.env.PORT || '3000'}`);
});