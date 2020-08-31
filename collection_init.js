document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.collapsible');
    var instances = M.Collapsible.init(elems, {accordion: false});
});

function initCollapsible() {
    let elems = document.querySelectorAll('.collapsible');
    let instances = M.Collapsible.init(elems, {accordion: false});
}

let form = document.getElementById('myForm');

form.onsubmit = function() {
    createList();
    let book = document.getElementById('icon_book').value;
    let author = document.getElementById('icon_author').value;
    createElem(book, author);
    getLibraryInfo(book, author);
    form.reset();
}

form.addEventListener('submit', handleForm)

function handleForm(event) {
    event.preventDefault();
}

function createList() {
    let isList = !!document.querySelector('.collapsible');
    if (!isList) {
        let list = document.createElement('ul');
        list.className = 'collapsible';
        document.body.append(list);
    }
}

function createElem(book, author) {
    let ul = document.querySelector('.collapsible');
    let li = document.createElement('li');
    let div_header = document.createElement('div');
    div_header.className = 'collapsible-header container';
    let icon;
    if (book !== "" && author !== "") {
        icon = `<i class='material-icons item-icon'>cloud_queue</i>${book}, ${author}`;
    } else if (book === "" && author !== "") {
        icon = `<i class='material-icons item-icon'>cloud_queue</i>${author}`;
    } else if (book !== "" && author === "") {
        icon = `<i class='material-icons item-icon'>cloud_queue</i>${book}`;
    } else {
        return;
    }
    div_header.innerHTML = icon;
    let span = document.createElement("span");
    span.className = 'item';
    span.appendChild(createPreloader());
    div_header.appendChild(span);
    li.appendChild(div_header);
    ul.appendChild(li);
    document.body.append(ul);
}

function getData(url) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    let prom = new Promise((resolve, reject) => {
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const json = JSON.parse(xhr.responseText)
                resolve(json)
            } else {
                reject
            }
        }
    });
    xhr.send()
    return prom;
}

function getSpans(result) {
    let list = [];
    for (let i = 0; i < result.length; i++) {
        let span = document.createElement("span")
        span.innerText = JSON.stringify(result[i]);
        list.push(span);
    }
    return list;
}

function createTable(result) {
    let table = document.createElement("table");
    let head = table.createTHead();
    let row = head.insertRow();
    for (let key in result[0]) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
    for (let elem of result) {
        let row = table.insertRow();
        for (let key in elem) {
            let cell = row.insertCell();
            let text = document.createTextNode(elem[key]);
            cell.appendChild(text);
        }
    }
    return table;
}

function createCollapseBody(result) {
    let div = document.createElement("div");
    div.className = "collapsible-body";
    let table = createTable(result);
    div.appendChild(table);
    document.querySelector('.collapsible').lastChild.appendChild(div);
    initCollapsible();
}

function createPreloader() {
    let preloader_wrapper = document.createElement("div");
    preloader_wrapper.className = "preloader-wrapper small active";
    let spinner_layer = document.createElement("div");
    spinner_layer.className = "spinner-layer spinner-green-only";
    let circle_clipper_left = document.createElement("div");
    circle_clipper_left.className = "circle-clipper left";
    let circle = document.createElement("div");
    circle.className = "circle";
    let gap_patch = document.createElement("div");
    gap_patch.className = "gap-patch";
    let circle2 = document.createElement("div");
    circle2.className = "circle";
    let circle_clipper_right = document.createElement("div");
    circle_clipper_right.className = "circle-clipper right";
    let circle3 = document.createElement("div");
    circle3.className = "circle";
    circle_clipper_left.appendChild(circle);
    gap_patch.appendChild(circle2);
    circle_clipper_right.appendChild(circle3);
    spinner_layer.appendChild(circle_clipper_left);
    spinner_layer.appendChild(gap_patch);
    spinner_layer.appendChild(circle_clipper_right);
    preloader_wrapper.appendChild(spinner_layer);
    return preloader_wrapper;
}

function removePreloader() {
    let pre = document.querySelector('.preloader-wrapper');
    pre.parentNode.removeChild(pre);
}

function getLibraryInfo(book, author) {
    let bookReplaced = book.split(' ').join('-');
    let authorReplaced = author.split(' ').join('-');
    let url = `http://localhost:8080/book/name=${bookReplaced}&author=${authorReplaced}`;
    getData(url).then(result => {
        createCollapseBody(result);
        removePreloader();
    });
}
