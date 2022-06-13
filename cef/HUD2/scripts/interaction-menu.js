var type = 1,
    select;

let XMenuElements = [];

function XMenuModel(...args) {
    this.element = args[0];
    this.title = args[1];
    this.info = args[2];
    this.functionName = args[3];
    this.image = args[4];
    this.type = args[5];
};

function AddModelToXMenu(element, title, info, functioName, image, type) {
    XMenuElements.push(new XMenuModel(element, title, info, functioName, image, type))
};


function CreateXMenu(type) {
    $('.interaction-menu').css('display', 'flex');
    for (const x in XMenuElements) {
        if (XMenuElements[x].type == type) {
            let element = `<div class="circle" data-function=${XMenuElements[x].functionName} data-type=${type}><p class="circle-image ${XMenuElements[x].functionName}" ></p></div><p id="text" class="hide">${XMenuElements[x].title}<br><span style="font-family:ubuntu; font-size: 1.5vh;" >${XMenuElements[x].info}</span></p>`;
            $('.interaction-menu').append(element);
            $(`.${XMenuElements[x].functionName}`).css('background-image', `url(../utils/img/icons/${XMenuElements[x].image}.png)`);
        }
    }
    $(".interaction-menu").append('<div class="circle" data-function=' + "close" + ' data-type=' + "none" + '><p class="circle-image" style="background-image: url(../utils/img/icons/close.png); background-size: 2.25vw;}"></p></div><p id="text" class="hide">Schließen <br><span style="font-family:ubuntu; font-size: 1.5vh;" >Das Menu wird geschlossen</span></p>');

    document.querySelectorAll('.interaction-menu').forEach((ciclegraph) => {
        let circles = ciclegraph.querySelectorAll('.circle');
        let angle = 360 - 90,
            dangle = 360 / circles.length;
        for (let i = 0; i < circles.length; i++) {
            let circle = circles[i];
            angle += dangle;
            circle.style.transform = `rotate(${angle}deg) translate(${ciclegraph.clientWidth / 2.5}px) rotate(-${angle}deg)`
        }
    });
}

function ClearXMenu() {
    $('.interaction-menu').css('display', 'none');
    $('.interaction-menu').html("");
    XMenuElements = [];
}

function DestoryXMenu() {
    if (select != null) {
        let data_function = $(select).attr('data-function');
        if (data_function != null || data_function != undefined || data_function != "") {
            if (data_function != "close") {
                let data_type = $(select).attr('data-type');
                if (data_type != null || data_function != undefined || data_function != "") {
                    mp.trigger('InteractionMenu:ClientCall', data_function, data_type);
                }
            }
        }
    }
    ClearXMenu();
}

$(document).on('click', '.circle', function(e) {
    let data_function = $(this).attr('data-function');
    if (data_function != null || data_function != undefined || data_function != "") {
        if (data_function != "close") {
            let data_type = $(this).attr('data-type');
            if (data_type != null || data_function != undefined || data_function != "") {
                mp.trigger('InteractionMenu:ClientCall', data_function, data_type);
            }
        }
    }
    ClearXMenu();
});

$(document).on('mouseover', '.circle', function(e) {
    select = this;
});

$(document).on('mouseleave', '.circle', function(e) {
    select = null;
});