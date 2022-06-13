function Dialog(...args) {
    this.title = args[0];
    this.discription = args[1];
    this.icon = args[2];
    this.content = args[3];
    this.buttons = args[4];
}

function DialogButton(...args) {
    this.name = args[0];
    this.eventname = args[1];
    this.arguments = args[2];
};

let _Data = new Dialog("Autohans - Davis", "An & Verkauf von gebraucht/Neuwagen.", "fa-car", "Möchtest du das Fahrzeug \"Asea\" für den Preis von 3799 $ erwerben?", [new DialogButton("Abbrechen", "Server:Dialog:Cancle", ["1", "2", "3"]), new DialogButton("Bestätigen", "Server:Dialog:Accept", ["4", "5", "6"])])

// CreateDialogField(JSON.stringify(_Data));

function CreateDialogField(rawData) {
    let dialogData = JSON.parse(rawData);
    $(".confirmation-content").html("");

    $('.confirmation-header-inner-text h2').text(dialogData.title);
    $('.confirmation-header-inner-text p').text(dialogData.discription);
    $('.confirmation-header-inner').html(`<i style="font-size: 1.8vh; color: white;" class="fa-solid ${dialogData.icon}"></i>`)
    let _content_element = `
    <p>${dialogData.content}</p>
    <div class="confirmation-content-buttons">
    
    </div>
    `;
    $(".confirmation-content").append(_content_element);

    if (dialogData.buttons != null) {
        dialogData.buttons.forEach(x => {
            let _button_element = `<button onclick="dialogAction('${x.eventname}', ${x.arguments})">${x.name}</button>`;
            $(".confirmation-content-buttons").append(_button_element);
        });
    }

    $('.confirmation').fadeIn(255);

}

function DestoryDialogField() {
    $('.confirmation').fadeOut(255);
}

function dialogAction(eventname, ...arguments) {
    mp.trigger('Client:Dialog:Call:Event', eventname, ...arguments);
}