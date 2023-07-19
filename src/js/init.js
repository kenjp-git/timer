/**2023/02/01-11:33 */
/**2023/02/28 02:44:01 */
'use strict';

/*function main() {
    setMainDOM('/src/tmplt/main.html');
    //var mngr = new ComponentManager('/components');
    //mngr.setAllComponentIn();
    //console.log(this);//undefined
    //new Timer(new Date(2023, 2, 5)).run();
    let birth = new TimeCard(new Date(2023, 2, 5), "");
    birth.runTimer();
}*/

function setMainDOM(path) {
    let msgr = new Dialog();
    let body = document.getElementsByTagName('body')[0];
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4) {
            if(xhr.status == 200) {
                body.innerHTML = xhr.response;
            }else{
                body.innerHTML = "cannot get contents";
            }
        }else {
            msgr.show('waiting!');
        }
    };
    xhr.open('GET', path, true);
    xhr.send(null);
}

class CardCollection {

}

class CardStorage {
    constructor() {

    }

    save() {

    }
}

class ComponentManager {
    constructor(source_path) {
        this.path = source_path;
        this.target; this.source;
        document.body.querySelector('script').remove();
    }
    
    activateScript(target) {
        let old_script = target.lastElementChild;
        if(old_script.tagName == 'SCRIPT') {
            let new_script = document.createElement('script');
            let src = old_script.getAttribute('src');
            if(src == null) {
                new_script.textContent = old_script.textContent;
                target.replaceChild(new_script, old_script);
            }else {
                new_script.setAttribute(src);
                target.replaceChild(new_script, old_script);
            }
            new_script.remove();
        }
    }
    
    addComponent(source_name, target = null) {
        //this.initialize$();
        this.source = source_name;
        if(target == null) {
            this.target = document.querySelectorAll(`[${source_name}]`);
        }else {
            this.target = document.querySelectorAll(target);
        }

        let path = this.path + source_name + '.html';
        let own = this;
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    for(let c=0,len=own.target.length;c<len;c++) {
                        own.target[c].setAttributeNode(document.createAttribute(source_name));
                        own.target[c].appendChild(own.buildFragment(xhr.response));
                    }
                    //console.log(own.target);
                    //own.activateScript(own.target);
                    //own.target = null;
                }
            }else {
                own.target.innerHTML = 'waiting';
            }
            //return own.target;
        };
        xhr.open('GET', path, true);
        xhr.send(null);
        //delete this;
        return own;
    }

    buildFragment(response) {
        let div = document.createElement('div');
        div.innerHTML = response;//console.log(div.children);
        let div_elms = div.childNodes;
        //console.log(this.source+':');
        //console.log(div_elms);

        let fragment = document.createDocumentFragment();
        //let fragment_elms = fragment.children;
        for(let n=0,len=div_elms.length; n<len; n++){
            let current_elm = div_elms[n];
            if(current_elm.nodeValue == '\n') {
                //console.log(current_elm.nodeValue);
                continue;
            }else if(current_elm.nodeType == 3) {
                let node = document.createTextNode(current_elm.nodeValue.trim());
                fragment.appendChild(node);
            }else if(current_elm.nodeType == 1) {
                let tag = current_elm.tagName;
                let attrs = current_elm.attributes;
                
                let new_elm = document.createElement(tag);
                //new_elm.attributes = attrs;
                for(let m=0,len=attrs.length; m<len; m++) {
                    let node = attrs[m].cloneNode(true);
                    new_elm.setAttributeNodeNS(node);
                }
    
                if(tag == 'SCRIPT') {
                    let src = current_elm.getAttribute('src');
                    if(src == null) {
                        new_elm.innerHTML = `
                            try {
                            //var orig = $;
                            function $(attr) {
                                let elms = parent.querySelectorAll('script')[0]
                                .parentElement
                                .querySelectorAll(\`[\${attr}]\`);
                                for(let elm of elms) {
                                    //elm.prototype = new Element().addMethods();
                                }
                                return elms;
                            }
                            ${current_elm.innerHTML.trim()}
                            //$ = orig;
                            }finally {
                                document.currentScript.remove();
                            }
                            `.trim();
                    }else if(src != null) {
                        new_elm.setAttribute('src', src);
                        new_elm.addEventListener('load', (ev) => {
                            //console.log(ev);
                            ev.target.remove();
                        });
                    }
                }else {
                    new_elm.appendChild(
                        this.buildFragment(
                            current_elm.innerHTML.trim()
                        )
                    );
                }
                //console.log(elm);
                if(tag == 'STYLE') {
                    new_elm.addEventListener('load',(ev)=>{
                        ev.target.remove();
                    });
                    /*let script = document.createElement('script');
                    script.addEventListener('load',()=>{
                        current_elm.remove();
                    });*/
                    
                    /*innerHTML = `
                        let script = document.currentScript;
                        script.previousSibling.remove();
                        script.remove();
                    `;*/
                    //fragment.appendChild(script);
                }
                fragment.appendChild(new_elm);
            }else {
                continue;
            }
        }
        //console.log(fragment.children);
        //let text = document.createTextNode(response);
        //fragment.innerHTML = text;
        //console.log(fragment.getElementById('day'));
        return fragment;
    }

    on(ev_name, func, obj) {
        for(let el=0,len=this.target.length; el<len; el++) {
            this.target[el].addEventListener(ev_name,function() {
                func(obj);
            });
            //console.log(this.target[el]);
        }
        return this;
    }

    getSource(source) {
    }

    setComponent(response) {
    }
}

class DateCard {
    constructor(date, time, title, f_stamp, c_stamp) {
        this.date = this.parseFormDate(date);
        this.time = this.parseFormTime(time);
        this.title = title;

        this.created_stamp = c_stamp ? 
            c_stamp : new Date().getTime();
        this.future_stamp = f_stamp ? 
            f_stamp : 
            new Date(
                this.date[0], this.date[1], this.date[2], 
                this.time[0], this.time[1], this.time[2]
            ).getTime();
        
        this.card_info = {
            title:this.title, date:this.date, time:this.time,
            future_stamp: this.future_stamp,
            created_stamp: this.created_stamp,
        };
        this.date_card;
        this.createDateCard();
    }

    buildFragment(response, own) {
        let div = document.createElement('div');
        div.innerHTML = response;//console.log(div.children);
        let div_elms = div.childNodes;
        //console.log(this.source+':');
        //console.log(div_elms);

        let fragment = document.createDocumentFragment();
        //let fragment_elms = fragment.children;
        for(let n=0,len=div_elms.length; n<len; n++){
            let current_elm = div_elms[n];
            if(current_elm.nodeValue == '\n') {
                //console.log(current_elm.nodeValue);
                continue;
            }else if(current_elm.nodeType == 3) {
                let node = document.createTextNode(current_elm.nodeValue.trim());
                fragment.appendChild(node);
            }else if(current_elm.nodeType == 1) {
                let tag = current_elm.tagName;
                let attrs = current_elm.attributes;
                
                let new_elm = document.createElement(tag);
                //new_elm.attributes = attrs;
                for(let m=0,len=attrs.length; m<len; m++) {
                    let node = attrs[m].cloneNode(true);
                    new_elm.setAttributeNodeNS(node);
                }
    
                if(tag == 'SCRIPT') {
                    let src = current_elm.getAttribute('src');
                    if(src == null) {
                        new_elm.innerHTML = `
                            try {
                            //var orig = $;
                            function $(attr) {
                                let elms = parent.querySelectorAll('script')[0]
                                .parentElement
                                .querySelectorAll(\`[\${attr}]\`);
                                for(let elm of elms) {
                                    //elm.prototype = new Element().addMethods();
                                }
                                return elms;
                            }
                            ${current_elm.innerHTML.trim()}
                            //$ = orig;
                            }finally {
                                document.currentScript.remove();
                            }
                            `.trim();
                    }else if(src != null) {
                        new_elm.setAttribute('src', src);
                        new_elm.addEventListener('load', (ev) => {
                            //console.log(ev);
                            ev.target.remove();
                        });
                    }
                }else {
                    //console.log(own.buildFragment(current_elm));
                    new_elm.appendChild(
                        own.buildFragment(
                            current_elm.innerHTML.trim()
                        )
                    );
                }
                //console.log(elm);
                if(tag == 'STYLE') {
                    new_elm.addEventListener('load',(ev)=>{
                        ev.target.remove();
                    });
                }
                fragment.appendChild(new_elm);
            }else {
                continue;
            }
        }
        return fragment;
    }

    createDateCard() {
        let card = document.createElement('li');
        let card_fragment = this.buildFragment(
            this.template(), this
        );
        this.registerID(card_fragment);
        card.appendChild(card_fragment);
        this.date_card = card;
    }

    getDateCardInfo() {
        return this.card_info;
    }

    getDateCard() {
        return this.date_card;
    }

    parseFormDate(date) {
        return date.split('-');
    }

    parseFormTime(time) {
        return time.split(':');
    }

    registerID(fragment) {
        this.card_info['title'] = fragment.title.value;
        this.card_info['date'] = fragment.date.value;
        this.card_info['time'] = fragment.time.value;
    }

    runTimer() {
        new Timer().run();
    }

    template() {
        return `
        <div name="title"</div>
        <div name="date"></div>
        <div name="time"></div>
        `;
    }
}

class DateCollection {
    constructor(card_container_id, storage_name) {
        this.storage_name = storage_name;
        this.card_container = document.getElementById(card_container_id);
        this.data = {}; this.collection = [];
        this.readDataFromStorage(storage_name);
        this.setDataToCollection();
    }

    deleteCard() {

    }

    editCard() {

    }

    readDataFromStorage(storage_name) {
        let data_str = localStorage.getItem(storage_name);
        this.data = data_str ? 
            JSON.parse(data_str) : {};
    }

    register(date_card) {
        let card_info = date_card.getDateCardInfo();
        let date_infos = this.data[card_info.future_stamp];
        date_infos = date_infos ? date_infos : {};
        date_infos.set(
            card_info.created_stamp, 
            {
                date:card_info['date'],
                time:card_info['time'],
                title:card_info['title'], 
            }
        );
        this.data.set(card_info.future_stamp, data_infos);
        this.savedDataToStorage();

        this.readDataFromStorage(this.storage_name);
        this.setDataToCollection();
        //let collection_str = JSON.stringify(this.collection);
        this.showCards();
    }

    /*renewCollection() {
        //let collection = this.getDateCollection(this.name);
        this.collection.add();
        localStorage.setItem(this.storage_name, JSON.stringify(this.collection));
    }*/

    savedDataToStorage() {
        let data_str = JSON.stringify(this.data);
        localStorage.setItem(this.storage_name, data_str);
    }

    /** @idea
    datas = {
        'kigen_timestamp':{
            'created_timestamp':{
                data_info
            }
        }
    };
    kigen_sorted = datas.keys().sort();
    for(let stamp in kigen_sorted) {
        let stamps = datas[num];
        let data_sorted = stamps.keys().sort();
        for(let data in data_sorted) {

        }
    }
    */

    setDataToCollection() {
        let data = this.data;
        let collection = this.collection;
        if(data == null) { 
            //collection = [];
            return;
        };
        let future_stamp_keys = data.keys().sort();
        for(let f_stamp in future_stamp_keys) {
            let created_stamp_keys = data[f_stamp].keys().sort();
            let card;
            for(let c_stamp in created_stamp_keys) {
                card = new DateCard(
                    data[f_stamp][c_stamp].date, 
                    data[f_stamp][c_stamp].time, 
                    data[f_stamp][c_stamp].title, 
                    f_stamp, c_stamp,
                );
                collection.push(card);
            }
        }
    }

    showCards() {
        let collection = this.collection;
        let container = this.card_container;

        if(collection == null) return;
        container.innerHTML = '';
        for(let card in collection) {
            container.appendChild(collection[card]);
        }
    }
}

//2023/07/13-15:
class Dialog {
    //to avoid opening many dialogs
    //one = null;
    
    constructor(content) {
        this.content = content;
        //this.fragment = document.createDocumentFragment();
        let main_css_set = new MainCssSet();
        //console.log(main_css_set.dialog_box());

        this.dialog_shadow = document.createElement('div');
        this.dialog_shadow.style.cssText = main_css_set.dialog_shadow();
        this.dialog_shadow.addEventListener('click', () => this.close());
        //this.dialog_shadow.style.transitionDuration = '1s';

        this.dialog = document.createElement('section');
        this.dialog.style.cssText = main_css_set.dialog_box();
        //this.dialog_shadow.appendChild(dialog);
        //this.fragment.appendChild(dialog_shadow);
        if(content != null) {
            this.dialog.appendChild(this.content);
        }
    }
    
    close() {
        this.dialog.style.opacity = '0';
        this.dialog_shadow.style.opacity = '0';
        setTimeout((own) => {
            own.body.removeChild(own.dialog);
            own.body.removeChild(own.dialog_shadow);
        }, 500, this);
        //this.body.removeChild(this.fragment);
    }

    ok(func) {
        
    }

    setContentStyle() {

    }
    
    setDialogStyle() {

    }
    
    setShadowStyle() {

    }

    show(msg) {
        if(Dialog.one != null) {
            
        }else {
            this.body = document.getElementsByTagName('body')[0];
            this.body.appendChild(this.dialog_shadow);
            this.body.appendChild(this.dialog);

            setTimeout((own)=>{
                own.dialog.style.opacity = '1.0';
                own.dialog_shadow.style.opacity = '0.3';
            },200,this);
        }
    }
}

class Element {
    constructor() {

    }

    addMethods() {
        return {
            click: function() {},
        }
    }
    click(func) {
        console.log(this.elms);
        for(let elm of this.elms) {
            elm.addEventListener('click', function() {
                func();
            });
        }
        return 'hello proto';
    }

    html() {

    }

    style() {

    }
}

class TimeCard {
    constructor(future, tmplt, title) {
        this.future = future;
        this.tmplt = tmplt;
        this.title = title;
        this.time = future.getTime();
    }

    buildFragment(response, own) {
        let div = document.createElement('div');
        div.innerHTML = response;//console.log(div.children);
        let div_elms = div.childNodes;
        //console.log(this.source+':');
        //console.log(div_elms);

        let fragment = document.createDocumentFragment();
        //let fragment_elms = fragment.children;
        for(let n=0,len=div_elms.length; n<len; n++){
            let current_elm = div_elms[n];
            if(current_elm.nodeValue == '\n') {
                //console.log(current_elm.nodeValue);
                continue;
            }else if(current_elm.nodeType == 3) {
                let node = document.createTextNode(current_elm.nodeValue.trim());
                fragment.appendChild(node);
            }else if(current_elm.nodeType == 1) {
                let tag = current_elm.tagName;
                let attrs = current_elm.attributes;
                
                let new_elm = document.createElement(tag);
                //new_elm.attributes = attrs;
                for(let m=0,len=attrs.length; m<len; m++) {
                    let node = attrs[m].cloneNode(true);
                    new_elm.setAttributeNodeNS(node);
                }
    
                if(tag == 'SCRIPT') {
                    let src = current_elm.getAttribute('src');
                    if(src == null) {
                        new_elm.innerHTML = `
                            try {
                            //var orig = $;
                            function $(attr) {
                                let elms = parent.querySelectorAll('script')[0]
                                .parentElement
                                .querySelectorAll(\`[\${attr}]\`);
                                for(let elm of elms) {
                                    //elm.prototype = new Element().addMethods();
                                }
                                return elms;
                            }
                            ${current_elm.innerHTML.trim()}
                            //$ = orig;
                            }finally {
                                document.currentScript.remove();
                            }
                            `.trim();
                    }else if(src != null) {
                        new_elm.setAttribute('src', src);
                        new_elm.addEventListener('load', (ev) => {
                            //console.log(ev);
                            ev.target.remove();
                        });
                    }
                }else {
                    //console.log(own.buildFragment(current_elm));
                    new_elm.appendChild(
                        own.buildFragment(
                            current_elm.innerHTML.trim()
                        )
                    );
                }
                //console.log(elm);
                if(tag == 'STYLE') {
                    new_elm.addEventListener('load',(ev)=>{
                        ev.target.remove();
                    });
                }
                fragment.appendChild(new_elm);
            }else {
                continue;
            }
        }
        return fragment;
    }

    changeTimeView(result) {
        //console.log(result['seconds']);
        this.weeks.innerHTML = `  ${result['weeks']} `;
        this.wkdays.innerHTML = `  ${result['wkdays']} `;
        this.hours.innerHTML = `  ${result['hours']} `;
        this.minutes.innerHTML = `  ${result['minutes']} `;
        this.seconds.innerHTML = `  ${result['seconds']} `;
    }

    changeTitle() {

    }

    display(parent) {
        if(parent != null) {
            this.parent = parent;
        }else {
            this.parent = document.querySelectorAll(`[${this.tmplt}]`)[0];
        }
        console.log(this.parent);
        let xhr = new XMLHttpRequest();
        let own = this;
        xhr.onreadystatechange = function(ev) {
            if(xhr.readyState == 4) {
                if(xhr.status == 200) {
                    let tmplt = xhr.response;
                    //tmplt = own.render(tmplt, own.vals);
                    console.log(tmplt);
                    let fragment = own.buildFragment(tmplt, own);
                    //console.log(fragment);
                    own.registerID(fragment, own);
                    own.parent.appendChild(fragment);
                }
            }else {

            }
        };
        xhr.open('GET',`/timer/src/tmplt/${this.tmplt}.html`, true);
        xhr.send(null);
    }

    registerID(fragment, own) {
        own.weeks = fragment.querySelector('#weeks');
        own.wkdays = fragment.querySelector('#wkdays');
        own.hours = fragment.querySelector('#hours');
        own.minutes = fragment.querySelector('#minutes');
        own.seconds = fragment.querySelector('#seconds');
        console.log(own)
    }

    render(tmplt, vals) {
        let temp = !vals 
        ?tmplt
        :new Function(...Object.keys(vals),
            `return \`${tmplt}\`;`
        )(...Object.values(vals));
        return temp;        
    }

    runTimer() {
        new Timer(this.future).run(this);
    }

    setStyle() {
    }

    show() {
        return this.element;
    }
}

class Timer {
    constructor(future) {
        this.future_millisec = future.getTime();
        this.now_millisec; this.diff;
        this.timer_id;
    }

    calcRest(rest_ms) {
        let seconds= Math.floor(rest_ms/1000%60);
        let minutes= Math.floor(rest_ms/1000/60)%60;
        let hours= Math.floor(rest_ms/1000/60/60)%24;
        let days= Math.floor(rest_ms/1000/60/60/24);
        let weeks= Math.floor(rest_ms/1000/60/60/24/7);
        let wkdays= Math.floor(rest_ms/1000/60/60/24)%7;
        let months= Math.floor(rest_ms/1000/60/60/24/30);
        return {'days':days, 'hours':hours, 'minutes':minutes, 'seconds':seconds, 'weeks':weeks, 'wkdays':wkdays, 'months':months};
    }

    changeTime() {
        let result = this.calcRest(this.diff);
        //console.log(result['seconds']);
        this.time_card.changeTimeView(result);
    }

    run(time_card) {
        this.time_card = time_card;
        this.now_millisec = new Date().getTime();
        //let next_sec = 1000 - (now_millisec % 1000);
        //this.now_millisec = now_millisec + next_sec;
        //console.log(this.now_millisec);
        //setTimeout(function(own) {
            this.timer_id = window.setInterval(this.timer, 1000, this);
        //}, next_sec, this);
    }

    timer(own) {
        //console.log(own);
        own.diff = own.future_millisec - own.now_millisec;
        if(own.diff > 999) {
            own.changeTime();
            own.now_millisec += 1000;
        }else {
            //console.log(own.timer_id)
            //window.clearInterval(own.timer_id)
            window.location.reload();
            //window.setTimeout(window.location.reload, own.diff);
        }
    }
}

class MainCssSet {
    dialog_box() {
        return `
            position:fixed;
            top:50%; left:50%;
            transform-origin:50% 50%;
            transform:translate(-50%, -50%);
            width:auto; height:auto;
            border-radius:5px 5px;
            padding: 15px;
            z-index:50;
            background-color:#fff;
            opacity:0;
            transition: opacity 0.5s;
        `;
    }

    dialog_shadow() {
        return `
            position:fixed;
            top:0px;
            left:0px;
            width:100%;
            height:100%;
            /*z-index:100;*/
            background-color:#000;
            opacity:0;
            transition: opacity 0.5s;
        `;
    }

    form() {
        return `
        overflow-y:scroll;
        `;
    }
}

//document.currentScript.remove();