/*2022/12/05-23:30 */
/*2023/02/28 02:16:35 */
/*2023/07/15 19:32:03 */
'use strict';
document.addEventListener('DOMContentLoaded', function(){
    //main();
    let body_node = document.createAttribute('main');
    let doc = document.getElementsByTagName('body')[0];
    doc.setAttributeNode(body_node);
    doc.setAttribute('id','day');
    doc.style.position = 'relative';
    
    const mngr = new ComponentManager('/timer/src/tmplt/');
    
    /*const app = new ComponentManager(root, frame);
    app.components_path = '';
    app.display();
    */
    //mngr.setRoot(document.querySelector('body'));
    //let body = document.getElementsByTagName('body');
    const main = mngr.addComponent('main');
    //const sub = main.addComponent('sub')
});
//document.currentScript.remove();