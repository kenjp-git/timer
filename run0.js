/**2022/12/06/19:51 */

const http = require('http')
const fs = require('fs')
const qs = require('querystring')

const port = 2525
const index = 'index.html'
//var index = fs.readFileSync('./index.html', 'utf-8')

var server = http.createServer(main)
server.listen(port, function() {
    console.log("localhost:2525")
})

function main(req, res) {
    let path = req.url
    if(fs.existsSync('.'+path)) { 
        console.log(path)
        let mime = fileMIME(path)
        console.log(mime)
        let file = getResources(path)
        res.writeHead(200, {"Content-Type":"text/html"})
        res.write(file)
        res.end()
    }else {
        console.log('no path: '+path)
        //res.write('404.html')
        res.end()
    }
}

function getResources(path) {
    let resource
    switch(path) {
        case '/':
            resource= fs.readFileSync('.' + path + index )
            break
        default:
            resource = fs.readFileSync('.' + path)
            break
    }
    return resource
}

function fileMIME(path) {
    let mime
    let dot = path.indexOf('.')
    let ext = path.subsstring(dot)
    switch(ext) {
        case 'html','css','js':
            mime = 'text/' + ext
            break
        case 'bmp','jpg','png','gif':
            mime = 'image/' + ext
            break
        default:
            mime = 'null'
    }
    return dot
}