/**2023/01/30/17:38 */

'use strict';

var http = require('http');
var fs = require('fs');
var qs = require('querystring');
const src = '/src/tmplt';
const port = 2525;

var server = http.createServer(main);
server.listen(port, ()=>{
    console.log('localhost:2525');
});

function main(req,res) {
    let path = req.url; 
    let source = getSource(path);
    console.log(path);
    let source_mime_type = sourceMimeType(path);
    res.writeHead(200, {'Content-Type':source_mime_type});
    res.end(source);
}

function getSource(path) {
    let reltv_path;
    if(path.startsWith('.')) {
        let new_path = path.substring(1);
        console.log(new_path);
        reltv_path = '.'+src+new_path;
    }else {
        reltv_path = '.'+path;   
    }
    var source;
    if(fs.existsSync(reltv_path)) {
        if(path == '/') {
            source = fs.readFileSync('./index.html', 'utf-8');
        }else {
            source = fs.readFileSync(reltv_path, 'utf-8');
        }
    }else {
        source = null; //'no source';
    }
    return source;
}

function sourceMimeType(path) {
    let type = 'text/plain';
    if(path == '/') {
        type = 'text/html';        
    }else {
        let dot = path.indexOf('.');
        let ext = path.substring(dot+1);
        switch (ext) {
            case 'html': case 'css': case 'js':
                type = 'text/'+ext;
                break;
            case 'jpg': case 'png': case 'bmp': case 'ico':
                type = 'img/'+ext;
                break;
        }
    }
    //console.log(type);
    return type;
}