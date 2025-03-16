/**2023/02/01-11:33 */
/**2023/02/28 02:44:01 */
/**2023/07/15 19:34:35 */
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
        //console.log(this.date);
        //console.log(this.time);
        if(date != '' && time == '') {this.time = [0, 0];}
        this.created_stamp = c_stamp ? 
            c_stamp : new Date().getTime();
        this.future_stamp = f_stamp ? 
            f_stamp : 
            new Date(
                this.date[0], this.date[1], this.date[2], 
                this.time[0], this.time[1], 
            ).getTime();
        
        this.card_info = {
            title:this.title, date:this.date, time:this.time,
            future_stamp: this.future_stamp,
            created_stamp: this.created_stamp,
            view:{},
        };
        //this.stamp = this.future_stamp + this.created_stamp;
        this.date_card;
        this.datetime;
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
        this.card_info.view['weeks'].innerHTML = `  ${result['weeks']} `;
        this.card_info.view['wkdays'].innerHTML = `  ${result['wkdays']} `;
        this.card_info.view['hours'].innerHTML = `  ${result['hours']} `;
        this.card_info.view['minutes'].innerHTML = `  ${result['minutes']} `;
        this.card_info.view['seconds'].innerHTML = `  ${result['seconds']} `;
    }

    createDateCard() {
        let main_css = new MainCssSet();
        let card = document.createElement('li');
        card.style.cssText = main_css.card_style();
        let title = document.createElement('p');
        title.textContent = 
            this.card_info.title ? this.card_info.title : 
            this.defaultTitle();
        title.style.cssText = main_css.title();
        title.classList.add('noscrollbar');
        card.appendChild(title);

        let subtitle = document.createElement('p');
        subtitle.innerText = this.viewDateTime();
        subtitle.style.cssText = main_css.subtitle();
        card.appendChild(subtitle);
        
        let border_line = document.createElement('hr');
        //card.appendChild(border_line);

        let datetime = document.createElement('p');
        let date_fragment = this.buildFragment(
            this.template(), this
        );
        this.registerID(date_fragment);
        datetime.style.cssText = main_css.datetime();
        datetime.appendChild(date_fragment);
        card.appendChild(datetime);
        
        card.future_stamp = this.future_stamp;
        card.created_stamp = this.created_stamp;

        let delete_btn = document.createElement('p');
        delete_btn.textContent = '削除する';
        delete_btn.style.cssText = main_css.delete_btn();
        delete_btn.onclick = this.confirmDeletion;
        card.appendChild(delete_btn);
        this.date_card = card;
    }

    confirmDeletion(e) {
        DateCollection.selected_card = e.target.parentElement;
        let content = document.createElement('div');
        let question = document.createElement('p');
        question.style.cssText = "margin:10px";
        question.innerHTML = `
        <p>本当に削除しますか？</p>
        `;
        
        let yes = document.createElement('p');
        yes.innerText = 'はい';
        yes.style.cssText = new MainCssSet().delete_yes();
        yes.onclick = () => {
            yes.style.background = '#007eff';
            yes.style.color = '#fff';
            setTimeout(() => {
                DateCard.delete();
            }, 500); 
        }
        let space = document.createElement('span');
        space.innerText = '     ';
        
        let no = document.createElement('p');
        no.innerText = 'いいえ';
        no.style.cssText =  new MainCssSet().delete_no();
        no.onclick = () => {
            no.style.background = "#007eff";
            no.style.color = "#fff";
            setTimeout(()=>{
                DateCollection.selected_card = undefined;
                DateCard.confirm.close();
            },500);
        };
        content.appendChild(question);
        content.appendChild(yes);
        //content.appendChild(space);
        content.appendChild(no);

        DateCard.confirm = new Dialog(content);
        DateCard.confirm.show();
    }

    defaultTitle() {
        let title = "タイトル";
        return title;
    }

    static delete(e) {
        console.log('deleting');
        let elm = DateCollection.selected_card;
        let ans = DateCollection.date_collection.deleteCard(elm)
        if(ans) {
            DateCard.confirm.close();
        }
        //console.log(DateCollection.date_collection);
        //console.log(e.target.parentElement.created_stamp);

    }

    finish() {
        let target = this.toElement();
        let parent = DateCollection.date_collection.card_container;
        console.log(target);
        let old_child = parent.removeChild(target);
        parent.appendChild(old_child);
        old_child.style.cssText = 'background: lightgray;';
        //DateCollection.date_collection.deleteCard(this.toElement());
    }

    getDateCardInfo() {
        return this.card_info;
    }

    parseFormDate(date) {
        //console.log(date);
        if(date == '') {
            let date = new Date();
            let default_date = [
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            ];
            return default_date;
        }else if(Array.isArray(date)) {
            //when given from storage
            return date;
        }
        let date_ary = date.split('-');
        date_ary[1] -= 1;
        return date_ary;
    }

    parseFormTime(time) {
        if(time == '') {
            let date = new Date();
            let default_time = [
                date.getHours(), 
                date.getMinutes() + 1
            ];
            return default_time;
        }else if(Array.isArray(time)) {
            return time;
        }
        return time.split(':');
    }

    registerID(fragment) {
        let elms = fragment.querySelectorAll('*[id]');
        //let ids = new Array();
        elms.forEach((val, key) => {
            let id = val.getAttribute('id');
            this.card_info.view[id] = val;
            //console.log(val);
            //ids.push(val.getAttribute('id'));
        });
        //console.log(this);
    }

    runTimer(future) {
        new Timer(future).run(this);
        console.log('timer is running');
        console.log(future);
    }

    template() {
        return `
        <span id="weeks">　00　</span> 週
        <span id="wkdays">　00　</span> 日 
        <span id="hours">　00　</span> 時間 
        <span id="minutes">　00　</span> 分 
        <span id="seconds">　00　</span> 秒 
        `;
    }

    toElement() {
        return this.date_card;
    }

    viewDateTime() {
        let hour = this.time[0];
        console.log(typeof hour);
        if(hour.toString() == '0' ) {
            hour = '00';
        }else if(hour < 10 && hour.toString().length <2) {
            hour = '0'+hour.toString();
        }else {
            hour = hour.toString();
        }

        let min = this.time[1];
        if(min.toString() == '0') {
            min = '00'
        }else if(min < 10 && min.toString().length <2) {
            min = '0'+ min.toString();
        }else {
            min = min.toString();
        }
        let datetime = `${this.date[0]} 年 ${this.date[1]+1} 月 ${this.date[2]} 日 ${hour}:${min}`;
        return datetime;
    }
}

class DateCollection {
    static date_collection;
    static selected_card;
    
    constructor(card_container_id, storage_name) {
        this.storage_name = storage_name;
        this.card_container = document.getElementById(card_container_id);
        this.data = new Map(); this.collection = new Array();
        this.readDataFromStorage(storage_name);
        this.setDataToCollection();
    }

    deleteCard(elm) {
        let f_stamp = elm.future_stamp;
        let c_stamp = elm.created_stamp;
        let data = this.data;
        console.log(data[f_stamp]);
        delete data[f_stamp][c_stamp];
        //data[f_stamp].delete(c_stamp);
        //console.log(data[f_stamp][c_stamp]);
        //console.log(Object.keys(data[f_stamp]).length);
        if(Object.keys(data[f_stamp]).length == 0) {
            //data[f_stamp] = '';
            delete data[f_stamp];
            /*if(data.length == undefined) {
                delete data;
            }*/
        }
        //console.log(data[f_stamp].values);
        this.savedDataToStorage();
        this.readDataFromStorage(this.storage_name);
        this.setDataToCollection();
        //if(elm.parentElement[elm]) {
            elm.parentElement.removeChild(elm);
        //}
        return true;
        //DateCard.confirm.close();
    }

    editCard() {

    }

    indexOfCard(future_stamp, created_stamp) {
        let collection = this.collection;
        let card;
        for(let idx in collection) {
            card = collection[idx];
            if(
                card.future_stamp == future_stamp &&
                card.created_stamp == created_stamp
            ) {
                return idx;
            }
            continue;
        }
    }

    insert(new_card, idx) {
        let container = this.card_container
        let old_card = container.children[idx];
        //console.log(container);
        container.insertBefore(new_card, old_card);
    }

    readDataFromStorage(storage_name) {
        let data_str = localStorage.getItem(storage_name);
        this.data = data_str ? 
            JSON.parse(data_str) : new Map();
    }

    register(date_card) {
        let card_info = date_card.getDateCardInfo();
        console.log(card_info);
        let date_infos = this.data[card_info.future_stamp];
        
        date_infos = date_infos ? date_infos : new Map();
        console.log(date_infos);
        /*let created_infos = new Map();
        created_infos.set('date', card_info['date']);
        created_infos.set('time', card_info['time']);
        created_infos.set('title', card_info['title']);
        console.log(created_infos);
        */
        date_infos[card_info.created_stamp] = 
            {
                date:card_info['date'],
                time:card_info['time'],
                title:card_info['title'], 
            }
        ;
        this.data[card_info.future_stamp] = date_infos;
        this.savedDataToStorage();

        this.readDataFromStorage(this.storage_name);
        console.log(this.data);
        this.setDataToCollection();

        let idx = this.indexOfCard(
            card_info.future_stamp, card_info.created_stamp
        );
        console.log(idx)
        this.insert(date_card.toElement(), idx);

        let datetime = new Date(
            card_info.date[0], 
            card_info.date[1], 
            card_info.date[2], 
            card_info.time[0], 
            card_info.time[1], 
        );
        date_card.runTimer(datetime);
        //let collection_str = JSON.stringify(this.collection);
        //this.showCards();
    }

    /*renewCollection() {
        //let collection = this.getDateCollection(this.name);
        this.collection.add();
        localStorage.setItem(this.storage_name, JSON.stringify(this.collection));
    }*/

    runCardsTimer() {
        let data = this.data;
    }

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
        if(data.size == 0) { 
            return;
        };
        let collection = new Array();
        let future_stamp_keys = Object.keys(data).sort();
        console.log(future_stamp_keys);
        for(let f_idx in future_stamp_keys) {
            let future_stamp = future_stamp_keys[f_idx];
            if(Object.keys(data[future_stamp]).length == 0) {
                delete data[future_stamp];
                continue;
            }
            let created_stamp_keys = 
                Object.keys(data[future_stamp]).sort();
            let card; let datetime;
            for(let c_idx in created_stamp_keys) {
                let created_stamp = created_stamp_keys[c_idx];
                card = new DateCard(
                    data[future_stamp][created_stamp].date, 
                    data[future_stamp][created_stamp].time, 
                    data[future_stamp][created_stamp].title, 
                    future_stamp, created_stamp,
                );
                //console.log(new Date().setMilliseconds(parseInt(future_stamp)));
                datetime = new Date(
                    card.card_info.date[0], 
                    card.card_info.date[1], 
                    card.card_info.date[2], 
                    card.card_info.time[0], 
                    card.card_info.time[1],
                );
                card.datetime = datetime;
                collection.push(card);
                    /*
                    card.runTimer(date);
                collection.push(card.getDateCard());
                */
            }
        }
        //console.log(collection);
        this.collection = collection;
    }

    showCards() {
        let collection = this.collection;
        let container = this.card_container;
        console.log(collection);
        if(collection.length == 0) return;
        container.innerHTML = '';
        let card; let datetime;
        for(let idx in collection) {
            card = collection[idx];
            container.appendChild(card.toElement());
            /*datetime = new Date(
                card.card_info.date[0], 
                card.card_info.date[1], 
                card.card_info.date[2], 
                card.card_info.time[0], 
                card.card_info.time[1],
            );*/
            card.runTimer(card.datetime);
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
                    //console.log(tmplt);
                    let fragment = own.buildFragment(tmplt, own);
                    //console.log(fragment);
                    own.registerID(fragment, own);
                    own.parent.appendChild(fragment);
                }
            }else {

            }
        };
        xhr.open('GET',`/src/tmplt/${this.tmplt}.html`, true);
        xhr.send(null);
    }

    finish() {
        window.location.reload();
    }

    registerID(fragment, own) {
        own.weeks = fragment.querySelector('#weeks');
        own.wkdays = fragment.querySelector('#wkdays');
        own.hours = fragment.querySelector('#hours');
        own.minutes = fragment.querySelector('#minutes');
        own.seconds = fragment.querySelector('#seconds');
        //console.log(own)
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
        if(own.diff > 10) {
            own.changeTime();
            own.now_millisec += 1000;
        }else {
            //console.log(own.timer_id)
            //window.clearInterval(own.timer_id)
            //console.log('finish:'+own.timer_id);
            clearInterval(own.timer_id);
            own.time_card.finish();
            //window.location.reload();
            //window.setTimeout(window.location.reload, own.diff);
        }
    }
}

class MainCssSet {
    card_style() {
        return `
        position: relative;
        `;
    }
    
    datetime() {
        return `
        margin: 10px auto;
        color:green;
        font: 150% bold;
        `;
    }

    delete_btn() {
        return `
        display:inline;
        margin: auto 5px;
        position: relative;
        bottom:-5%;
        transform-origin: 50% 50%;
        transform:translate(-50%, -50%);
        color:#da6161;
        font-weight:bold;
        cursor:pointer;
        `;
    }

    delete_yes() {
        return `
        display:inline;
        margin: 0px;
        padding: 1px 10px;
        position:relative;
        border-radius: 5%;
        left: 50%;
        border: 1px solid #007eff;
        background: #fff;
        color: #000;
        font:0.5em;
        cursor:pointer;
        `;
    }

    delete_no() {
        return `
        display:inline;
        margin: 0px;
        padding: 1px 10px;
        position:relative;
        border-radius:5%;
        border:1px solid #007eff;
        background:#fff;
        right: 50%;
        color: #000;
        font:0.5em;
        cursor:pointer;
        `;
    }

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
            transition: opacity 0.3s;
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
            transition: opacity 0.3s;
        `;
    }

    form() {
        return `
        overflow-y:scroll;
        `;
    }

    subtitle() {
        return `
        margin: auto 20px;
        text-align: left;
        font: 1em bold;
        color:gray;
        `;
    
    }

    title() {
        return `
        margin: 10px 20px 0px;
        height: 25%;
        font:2em bold;
        color: #007eff;
        overflow-x:scroll;
        text-align:left;
        `;
    }
}

//document.currentScript.remove();