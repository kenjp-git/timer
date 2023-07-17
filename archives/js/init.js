/**2022/12/05-23:30 */
'use strict'


var body_dom = {
header: `
<h1>Timer</h1>
<div id="ctdn">
2023年まで あと
<span id="days">00</span> 日
<span id="hours">00</span> 時間
<span id="minutes">00</span> 分
<span id="seconds">00</span> 秒
</div>

<nav class="head-nav"></nav>`,
main: `
<div id="cards"></div>`,
footer: `
`,
};

var cards = {};
/** main */
function main() {
    //const body = document.getElementsByTagName('body')[0]
    //const script = document.getElementsByTagName('script')[1]

    /*body.innerHTML = `<header></header><main></main><footer></footer>
    `*/
    //body.innerHTML = null;
    //setDOMof(body, body_dom);

    //loadConfs()
    /*if(configs) { 
        let ul = document.querySelector('#cards ul')
        loadCardsIn(ul) 
    }*/

    /*header(body)
    main(body)
    footer(body)
    */
    //script.nextElementSibling(child)
    //console.log(Object.keys(script))
    //console.log(configs)
    setMainDOM('main.html');
    
}

function setMainDOM(dom_path) {
    let dom = await fetch('./src/tmpl/'+dom_path);
    console.log(dom);
    var body = document.getElementsByTagName('body')[0];
    //body.innerHTML = dom;
}

function setDOMof(body, html) {
    for(var tag in html) {
        let el = document.createElement(tag);
        el.innerHTML = html[tag];
        //console.log(el.innerHTML)
        body.appendChild(el);
    }
}

function loadConfs() {
    window.configs = {};
    let confs_str = localStorage['timer_confs'];
    if(confs_str) {
        configs = JSON.parse(confs_str);
    }
}

function loadCardsIn(el) {
    let timer_cards_str = localStorage['timer_cards'];
    if(timer_cards_str) {
        let cards = JSON.parse(timer_cards_str);
        for(var card_datas in cards) {
            let section = document.createElement('section');
            section.classList.add('card');
            section.innerHTML = cardTemplwith(card_datas);
            el.appendChild(section);
        }
    }
    
}

function cardTemplwith(datas) {
    return `
    <div id="card_${datas.id}" class="card_name">${datas.name}</div>
    <span id="card_${datas.id}_days"></span>
    <span id="card_${datas.id}_hours"></span>
    <span id="card_${datas.id}_mins"></span>
    <span id="card_${datas.id}_secs"></span>
    <div class="card_desc">${minimize_text(datas.desc, 25)}</div>
    <a href="${datas.website}">${datas.website}</a>
    `;
}

function minimize_text(text, len) {
    let min_text;
}

function footer(body) {
    let footer = document.createElement('footer');
    footer.innerHTML
    body.appendChild(footer);
}

var nav_list = [];
function nav(body) {
    let list = new HTMLLIElement();
    return;
}

class StorageManager {
    constructor() {

    }


}

class DateCollections {
    constructor(date_arys) {
        this.dates = date_arys;
    }

    getDate(time) {
        return this.dates[time];
    }

    getAll;
}

class Render {
    constructor(template) {
        this.template = template;

    }

    render(data) {

    }
}

class Creator {
    constructor() {

    }
}

document.addEventListener('DOMContentLoaded', function() {
    main();
});

/* 2022/12/24-22:45 */

function xmas(params) {
    /**moved to MyRecipes  */
}


