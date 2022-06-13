let storage = {
    apps: [],
    contacts: [],
    messagechats: [],
    call_history: [],
    lifeinvader_messages: [],
    settings: new SettingsModel(false, false, 0, 0, 0, false),
    // gps_locations: [],
    playerinfo: {},
    radio: new RadioModel(0, true, "Unknown", 0.0, 0, 0),

    current_screen: 'homescreen',
    call_active: null,
    call_started_at: null,
    call_number: null,
    numbers: "",

    current_played_sound: null,

    background_images: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
};

let data = {
    sortablecallhistory: false,
    currentSelectedContact: null,
    currentSelectedReciever: null,
    currentDelayOnMessageSend: 0,
    isCurrentInEditChatsMode: false,
}

let StoragedPhoneSettings = null;

//GENERAL
function RemoteCall(eventname, ...args) {
    if (typeof mp !== 'undefined') {
        mp.trigger('Phone:Callremote', eventname, ...args);
    }
}

//GENERAL FUNCTIONS
function UpadtePhoneClock() {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();

    if (m.toString().length === 1) {
        m = "0" + m;
    }
    if (h.toString().length === 1) {
        h = "0" + h;
    }
    $('.time').html(`${h + ":" + m}`);

    if (storage.call_active) {
        const timebtw = date - storage.call_started_at;
        const callTime = new Date(timebtw);
        const offset = callTime.getTimezoneOffset() / 60;
        let bigformat = `${Pad(callTime.getHours() + offset)}:${Pad(callTime.getMinutes())}:${Pad(callTime.getSeconds())}`;
        let smalformat = `${Pad(callTime.getHours() + offset)}:${Pad(callTime.getMinutes())}`;
        $('#iphone .face .screen .status-bar .call-bar').css('display', 'flex');
        $('#iphone .face .screen .status-bar .time').css('display', 'none');
        $('#iphone .face .screen>.app.callscreen .container .call-header .call-time').html(`${bigformat}`);
        $('#iphone .face .screen .status-bar .call-bar').text(`${smalformat}`)
    } else {
        $('#iphone .face .screen .status-bar .call-bar').css('display', 'none');
        $('#iphone .face .screen .status-bar .time').css('display', 'flex');
    }
}

function Pad(n) {
    return (n < 10) ? (`0${n}`) : n;
}

function OnAppClick(element) {
    let page = $(element).attr('data-page');
    if (page != undefined) {
        ShowScreen(page);
    }
}

function ShowScreen(screen) {

    if (screen != null && screen != "") {

        OnPageChange(storage.current_screen, screen);

        let element_pages = $('.page');

        $(element_pages).each((index, elem) => {
            $(elem).css("display", "none");
        });

        if (screen == "homescreen") $('.screen.wallpaper').removeClass('hide-image-bg');
        else $('.screen.wallpaper').addClass('hide-image-bg');

        let element_next_page = $(`#${screen}.app`);
        if (!element_next_page.length) return;

        let element_animation = $(element_next_page).attr('data-animation');
        if (element_animation == undefined) element_animation = 'animation-none';

        $(element_next_page).css("display", "flex");
        $(element_next_page).addClass(element_animation);

        storage.current_screen = screen;
    }
}

function OnPageChange(currentPage, newPage) {

    switch (newPage) {
        case "homescreen":
            data.currentSelectedContact = null;
            data.currentSelectedReciever = null;
            break;
        case "callhistory":
            if (data.sortablecallhistory) {
                SortableCallHistory(true);
            } else {
                LoadCallHistory();
            }
            break;
        case "contacts":
            LoadContacts();
            $('#search-contact').val("");
            break;
        case "favorites":
            LoadFavorites();
            break;
        case "contact-edit":
            if (data.currentSelectedContact != null) {
                let contact = storage.contacts.find(x => x.id == data.currentSelectedContact);
                if (contact != null) {
                    SetEditContactInfo(contact.name, contact.number);
                    console.log(contact.name);
                    console.log(contact.number);
                }
            }
            break;
        case "addcontact":
            $('#addcontact').find('#Vorname').val("");
            $('#addcontact').find('#Nachname').val("");
            $('#addcontact').find('#Telefonnummer').val("");
            $('#addcontact').find('.plus.icon').css('display', 'flex')
            $('#addcontact').find('.minus.icon').css('display', 'none')
            $('#addcontact').find('.title').text('Als Favoriten hinzufügen')
            $('#addcontact').find('#addnewcontact').attr('data-toggle', "false");
            break;
        case "messanger":
            LoadMessageChats();
            $('#messanger').find('#search').val("");
            break;
        case "lifeinvader":
            LoadlifeinvaderMessages();
            break;
        case "faction":
            LoadFactionMembersFromServer();
            break;
        case "radio":
            RemoteCall("Phone:Radio:UpdateData");
            break;
        // case "navigator":
        //     ResetNavigation();
        //     break;
        default:
            break;
    }
}

function OnActionClicked(element) {
    let action = $(element).attr('data-action');

    console.log(`OnActionClicked Action: ${action}`);

    switch (action) {
        case "add-phone-input-number":
            let number = $(element).attr('data-number');
            if (storage.numbers.length < 10) {
                if (number != "hashtag" && number != "star") {
                    storage.numbers = storage.numbers + number;
                    $('.number').text(storage.numbers.toString());
                }
                PlaySound(`numpad-${number}`, 0.1, false);
            }
            break;
        case "remove-phone-input-number":
            if (storage.numbers != "") {
                storage.numbers = storage.numbers.substring(0, storage.numbers.length - 1);
                $('.number').text(storage.numbers.toString());
                PlaySound(`numpad-hashtag`, 0.1, false);
            }
            break;
        case "phone-try-call":
            if (storage.numbers != "") {
                if (storage.numbers.length) {
                    RemoteCall('Phone:Call:Try', parseInt(storage.numbers));
                }
            }
            break;
        case "phone-switch-callhistory":
            let toggle = $(element).attr('data-toggle');
            if (toggle == data.sortablecallhistory.toString()) return;
            if (toggle == "true") {
                data.sortablecallhistory = true;
                $("#callhistory-all").removeClass('active');
                $("#callhistory-missed").addClass('active');
                SortableCallHistory(data.sortablecallhistory);
            } else {
                data.sortablecallhistory = false;
                $("#callhistory-all").addClass('active');
                $("#callhistory-missed").removeClass('active');
                LoadCallHistory();

            }
            break;
        case "contact-show-information":
            let contactId = parseInt($(element).attr('contact-info'));
            if (contactId != null && typeof(contactId) == 'number') {
                data.currentSelectedContact = contactId;

                let contact = storage.contacts.find(x => x.id == data.currentSelectedContact);

                if (contact == null) data.currentSelectedContact = null;

                if (contact != null) {
                    SetContactInfo(contact.name.toString(), contact.number.toString(), contact.is_favorite, contact.is_blocked, false);
                }
            }
            break;
        case "show-popup-clear-callhistory":
            $('#callhistory').find('.edit-message').fadeIn(100);
            break;
        case "clear-call-history":
            if (storage.call_history.length) {
                $('.edit-message').fadeOut(100);
                storage.call_history = [];
                LoadCallHistory();
                RemoteCall('Phone:ClearCallhistory');
            }
            break;
        case "hide-popup":
            $('.edit-message').fadeOut(100);
            break;
        case "contact-remove-favorite":
            if (data.currentSelectedContact != null) {
                let contact = storage.contacts.find(x => x.id == data.currentSelectedContact);
                if (contact != null) {
                    contact.is_favorite = false;
                    SetContactInfo(contact.name, contact.number, contact.is_favorite, contact.is_blocked, true);
                    RemoteCall("Phone:Contact:UpdateFavoriteState", contact.id, false);
                }
            }
            break;
        case "contact-add-favorite":
            if (data.currentSelectedContact != null) {
                let contact = storage.contacts.find(x => x.id == data.currentSelectedContact);
                if (contact != null) {
                    contact.is_favorite = true;
                    SetContactInfo(contact.name, contact.number, contact.is_favorite, contact.is_blocked, true);
                    RemoteCall("Phone:Contact:UpdateFavoriteState", contact.id, true);
                }
            }
            break;
        case "contact-remove-block":
            if (data.currentSelectedContact != null) {
                let contact = storage.contacts.find(x => x.id == data.currentSelectedContact);
                if (contact != null) {
                    contact.is_blocked = false;
                    SetContactInfo(contact.name, contact.number, contact.is_favorite, contact.is_blocked, true);
                    RemoteCall("Phone:Contact:UpdateBlockState", contact.id, false);
                }
            }
            break;
        case "contact-add-block":
            if (data.currentSelectedContact != null) {
                let contact = storage.contacts.find(x => x.id == data.currentSelectedContact);
                if (contact != null) {
                    contact.is_blocked = true;
                    SetContactInfo(contact.name, contact.number, contact.is_favorite, contact.is_blocked, true);
                    RemoteCall("Phone:Contact:UpdateBlockState", contact.id, true);
                }
            }
            break;
        case "contact-delete":
            if (data.currentSelectedContact != null) {
                if (Remove_Contact(data.currentSelectedContact)) {
                    $('#search-contact').val("");
                    ShowScreen("contacts")
                    RemoteCall("Phone:Contact:Delete", data.currentSelectedContact);
                    data.currentSelectedContact = null;
                }
            }
            break;
        case "messanger-chat":
            let reciver = $(element).attr('data-reciever');
            if (reciver != null) {
                OpenMessageChat(parseInt(reciver));
            }
            break;
        case "contact-create-message-chat":
            if (data.currentSelectedContact != null) {
                TryOpenMessagerChatFromContacts(data.currentSelectedContact);
            }
            break;
        case "try-phone-call-from-contact":
            if (data.currentSelectedContact != null) {
                let contact = storage.contacts.find(x => x.id == data.currentSelectedContact);
                if (contact != null) {
                    RemoteCall('Phone:Call:Try', parseInt(contact.number));
                }
            }
            break;
        case "decline-call":
            RemoteCall('Phone:Call:Cancle');
            break;
        case "accept-call":
            RemoteCall('Phone:Call:Accept');
            break;
        default:
            break;
    }
}

function PlayAudio(element) {
    if (element == null) {
        ShowNotification("Fehler", "Jetzt", "Audio datei nicht gefunden.", "0");
        return;
    }

    let data_audio = $(element).attr('data-audio');
    let data_sound = $(element).attr('data-sound');

    if (data_audio == null || data_sound == null) {
        ShowNotification("Fehler", "Jetzt", "Audio datei beschädigt.", "0");
        return;
    }

    PlaySound(`${data_audio}-${data_sound}`, 0.25, false);
}

function PlaySound(name, volume, loop) {
    let src = `../utils/img/smartphone/sounds/${name}.mp3`;

    if (storage.current_played_sound != null) {
        DestroySound();
    }

    storage.current_played_sound = new Audio(src);
    storage.current_played_sound.volume = volume;
    storage.current_played_sound.loop = loop;
    storage.current_played_sound.play();
}

function PauseSound() {
    if (storage.current_played_sound != null) {
        storage.current_played_sound.pause();
    }
}

function DestroySound() {
    if (storage.current_played_sound != null) {
        storage.current_played_sound.pause();
        storage.current_played_sound = null;
    }
}

function SetPhoneScale(scale) {
    $('#iphone').css('transform', `scale(${scale})`)
}

function TogglePhone(toggle) {
    if (toggle) {
        $("#iphone").css('visibility', 'visible');
        $("#iphone").css('bottom', '3vh');
    } else {
        $("#iphone").css('bottom', '-60vh');
        setTimeout(() => {
            $("#iphone").css('visibility', 'hidden');
        }, 500);
    }
}

function ShowNotification(title, time, text, icon) {

    let element = $(`
    <li class="notification">
        <div class="header">
            <div class="icon">
                <img src="../utils/img/smartphone/apps/${icon}.svg" alt="">
            </div>
            <div class="title">${title}</div>
            <div class="age">${time}</div>
        </div>
        <div class="body">
            <p>${text}</p>
        </div>
    </li>
    `);

    $('.screen.wallpaper .notifications').append(element);

    element.animate({
        left: "0vh",
    }, 750, function() {
        setTimeout(() => {
            element.animate({
                left: "25vh",
            }, 750, function() {
                element.remove();
            });
        }, 2500);
    });
}

//HOME APP FUCNTION
function isAppExists(id) {
    let apparray = storage.apps;
    for (let i = 0; i < apparray.length; i++) {
        if (apparray[i].id == id) return true;
    }
    return false;
}

function Add_App(id, name, img_name, is_panel_app = false, pagedata) {
    if (!isAppExists(id)) {
        storage.apps.push(new AppModel(id, name, img_name, is_panel_app, pagedata));
    }
}

function Remove_App(id) {
    let apparray = storage.apps;
    for (let i = 0; i < apparray.length; i++) {
        if (apparray[i].id == id) {
            storage.apps.splice(apparray.indexOf(apparray[i]), 1);
            $(`#phone-app-${id}`).remove();
        }
    }
}

//PHONE APP FUNCTIONS
function isContactExists(id) {
    let contactarray = storage.contacts;
    for (let i = 0; i < contactarray.length; i++) {
        if (contactarray[i].id == id) return true;
    }
    return false;
}

function Add_Contact(id, name, numer, is_favorite = false, is_blocked = false) {
    if (!isContactExists(id)) {
        console.log(`New Contact Added | id: ${id}, name: ${name}, numer: ${numer}, is_favorite: ${is_favorite}, is_blocked: ${is_blocked}`);
        storage.contacts.push(new ContactModel(id, name, numer, is_favorite, is_blocked));
    }
}

function Remove_Contact(id) {
    let contactarray = storage.contacts;
    for (let i = 0; i < contactarray.length; i++) {
        if (contactarray[i].id == id) {
            storage.contacts.splice(contactarray.indexOf(contactarray[i]), 1);
            return true;
        }
    }
    return false;
}

function isCallhistoryExists(id) {
    let callhistoryarray = storage.call_history;
    for (let i = 0; i < callhistoryarray.length; i++) {
        if (callhistoryarray[i].id == id) return true;
    }
    return false;
}

function Add_CallHistory(id, name, action, time, is_missed = false) {
    if (!isCallhistoryExists(id)) {
        storage.call_history.push(new CallHistoryModel(id, name, action, time, is_missed));
    }
}

function Remove_CallHistory(id) {
    let callhistoryarray = storage.call_history;
    for (let i = 0; i < callhistoryarray.length; i++) {
        if (callhistoryarray[i].id == id) {
            storage.call_history.splice(callhistoryarray.indexOf(callhistoryarray[i]), 1);
            $(`#callhistory-item-${callhistoryarray.id}}`).remove();
        }
    }
}

function SortableCallHistory(state) {
    if (state) {
        $('#callhistory-wrapper').html('');
        setTimeout(() => {
            for (const x of storage.call_history) {
                if (x.is_missed) {
                    let element = `
                    <div class="call-wrapper" id="callhistory-item-${x.id}">
                        <div class="call missed">
                            <div class="basic-info">
                                <div class="caller">${x.name}</div>
                                <div class="call-type">${x.action}</div>
                            </div>
                            <div class="datetime">${x.time}</div>
                            <div class="info-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 8">
                                    <path d="M.793 7.658v-4.92h-.793v-.307h2.226v5.221h.774v.348h-3v-.342zm.717-6.091a.821.898 0 0 0 .896-.781.821.898 0 0 0-.896-.781.821.898 0 0 0-.896.781.821.898 0 0 0 .896.782z"/>
                                </svg>
                            </div>
                        </div>
                    </div>`;
                    $("#callhistory-wrapper").append(element);
                }
            }
        }, 1);
    }
}

function GetContactsWithFirstLetter(letter) {
    return storage.contacts.filter(x => x.name.toLowerCase().charAt(0) == letter.toLowerCase().charAt(0))
}

function SetContactInfo(name, number, is_favorite, is_blocked, update) {

    $('#contact-icon-value').html(name.toUpperCase().charAt(0).toString());
    $('#contact-number-value').text(number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ').toString());
    $('#contact-name-value').text(name)
    let send_message_btn = $('#contact-button-sendmessage');
    let favorite_btn = $('#contact-button-favorite');
    let block_btn = $('#contact-button-block');
    let delete_btn = $('#contact-button-delete');

    $(send_message_btn).attr("data-action", "contact-create-message-chat");
    $(delete_btn).attr("data-action", "contact-delete");

    if (is_favorite) {
        $(favorite_btn).attr("data-action", "contact-remove-favorite");
        $(favorite_btn).text("Von Favoriten entfernen");
    } else {
        $(favorite_btn).attr("data-action", "contact-add-favorite");
        $(favorite_btn).text("Als Favoriten sichern");
    }

    if (is_blocked) {
        $(block_btn).attr("data-action", "contact-remove-block");
        $(block_btn).text("Blockierung aufheben");
    } else {
        $(block_btn).attr("data-action", "contact-add-block");
        $(block_btn).text("Blockieren");
    }

    if (!update) {
        ShowScreen('contact-information')
    }
}

function SetEditContactInfo(name, number) {
    $('#contact-edit').find('#contact-edit-icon-value').html(name.toUpperCase().charAt(0).toString());
    $('#contact-edit').find('#contact-edit-name-value').html(name);
    $('#contact-edit').find('#contact-firstname-value').val(name.split(' ')[0])
    $('#contact-edit').find('#contact-secname-value').val(name.split(' ')[1])
    $('#contact-edit').find('#contact-phonenumber-value').val(number)
}

function ClearContactList() {
    let elements_contact = document.querySelectorAll('.contact-wrapper.contact');
    let element_line_letters = document.querySelectorAll('.contacts-group.letters');

    element_line_letters.forEach(x => {
        $(x).remove();
    });
    elements_contact.forEach(y => {
        $(y).remove();
    });
}

function ClearFavoritesList() {
    let elements = document.querySelectorAll('.favorites-group');

    elements.forEach(x => {
        $(x).remove();
    })
}

function OnSortableContactsWithLetter(value) {
    if (!value.length) {
        LoadContacts()
    } else if (value.length) {
        ClearContactList();
        $('#contacts-block-output').css('display', 'block');
        $('#sortable-value').text("Toptreffer");
        $('#sortable-value').css('background-color', 'rgb(28 28 28 / 0%)');
        $('#sortable-value').css('font-size', '1vh');
        $('#sortable-value').css('color', '#7a7a7a');
        $('#sortable-value').css('text-transform', 'uppercase');

        let contacts = storage.contacts.filter(x => x.name.toLowerCase().startsWith(value.toLowerCase()));

        if (contacts.length) {
            setTimeout(() => {

                for (const x of contacts) {
                    let contact_element = `
                    <div onclick="OnActionClicked(this)" data-action="contact-show-information" contact-info="${x.id}" class="contact-wrapper contact" id="contact-wrapper-${x.id}">
                        <div class="contact">${x.name}</div>
                    </div>
                    `;
                    $(`#contacts-wrapper-output`).append(contact_element);
                }
            }, 1);
        } else if (!contacts.length) {
            $('#sortable-value').text("Keine Treffer");
        }
    }
}

function SetContactFavorite(number, state) {
    let contact = storage.contacts.find(x => x.number == number);
    if (contact != null) {
        contact.is_favorite = state;
    }
}

function SetContactDetails(number, action, value) {
    let contact = storage.contacts.find(x => x.number == number);
    if (contact != null) {
        switch (action) {
            case "change-contact-name":
                contact.name = value;
                break;
            case "change-contact-favorite-state":
                contact.is_favorite = value;
                LoadFavorites();
                break;
            case "change-contact-block-state":
                contact.is_blocked = value;
                break;
            case "delete-contact":
                let index = storage.contacts.indexOf(contact);
                storage.contacts.splice(index, 1);
                $(`#contact-wrapper-${contact.id}`).remove();
                ShowScreen('contacts');
                break;
            default:
                break;
        }

    }
}

function ToggleCurrentCallMute(state) {
    switch (state) {
        case true:
            $('#iphone .face .screen>.app.callscreen.active .container .control-buttons .keypad #mute').css('display', 'none')
            $('#iphone .face .screen>.app.callscreen.active .container .control-buttons .keypad #unmute').css('display', 'flex')
            break;
        case false:
            $('#iphone .face .screen>.app.callscreen.active .container .control-buttons .keypad #mute').css('display', 'flex')
            $('#iphone .face .screen>.app.callscreen.active .container .control-buttons .keypad #unmute').css('display', 'none')
            break;
        default:
            break;
    }
}

function OutgoingCall(number, isAccepted) {
    let name = "Unbekannt";

    let contact = storage.contacts.find(x => x.number == parseInt(number));
    if (contact != null) {
        name = contact.name;
    }

    $('#outgoingcall').find('.caller').text(name)
    $('#outgoingcall').find('.call-type').text('Ausgehender Anruf...')

    if (!isAccepted) {
        PlaySound("calling-outgoing", 0.25, true);
    } else {
        DestroySound();
    }
    ShowScreen('outgoingcall');
}

function IncommingCall(number, is_number_suppressed) {
    let name = "Unbekannt";

    $('#IncommingCall').find('.caller').text(name)
    $('#IncommingCall').find('.call-type').text('Eingehender Anruf...')

    if (is_number_suppressed) {
        name = "Nummer unterdrückt";
    } else if (!is_number_suppressed) {
        let contact = storage.contacts.find(x => x.number == number);
        if (contact != null) {
            name = contact.name;
        } else {
            name = "Unbekannt";
        }
    }
    $('#IncommingCall').find('.caller').text(name)

    if (storage.settings.is_soundmuted) {
        PlaySound("calling-vibration", 0.25, true);
    } else {
        PlaySound(`calling-${storage.settings.call_sound_effect}`, 0.25, true);
    }
    ShowScreen("IncommingCall");
}

function InCall(number, is_number_suppressed) {
    let name = "Unbekannt";

    $('#incall').find('.caller').text(name)
    $('#incall').find('.call-type').text('Aktiver Anruf...');

    if (is_number_suppressed) {
        name = "Nummer unterdrückt";
    } else if (!is_number_suppressed) {
        let contact = storage.contacts.find(x => x.number == number);
        if (contact != null) {
            name = contact.name;
        } else {
            name = "Unbekannt";
        }
    }
    $('#IncommingCall').find('.caller').text(name)

    storage.call_active = true;
    storage.call_number = number;
    storage.call_started_at = new Date();
    DestroySound();
    ShowScreen("incall")
}

function KillCall() {
    storage.call_active = false;
    storage.call_number = null;
    storage.call_started_at = 0;
    DestroySound();
    ShowScreen("homescreen");
}

function ToggleCreateNewContactMarkAsFavorite(element) {

    if (element == null) return;

    let markAsFav = $(element).attr('data-toggle');

    if (markAsFav == null) return;

    switch (markAsFav) {
        case "true":
            $(element).find('.plus.icon').css('display', 'flex')
            $(element).find('.minus.icon').css('display', 'none')
            $(element).parent().find('.title').text('Als Favoriten hinzufügen')
            $(element).attr('data-toggle', "false");
            break;
        case "false":
            $(element).find('.plus.icon').css('display', 'none')
            $(element).find('.minus.icon').css('display', 'flex')
            $(element).parent().find('.title').text('Als Favorit entfernen')
            $(element).attr('data-toggle', "true");
            break;
        default:
            break;
    }
}

function AddNewContact() {
    let firstName = $('#addcontact').find('#Vorname').val();
    let secondName = $('#addcontact').find('#Nachname').val();
    let phoneNumber = $('#addcontact').find('#Telefonnummer').val();
    let is_favorite = $('#addcontact').find('#addnewcontact').attr('data-toggle');

    if (firstName.length <= 3 || secondName.length <= 3 || !Number.isInteger(parseInt(phoneNumber))) {
        ShowNotification("Fehler", "Jetzt", "Bitte achte darauf das alle Felder ausgefüllt sind", "0");
        return;
    }

    let ContactsIds;

    if (storage.contacts.length) {
        ContactsIds = storage.contacts.map(x => {
            return x.id;
        })
    } else {
        ContactsIds = [0];
    }

    let ContactMaxId = Math.max(...ContactsIds);
    ContactMaxId++;

    if (ContactMaxId != null || ContactMaxId != Infinity) {
        let ContactName = `${firstName} ${secondName}`
        let ContactPhoneNumber = parseInt(phoneNumber);
        let IsContactFacorite = JSON.parse(is_favorite);

        const splitContactName = ContactName.split(' ');

        if (ContactName.length >= 30) {
            ShowNotification("Fehler", "Jetzt", "Der Vor & Nachname darf Maximal aus 30 Zeichen bestehen!", "0");
            return;
        }

        if (splitContactName.length <= 2) {
            Add_Contact(ContactMaxId, ContactName, ContactPhoneNumber, IsContactFacorite, false);
            ShowScreen('contacts');
            RemoteCall("Phone:Contact:Add", ContactName, ContactPhoneNumber, IsContactFacorite, false);
        } else {
            ShowNotification("Fehler", "Jetzt", "Bitte achte auf die Formatierung z. B.: Max Mustermann", "0");
        }
    } else {
        ShowNotification("Fehler", "Jetzt", "Wir konnten keinen neuen Kontakt erstellen da ein Problem aufgetreten ist", "0");
    }
}

function EditContactInfo() {

    if (data.currentSelectedContact != null) {
        let Contact = storage.contacts.find(x => x.id == data.currentSelectedContact);
        if (Contact != null) {
            let NewFirstName = $('#contact-firstname-value').val();
            let NewSecName = $('#contact-secname-value').val();
            let NewPhoneNumber = $('#contact-phonenumber-value').val();

            let ConbinedName = `${NewFirstName} ${NewSecName}`;

            const splitContactName = ConbinedName.split(' ');

            if (ConbinedName.length >= 30) {
                ShowNotification("Fehler", "Jetzt", "Der Vor & Nachname darf Maximal aus 30 Zeichen bestehen!", "0");
                return;
            }

            if (splitContactName.length <= 2) {
                Contact.name = ConbinedName;
                Contact.number = parseInt(NewPhoneNumber);
                SetContactInfo(Contact.name, Contact.number, Contact.is_favorite, Contact.is_blocked, false);
                ShowScreen('contact-information');
                RemoteCall("Phone:Contact:Edit", data.currentSelectedContact, ConbinedName, NewPhoneNumber);
            } else {
                ShowNotification("Fehler", "Jetzt", "Bitte achte auf die Formatierung z. B.: Max Mustermann", "0");
            }
        }
    }
}

function AddContactFormNumberField() {
    let number = $('#phone .container .number-wrapper .number').html();

    if (number != null) {
        ShowScreen('addcontact');
        $('#addcontact').find('#Telefonnummer').val(parseInt(number));
    }
}

function TryPhoneCall(number) {

}

//SETTINGS APP FUNCTIONS
function ChangeBackground(element) {
    if (element == null) return;
    let backgroundId = $(element).attr("data-img");
    if (backgroundId == null) return;
    if (storage.background_images.find(x => x == backgroundId)) {
        if (storage.settings == null) return;
        storage.settings.background_image = backgroundId;

        $("#iphone .face .screen>.app .container .workspace-wrapper .category .wrapper .row #active").each(function() {
            $(this).css('display', 'none')
        });

        $("#iphone .face .screen>.app .container .workspace-wrapper .category .wrapper .row #nonactive").each(function() {
            $(this).css('display', 'block')
        });

        $(element).find('#active').css('display', 'block');
        $(element).find('#nonactive').css('display', 'none');

        $('.screen.wallpaper').css('backgroundImage', `url(../utils/img/smartphone/backgrounds/${backgroundId}.png`);
    }
}

function SavePhoneSettings() {
    RemoteCall("Phone:ChangeSettings", JSON.stringify(storage.settings))
}

function LoadPhoneSettings() {
    $('#settings').find('#flymodeCheckbox').attr('checked', storage.settings.is_flightmodel);
    $('#settings').find('#muteCheckbox').attr('checked', storage.settings.is_soundmuted);
    $('#settings').find('#unknownnumber').attr('checked', storage.settings.is_number_suppressed);

    ChangeBackground($('#gallery').find(`[data-img=${storage.settings.background_image}]`)[0])

    let MessageElement = $('#iphone .face .screen>.app .container .workspace-wrapper .category .sound-wrapper').get(0);
    let MessageSoundElement = $(MessageElement).find(`.sound-row [data-sound="${storage.settings.message_sound_effect}"]`).get(0);
    let CallingElement = $('#iphone .face .screen>.app .container .workspace-wrapper .category .sound-wrapper').get(1);
    let CallingSoundElement = $(CallingElement).find(`.sound-row [data-sound="${storage.settings.call_sound_effect}"]`).get(0);

    ChangeMessageAudio(MessageSoundElement);
    ChangeCallingAudio(CallingSoundElement);
}



function ChangeMessageAudio(element) {
    if (element == null) return;

    if ($(element).attr('data-audio') != 'message') {
        ShowNotification("Fehler", "Jetzt", "Die ausgewählte Datei entspricht nicht dem Typen \"sound\"", "error")
        return;
    }

    if (storage.settings == null) {
        ShowNotification("Fehler", "Jetzt", "Es ist ein Speicher fehler aufgetreten!", "error")
        return;
    } else {
        let parent = $(element).parent();

        if (parent == null) {
            ShowNotification("Fehler", "Jetzt", "Diese datei kann nicht gefunden werden!", "error")
            return;
        } else {
            let sound = $(element).attr('data-sound')
            storage.settings.message_sound_effect = parseInt(sound);
            $("#iphone .face .screen>.app .container .workspace-wrapper #message .sound-wrapper .sound-row #star-fav").each(function() {
                $(this).css('display', 'none')
            });

            $("#iphone .face .screen>.app .container .workspace-wrapper #message .sound-wrapper .sound-row #star-no-fav").each(function() {
                $(this).css('display', 'block')
            });

            $(parent).find('#star-fav').css('display', 'block')
            $(parent).find('#star-no-fav').css('display', 'none')
        }
    }
}

function ChangeCallingAudio(element) {
    if (element == null) return;

    if ($(element).attr('data-audio') != 'calling') {
        ShowNotification("Fehler", "Jetzt", "Die ausgewählte Datei entspricht nicht dem Typen \"sound\"", "error")
        return;
    }
    if (storage.settings == null) {
        ShowNotification("Fehler", "Jetzt", "Es ist ein Speicher fehler aufgetreten!", "error")
        return;
    } else {
        let parent = $(element).parent();

        if (parent == null) {
            ShowNotification("Fehler", "Jetzt", "Diese datei kann nicht gefunden werden!", "error")
            return;
        } else {
            let sound = $(element).attr('data-sound')
            storage.settings.call_sound_effect = parseInt(sound);
            $("#iphone .face .screen>.app .container .workspace-wrapper #calling .sound-wrapper .sound-row #star-fav").each(function() {
                $(this).css('display', 'none')
            });

            $("#iphone .face .screen>.app .container .workspace-wrapper #calling .sound-wrapper .sound-row #star-no-fav").each(function() {
                $(this).css('display', 'block')
            });

            $(parent).find('#star-fav').css('display', 'block')
            $(parent).find('#star-no-fav').css('display', 'none')
        }
    }
}
//MESSANGER APP

async function CreatenNewMessagerChat(MessangerChatJson) {
    let newChat = JSON.parse(MessangerChatJson);
    if (newChat == null) {
        ShowNotification("Fehler", "Jetzt", "Speicher fehler", "0");
        return;
    } else {
        await AddMessageChat(newChat.id, newChat.sender, newChat.reciever, newChat.messages).then(result => {
            if (newChat.sender == storage.playerinfo.phonenumber) {

                let number = newChat.sender != storage.playerinfo.phonenumber ? newChat.sender : newChat.reciever; /* fix for bug 01 */

                OpenMessageChat(parseInt(number));
            }
        });
    }
}

function TryOpenMessangerChat(number) {
    let MessageChat = storage.messagechats.find(x => x.reciever == number || x.sender == number);

    if (MessageChat != null) {
        OpenMessageChat(parseInt(number));
    } else if (MessageChat == null) {
        RemoteCall("Phone:Messanger:Create:New:Chat", storage.playerinfo.phonenumber, number);
    }
}

function TryOpenMessagerChatFromContacts(reciever_id) {

    let Contact = storage.contacts.find(x => x.id == reciever_id);

    if (Contact == null) ShowNotification("Fehler", "Jetzt", "Kontakt im speicher nicht gefunden!", "0");
    else if (Contact != null) {
        if (Contact.number == storage.playerinfo.phonenumber) ShowNotification("Fehler", "Jetzt", "Speicher fehler", "0")
        else {
            let MessageChat = storage.messagechats.find(x => x.reciever == Contact.number || x.sender == Contact.number);

            if (MessageChat != null) OpenMessageChat(parseInt(Contact.number));
            else RemoteCall("Phone:Messanger:Create:New:Chat", storage.playerinfo.phonenumber, Contact.number);
        }
    }
}

async function AddMessageChat(id, sender, reciever, messages) {
    if (!storage.messagechats.find(x => x.Id == id)) {
        storage.messagechats.push(new MessageChatModel(id, sender, reciever, messages, null, true, true))

        let LastSendetMessage = messages[messages.length - 1];

        storage.messagechats.find(x => x.id == id).lastmessage = LastSendetMessage;
    }
}

function TryDeleteMessageChat(id) {
    let chat = storage.messagechats.find(x => x.id == parseInt(id));
    if (chat != null) {
        RemoteCall('Phone:Messanger:Chat:Remove', chat.sender, chat.reciever);
    } else {
        ShowNotification("Fehler", "Jetzt", "Chatverlauf nicht im speicher gefunden!", "0")
    }
}

function DeleteMessageChat(id) {
    if (storage.messagechats.find(x => x.id == id)) {

        let chat = storage.messagechats.find(x => x.id == id);
        let index = storage.messagechats.indexOf(chat);

        storage.messagechats.splice(index, 1);

        if (data.currentSelectedReciever == chat.reciever || data.currentSelectedReciever == chat.sender) {
            ShowScreen('messanger')
        }
        $('#messagener-chats').find(`.message-wrapper[data-chat-id="${id}"]`).remove();
    }
}

function OnSortableMessangerChatsWithLetter(value) {
    if (!value.length) {
        LoadMessageChats()
    } else if (value.length) {
        let messangerChats = $('#messanger .container .workspace').find('.message-wrapper').get();
        for (const x of messangerChats) {
            if (!$(x).find('.sender').html().toLowerCase().startsWith(value.toLowerCase())) {
                $(x).css('display', 'none')
            }
        }
    }
}

function GetMessageChatMessages(reciever) {
    if (storage.messagechats.length) {
        let messageChat = storage.messagechats.find(x => x.reciever == reciever);
        if (messageChat != null) {
            return messageChat.messages;
        }
    }
    return [];
}


function ConvertMessageChat(messageChatJson) {
    let output = []
    JSON.parse(messageChatJson).forEach(e => {
        output.push(new MessageChatModel(e.id, e.sender, e.reciever, e.messages, null, true, true))
    });
    return output;
}

function ConvertWorldToMap(posX, posY) {
    var calcHelper;
    var corX = 45.7;
    var calc = 122;

    if (posX > 0) {
        corX = corX + (posX / calc);
    } else {
        calcHelper = posX / calc;
        corX = corX - (calcHelper * -1);
    }
    var corY = 67.6;
    if (posY > 0) {
        corY = corY - (posY / calc);
    } else {
        calcHelper = posY / calc;
        corY = corY + (calcHelper * -1);
    }
    return [corX, corY]
}

async function OpenMessageChatFormServer(messagechatJson) {
    $('#messanger-chat').find('.workspace.chat').html("");
    let MessageChatName = "Unbekannt";
    let MessageChat = JSON.parse(messagechatJson);
    let Contact = storage.contacts.find(x => x.number == MessageChat.reciever || x.number == MessageChat.sender);

    if (Contact != null) {
        MessageChatName = Contact.name;
    } else if (Contact == null) {

        if (MessageChat.reciever != storage.playerinfo.phonenumber) {
            MessageChatName = ConvertInt(MessageChat.reciever);
        } else if (MessageChat.reciever == storage.playerinfo.phonenumber) {
            MessageChatName = ConvertInt(MessageChat.sender);
        }
    }

    $('#messanger-chat').find('.title').html(`${MessageChatName}`);

    ShowScreen('messanger-chat')

    storage.messagechats.find(x => x.id == MessageChat.id).messages = MessageChat.messages;
    storage.messagechats.find(x => x.id == MessageChat.id).newmessage = false;
    storage.messagechats.find(x => x.id == MessageChat.id).lastmessage = MessageChat.messages[MessageChat.messages.length - 1];
    storage.messagechats.find(x => x.id == MessageChat.id).firstload = false;

    await LoadChatMessages(MessageChat.messages).then(result => {
        ScrollToBottom('messamger-chat-list');
    });
}

async function OpenMessageChat(reciever) {
    if (data.isCurrentInEditChatsMode) return;
    data.currentSelectedReciever = reciever;

    $('#messanger-chat').find('.workspace.chat').html("");
    let MessageChatName = "Unbekannt";
    let MessageChat = storage.messagechats.find(x => x.reciever == reciever || x.sender == reciever);
    let Contact = storage.contacts.find(x => x.number == MessageChat.reciever || x.number == MessageChat.sender);

    if (Contact != null) {
        MessageChatName = Contact.name;
    } else if (Contact == null) {
        if (reciever != storage.playerinfo.phonenumber) {
            MessageChatName = ConvertInt(reciever);
        }
    }

    $('#messanger-chat').find('.title').html(`${MessageChatName}`);

    if (!MessageChat.messages.length) {
        RemoteCall('Phone:Messanger:Get:ChatMessages', storage.playerinfo.phonenumber, reciever);
        return;
    }

    await LoadChatMessages(MessageChat.messages).then(result => {
        MessageChat.newmessage = false;
        MessageChat.lastmessage = MessageChat.messages[MessageChat.messages.length - 1];
        MessageChat.firstload = false;
        ShowScreen('messanger-chat')
        ScrollToBottom('messamger-chat-list');
    });
}

async function LoadChatMessages(messages) {
    if (messages.length) {
        for (const x of messages) {

            let time = new Date(parseInt(x.datetime)).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
            let date = new Date(parseInt(x.datetime)).toLocaleDateString();
            let MeMessage = "";
            let YouMessage = "";

            switch (x.type) {
                case 1:
                    MeMessage = `
                    <div class="messages-group my">
                        <div class="message">${x.content}<p>${time} - ${date}</p></div>
                    </div>`;
                    YouMessage = `
                    <div class="messages-group">
                        <div class="message">${x.content}<p>${time} - ${date}</p></div>
                    </div>`;
                    break;
                case 2:
                    let posX = x.content.split('#')[2];
                    let posY = x.content.split('#')[3];

                    MeMessage = `
                    
                    <div class="messages-group my" onclick="SetGpsMarkerPostion(${posX},${posY})">
                        <div class="message" style="width: 20vh; height: 13.5vh; padding:0; display: flex; flex-direction: column; align-items: center;" ><div class="gps-map" style="background-position-x: ${ConvertWorldToMap(posX, posY)[0]}%; background-position-y: ${ConvertWorldToMap(posX, posY)[1]}%;"><i class="fas fa-map-marker-alt naviCenter"></i></div></div>
                    </div>`;

                    YouMessage = `
    
                    <div class="messages-group" onclick="SetGpsMarkerPostion(${posX},${posY})">
                        <div class="message" style="width: 20vh; height: 13.5vh; padding:0; display: flex; flex-direction: column; align-items: center;" ><div class="gps-map" style="background-position-x: ${ConvertWorldToMap(posX, posY)[0]}%; background-position-y: ${ConvertWorldToMap(posX, posY)[1]}%;"><i class="fas fa-map-marker-alt naviCenter"></i></div></div>
                    </div>`;
                    break;
                case 3:
                    break;
                default:
                    break;
            }

            if (x.sender == storage.playerinfo.phonenumber) {
                $('#messanger-chat').find('.workspace.chat').append(MeMessage);
            } else {
                $('#messanger-chat').find('.workspace.chat').append(YouMessage);
            }
            ScrollToBottom('messamger-chat-list');
        }
    }
}

async function AddChatMessage(id, sender, reciever, content, datetime, type) {

    let MessageChat = storage.messagechats.find(x => x.id == id);

    if (MessageChat == null) return;

    let Messages = MessageChat.messages

    Messages.push(new MessageModel(0, sender, reciever, content, datetime, type))

    MessageChat.lastmessage = new MessageModel(Infinity, sender, reciever, content, datetime, type);

    if (sender != storage.playerinfo.phonenumber) {
        PlayeMessageSound();
    }

    if (data.currentSelectedReciever != null) {
        if (data.currentSelectedReciever == reciever || data.currentSelectedReciever == sender) {

            let time = new Date(parseInt(datetime)).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
            let date = new Date(parseInt(datetime)).toLocaleDateString();
            let MeMessage = "";
            let YouMessage = "";

            switch (type) {
                case 1:
                    MeMessage = `
                    <div class="messages-group my">
                        <div class="message">${content}<p>${time} - ${date}</p></div>
                    </div>`;
                    YouMessage = `
                    <div class="messages-group">
                        <div class="message">${content}<p>${time} - ${date}</p></div>
                    </div>`;
                    break;
                case 2:
                    let posX = content.split('#')[2];
                    let posY = content.split('#')[3];
                    MeMessage = `
    
                    <div class="messages-group my" onclick="SetGpsMarkerPostion(${posX},${posY})">
                        <div class="message" style="width: 20vh; height: 13.5vh; padding:0; display: flex; flex-direction: column; align-items: center;" ><div class="gps-map" style="background-position-x: ${ConvertWorldToMap(posX, posY)[0]}%; background-position-y: ${ConvertWorldToMap(posX, posY)[1]}%;"><i class="fas fa-map-marker-alt naviCenter"></i></div></div>
                    </div>`;

                    YouMessage = `
    
                    <div class="messages-group" onclick="SetGpsMarkerPostion(${posX},${posY})">
                        <div class="message" style="width: 20vh; height: 13.5vh; padding:0;  display: flex; flex-direction: column; align-items: center;" ><div class="gps-map" style="background-position-x: ${ConvertWorldToMap(posX, posY)[0]}%; background-position-y: ${ConvertWorldToMap(posX, posY)[1]}%;"><i class="fas fa-map-marker-alt naviCenter"></i></div></div>
                    </div>`;
                    break;
                case 3:

                    break;

                default:
                    break;
            }

            if (sender == storage.playerinfo.phonenumber) {
                $('#messanger-chat').find('.workspace.chat').append(MeMessage);
            } else {
                $('#messanger-chat').find('.workspace.chat').append(YouMessage);
            }
            ScrollToBottom('messamger-chat-list');
        } else {
            MessageChat.newmessage = true;
        }
    }
}

function Debug(value) {
    //mp.trigger('Client:Phone:Debug', value);
}

$("#messanger-chat").find('input[type="text"]').on("keydown", function search(e) {
    if (e.keyCode == 13) {
        SendChatMessageAtClick(1);
    }
});


async function SendChatMessageAtClick(messageType) {
    let MessageContent = "";
    if (data.currentDelayOnMessageSend + 1500 < Date.now()) {
        data.currentDelayOnMessageSend = Date.now();
        if (data.currentSelectedReciever != null) {

            if (data.currentSelectedReciever == storage.playerinfo.phonenumber) {
                ShowNotification("Fehler", "Jetzt", "Es ist ein Fehler im Chat aufgetreten daher haben wir sie wieder auf dem Home screen resettet.", "0");
                ShowScreen("homescreen");
                return;
            }

            switch (messageType) {
                case 1:
                    MessageContent = $('#messanger-chat').find('input[type="text"]').val()
                    break;
                case 2:
                    MessageContent = "#GPSLOCATION#1#1#";
                    break;
                case 3:
                    //IMAGE
                    break;
                default:
                    break;
            }

            let ChatMessages = GetMessageChatMessages(data.currentSelectedReciever);
            if (!MessageContent || MessageContent === "" || MessageContent.length <= 0) {
                ShowNotification("Fehler", "Jetzt", "Das Feld darf nicht leer sein", "0");
                return;
            }

            let LetterCount = 0;
            for (const x of ChatMessages) {
                LetterCount += JSON.stringify(x).length;
            }

            if ((LetterCount + MessageContent.length) <= 50000) {

                RemoteCall("Phone:Messanger:Message:Send", data.currentSelectedReciever, MessageContent, Date.now().toString(), messageType);

                //AddChatMessage(12, storage.playerinfo.phonenumber, data.currentSelectedReciever, MessageContent, Date.now().toString(), messageType);

                PlaySound("message-send", 1, false);

                $("#messanger-chat").find('input[type="text"]').val("");

            } else {
                ShowNotification("Speicher Fehler", "Jetzt", "Der Chatverlauf Speicher ist zu voll um eine weitere Nachricht aufzunehmen!", "0")
            }
        }
    }
}

function ToggleEditChats(element) {
    if (element == null) return;
    let action = $(element).attr('data-action');
    if (action == null) return;
    let allChatElements = $('#iphone .face .screen>.app.messages .container .workspace .message-wrapper').get();

    switch (action) {
        case "edit":
            $(allChatElements).each(function() {
                $(this).find('.datetime').css('display', 'none');
                $(this).find('.delete').css('display', 'block');
            });
            $(element).attr('data-action', 'finish');
            $(element).html("Fertig");
            data.isCurrentInEditChatsMode = true;
            break;
        case "finish":
            $(allChatElements).each(function() {
                $(this).find('.datetime').css('display', 'block');
                $(this).find('.delete').css('display', 'none');
            });
            $(element).attr('data-action', 'edit');
            $(element).html("Bearbeiten");
            data.isCurrentInEditChatsMode = false;
            break;
        default:
            break;
    }
}

//RADIO 

function ConnectToRadio(connect) {
    if (connect) {
        let freq = $('#radio-freq-input').val();

        if (freq == NaN || freq == undefined || !freq.length) return;

        if (parseFloat(storage.radio.frequenz) == parseFloat(freq)) return;

        if (parseFloat(storage.radio.frequenz) != parseFloat(freq)) {
            RemoteCall("Phone:Radio:ChangeFreq", parseFloat(freq));
        }
    } else {
        RemoteCall("Phone:Radio:QuitFreq");
    }
}

function SetRadioInformations(data) {
    if (data != undefined) {
        storage.radio = JSON.parse(data);
        UpdateRadioApp();
    }
}

function UpdateRadioApp() {

    if (storage.radio.frequenz <= 0) {
        $('#radio-freq-input').val("");
        $('#radio-freq-input').focus();
        $('#radio').find('.content').css('display', 'none');
        let header = $('#radio').find('.title-header');
        let text = $(header).find('p');
        $(text).html(`Aktuelle Verbindung: <span style="color: red;"> Nicht Verbunden</span>`)
    } else {
        $('#radio').find('.content').css('display', 'block');

        let header = $('#radio').find('.title-header');
        let text = $(header).find('p');
        $(text).html(`Aktuelle Verbindung: <span style="color: green;"> Verbunden</span>`)

        if (storage.radio.state == true) {
            $('#radio-state').text(' Public');
            $('#radio-state').css('color', 'green');
        } else {
            $('#radio-state').text(' Private');
            $('#radio-state').css('color', 'red');
        }

        $('#radio-name').text(` ${storage.radio.name}`);
        $('#radio-freq').text(` ${storage.radio.frequenz}`);
        $('#radio-members').text(` ${storage.radio.members}`);
        $('#radio-maxslots').text(` ${storage.radio.maxslots}`);
    }
}
//LIFEINVADER

function AddLifeinvaderMessage(id, content, phonenumber, date, type) {

    if (storage.lifeinvader_messages.find(x => x.id == id)) return;

    storage.lifeinvader_messages.push(new LifeinvaderModel(id, content, phonenumber, date, type));

    let element = `
    <div id="lifeinvader-message-${id}" class="lifeinvader-message-wrapper">
        <p class="header">Nachricht:</p>
        <p class="content">${content}</p>
        <div class="footer">
            <i class="fa-regular fa-comment"></i>
            <i class="fa-regular fa-phone-flip"></i>
            <p>Tel: ${phonenumber}</p>
            <p>${date}</p>
        </div>
    </div>
    `;

    $('#lifeinvader').find('.workspace').append(element);

    ScrollToBottom('lifeinvader-wrapper');
}

function RemoveLifeinvaderMessage(id) {
    let lifearray = storage.lifeinvader_messages;
    for (let i = 0; i < lifearray.length; i++) {
        if (lifearray[i].id == id) {
            storage.lifeinvader_messages.splice(lifearray.indexOf(lifearray[i]), 1);
            $(`#lifeinvader-message-${id}`).remove();
        }
    }
}

//FACTION

function LoadFactionMembersFromServer() {
    if (storage.playerinfo.faction.id != 0) RemoteCall("Server:Phone:RequestFactionMembers");
}

function LoadFactionMembers(members) {
    members = JSON.parse(members);

    let list = $('#faction').find('.members');

    document.querySelectorAll("#faction .list").forEach(x => {
        $(x).html("");
    })

    document.querySelectorAll("#faction .space").forEach(x => {
        $(x).css('display', 'none')
    })

    document.querySelectorAll("#faction .line").forEach(x => {
        $(x).css('display', 'none')
    })

    if (members.length) {
        for (const x of members) {

            let rank = x.rank;
            let name = x.name;
            let number = x.phonenumber;

            if (name.includes("_")) name = name.replace('_', ' ');

            $(list).find(`.line[rank=${rank}]`).css('display', 'flex')
            $(list).find(`.list[rank=${rank}]`).css('display', 'block')
            $(list).find(`.space[rank=${rank}]`).css('display', 'block')

            let member_element = `<div class="line player-row">${name}<span><i onclick="TryOpenMessangerChat(${number})" style="color: #0072ff;"class="fa-solid fa-comments"></i><i onclick="RemoteCall('Phone:Call:Try', parseInt(number))" style="color: green;" class="fa-regular fa-phone-flip"></i></span></div>`;
            $(list).find(`.list[rank=${rank}]`).append(member_element);
        }
    }

    let factionName = storage.playerinfo.faction.name;
    let factionId = storage.playerinfo.faction.id;

    $('#faction').find('.player-img img').css('background-image', `../utils/img/fractionLogos/${factionId}.png`)
    $('#faction').find('.player-name').text(`${factionName}`);
    $('#faction').find('.info-array').text(`${members.length} Mitglieder Online`);
}

//NAVIGATION

// function ResetNavigation() {

//     $('#navigator').find('.workspace').html("");

//     var elements = $("#iphone .face .screen>.app.navigator .navigator-bar-wrapper .navigator-bar .navs .nav");

//     $(elements).each((index, elem) => {
//         $(elem).removeClass('active');
//     });

//     $(elements).first().addClass('active');

//     LoadNavigation(1);
// }

// function OnSearchNavigation() {
//     let value = $('#navigator').find('#navsearch').val();

//     let category = $('#navigator').find('.nav.active').attr('data-category');
//     if (category == undefined) return;

//     let gps_locations = storage.gps_locations.filter(x => x.Category == category && x.Name.toLowerCase().startsWith(value.toLowerCase()));
//     if (gps_locations == undefined) return;

//     $('#navigator').find('.workspace').html("");

//     for (const x of gps_locations) {

//         let element = `                            
//         <div class="navigator-item-wrapper">
//             <div class="navigator-item">
//                 <div class="title">${x.Name}</div>
//             </div>
//         </div>`;

//         $('#navigator').find('.workspace').append(element);
//     }
// }

//LOAD FUNCTIONS

function LoadlifeinvaderMessages() {
    $('#lifeinvader-wrapper').html("");

    if (storage.lifeinvader_messages.length) {
        for (const x of storage.lifeinvader_messages) {
            if (x.id && x.content && x.date) {

                let footer = `                    
                <div class="footer">
                    <i class="fa-regular fa-comment" onclick="TryOpenMessangerChat(${x.phonenumber})"></i>
                    <i class="fa-regular fa-phone-flip" onclick="RemoteCall('Phone:Call:Try', ${x.phonenumber})"></i>
                    <p>${x.phonenumber}</p>
                    <p>${x.date}</p>
                </div>`;

                let footer2 = `
                <div class="footer">
                    <p>Unbekannt</p>
                    <p>${x.date}</p>
                </div>`;

                let output = x.phonenumber != 0 ? footer : footer2;

                let element = `
                <div id="lifeinvader-message-${x.id}" class="lifeinvader-message-wrapper">
                    <p class="header">Nachricht:</p>
                    <p class="content">${x.content}</p>
                    ${output}
                </div>
                `;

                $('#lifeinvader').find('.workspace').append(element);
            }
        }
        setTimeout(() => {
            //ScrollToBottom('lifeinvader-wrapper');
        }, 1);
    }
}

function LoadMessageChats() {
    $('#messanger').find('.workspace').html("");
    setTimeout(() => {

        $('#editChatMessages').attr('data-action', 'finish');

        let editChatMessagesElement = $('#editChatMessages');

        ToggleEditChats(editChatMessagesElement);

        if (storage.messagechats.length) {
            for (const x of storage.messagechats) {

                let chatname = "Unbekannt";
                let chatReciever = storage.contacts.find(c => c.number == x.reciever || c.number == x.sender);
                let chattime = "";
                let chatLastMessage = "Nachrichten noch nicht geladen!";

                if (chatReciever != null) {
                    chatname = chatReciever.name;
                } else if (chatReciever == null) {
                    if (x.reciever != storage.playerinfo.phonenumber) {
                        chatname = ConvertInt(x.reciever);
                    } else if (x.sender != storage.playerinfo.phonenumber) {
                        chatname = ConvertInt(x.sender);
                    }
                }

                let dotelement = `<div class="dot" style="opacity: 0;"></div>`;

                if (x.newmessage) {
                    dotelement = `<div class="dot" style="opacity: 1;"></div>`;
                }

                if (x.lastmessage) {
                    if (x.lastmessage.content.startsWith('#GPSLOCATION#')) {
                        chatLastMessage = "Standort";
                    } else {
                        chatLastMessage = x.lastmessage.content;
                    }
                } else if (!x.lastmessage) {
                    x.lastmessage = new MessageModel(Infinity, 0, 0, "", 0);
                    x.lastmessage.datetime = 0;
                    x.lastmessage.content = "Noch keine Nachrichten";
                    chatLastMessage = "Noch keine Nachrichten";
                }

                if (x.firstload) {
                    chatLastMessage = "Nachrichten noch nicht geladen!";
                }

                if (x.lastmessage.datetime != 0) {
                    let date = parseInt(x.lastmessage.datetime);
                    let daydiff = new Date(date).getDay() - new Date().getDay();
                    switch (daydiff) {
                        case 0:
                            chattime = new Date(date).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
                            break;
                        case -1:
                            chattime = "Gestern";
                            break;
                        case -2:
                            chattime = new Date(date).toLocaleDateString();
                            break;
                        default:
                            chattime = new Date(date).toLocaleDateString(); /* DEFAULT VALUE */
                            break;
                    }
                }

                let chatImageelement = `
                    <div class="ring">
                        <p>${chatname.toUpperCase().charAt(0)}</p>
                    </div>
                `;

                if (!chatReciever) {
                    chatImageelement = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35">
                        <g transform="matrix(1.039 0 0 1.039 .358 .359)">
                            <circle cx="15.845" cy="15.845" r="15.845" transform="translate(.655 .655)"/>
                            <path d="M16.845 1a15.845 15.845 0 0 0 0 31.69h.2a16.567 16.567 0 0 1-11.027-4.424c2.443-2.179 6.734-2.311 7.592-4.555.066-1.056.066-1.783.066-2.773a5.458 5.458 0 0 1-1.519-3.238c-.4 0-.99-.4-1.122-1.849a1.379 1.379 0 0 1 .528-1.386c-1.254-4.952-.594-9.243 5.282-9.375 1.452 0 2.575.4 3.037 1.188 4.291.594 2.971 6.338 2.377 8.187a1.519 1.519 0 0 1 .528 1.386c-.2 1.452-.792 1.849-1.122 1.849a5.1 5.1 0 0 1-1.518 3.235 19.679 19.679 0 0 0 .066 2.773c.858 2.245 5.15 2.443 7.592 4.621a19.83 19.83 0 0 1-9.441 4.357 15.883 15.883 0 0 0-1.519-31.686z" transform="translate(-.345 -.345)"/>
                        </g>
                    </svg>`;
                }

                let rec = 0;

                if (x.reciever == storage.playerinfo.phonenumber) {
                    rec = x.sender;
                } else {
                    rec = x.reciever;
                }

                let element = `
                                <div class="message-wrapper" onclick="OnActionClicked(this)" data-chat-id="${x.id}" data-action="messanger-chat" data-reciever="${rec}">
                                    <div class="dot-block">
                                        ${dotelement}
                                    </div>
                                    <div class="icon-wrapper">
                                        <div class="icon img">
                                            ${chatImageelement}
                                        </div>
                                    </div>
                                    <div class="message">
                                        <div class="basic-info">
                                            <div class="sender">${chatname}</div>
                                            <div class="info">
                                                <div class="datetime">${chattime}</div>
                                                <div class="delete" onclick="TryDeleteMessageChat('${x.id}')">Löschen</div>
                                            </div>
                                        </div>
                                        <div class="message-text">
                                            <p>${chatLastMessage}</p>
                                        </div>
                                    </div>
                                </div>
                
                `;

                $('#messanger').find('.workspace').append(element);

                ScrollToBottom('messamger-chat-list');
            }
        }
    }, 1);
}

function LoadCallHistory() {
    $('#callhistory-wrapper').html('');
    setTimeout(() => {
        for (const x of storage.call_history) {
            if (x.is_missed) {
                let element_one = `
                <div class="call-wrapper" id="callhistory-item-${x.id}">
                    <div class="call missed">
                        <div class="basic-info">
                            <div class="caller">${x.name}</div>
                            <div class="call-type">${x.action}</div>
                        </div>
                        <div class="datetime">${x.time}</div>
                        <div class="info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 8">
                                <path d="M.793 7.658v-4.92h-.793v-.307h2.226v5.221h.774v.348h-3v-.342zm.717-6.091a.821.898 0 0 0 .896-.781.821.898 0 0 0-.896-.781.821.898 0 0 0-.896.781.821.898 0 0 0 .896.782z"/>
                            </svg>
                        </div>
                    </div>
                </div>`;
                $("#callhistory-wrapper").append(element_one);
            } else {
                let element_sec = `
                <div class="call-wrapper" id="callhistory-item-${x.id}">
                    <div class="call">
                        <div class="basic-info">
                            <div class="caller">${x.name}</div>
                            <div class="call-type">${x.action}</div>
                        </div>
                        <div class="datetime">${x.time}</div>
                        <div class="info-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 8">
                                <path d="M.793 7.658v-4.92h-.793v-.307h2.226v5.221h.774v.348h-3v-.342zm.717-6.091a.821.898 0 0 0 .896-.781.821.898 0 0 0-.896-.781.821.898 0 0 0-.896.781.821.898 0 0 0 .896.782z"/>
                             </svg>
                        </div>
                    </div>
                </div>`;
                $("#callhistory-wrapper").append(element_sec);
            }
        }
    }, 1);
}

function LoadPhoneApps() {
    $('.apps').html("");
    $('.dock-apps').html("");
    setTimeout(() => {
        for (const x of storage.apps) {
            if (x.is_panel_app) {
                let element_one = `                            
                <li onclick="OnAppClick(this)" class="app" id="phone-app-${x.id}" data-page="${x.pagedata}">
                    <div class="icon">
                        <img src="../utils/img/smartphone/apps/${x.img_name}.svg" alt="">
                    </div>
                </li>`;
                $(".dock-apps").append(element_one);
            } else {
                let element_sec = `
                <div onclick="OnAppClick(this)" class="app-wrapper" id="phone-app-${x.id}" data-page="${x.pagedata}">
                    <div class="app">
                        <div class="icon">
                            <img src="../utils/img/smartphone/apps/${x.img_name}.svg" alt="">
                        </div>
                        <div class="title">${x.name}</div>
                    </div>
                </div>`;
                $(".apps").append(element_sec);
            }
        }
    }, 1);
}

function LoadContacts() {
    $('#contacts-block-output').css('display', 'none');
    ClearContactList();
    setTimeout(() => {
        for (const x of storage.contacts) {
            let first_letter = x.name.toUpperCase().charAt(0);

            if ($(`#contacts-block-${first_letter}`).length == 0) {
                let element_contact_wrapper = `
                <div class="contacts-group letters" id="contacts-block-${first_letter}">
                    <div class="title">${first_letter}</div>
                    <div id="contacts-wrapper-${first_letter}">
                    </div>
                </div>
                `;
                $("#contacts-wrapper-list").append(element_contact_wrapper);
            }
            if ($(`#contacts-block-${first_letter}`).length != 0) {
                if ($(`#contact-wrapper-${first_letter}`).length == 0) {
                    let contact_element = `
                    <div onclick="OnActionClicked(this)" data-action="contact-show-information" contact-info="${x.id}" class="contact-wrapper contact" id="contact-wrapper-${x.id}">
                        <div class="contact">${x.name}</div>
                    </div>
                    `;
                    $(`#contacts-wrapper-${first_letter}`).append(contact_element);
                }
            }
        }
    }, 1);
}

function LoadFavorites() {
    ClearFavoritesList();
    setTimeout(() => {
        for (const x of storage.contacts) {

            if (x.is_favorite) {
                let first_letter = x.name.toUpperCase().charAt(0);
                let element = `
                <div onmouseover="mouseenterfavorites(this)" onmouseleave="mouseleavefavorites(this)" class="favorites-group">
                    <div class="contact-wrapper" id="contact-wrapper-favorites">
                        <div class="contact-circle">${first_letter}</div>
                        <p onclick="SetContactDetails(${x.number}, 'change-contact-favorite-state', false)" class="delete-fav"><i class="fas fa-times"></i></p>
                        <div onclick="OnActionClicked(this)" data-action="contact-show-information" contact-info="${x.id}" class="contact">
                            <p class="contact-name">${x.name}</p>
                            <p class="contact-number">${x.number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')}</p>
                        </div>
                    </div>
                </div>
                `;

                $('#contacts-wrapper-list-favorites').append(element);
            }
        }
    }, 1);
}

function LoadPlayerInformation() {
    $('#profil').find('#profile-firstname').html(storage.playerinfo.name.split('_')[0]);
    $('#profil').find('#profile-secname').html(storage.playerinfo.name.split('_')[1]);
    $('#profil').find('#profile-birth').html(storage.playerinfo.birth);
    $('#profil').find('#profile-country').html(storage.playerinfo.country);
    $('#profil').find('#profle-maritalstatus').html(storage.playerinfo.maritalstatus);
    $('#profil').find('#profile-phonenumber').html(storage.playerinfo.phonenumber);
    $('#profil').find('#profile-visalevel').html(storage.playerinfo.visalevel);
    $('#profil').find('#profile-job').html(storage.playerinfo.job);
    $('#profil').find('#profile-house').html(storage.playerinfo.house);
    $('#settings').find('.player-name').html(`${storage.playerinfo.name.split('_')[0]} ${storage.playerinfo.name.split('_')[1]}`)
}

function LoadNavigation(category) {
    let gps_locations = storage.gps_locations.filter(x => x.Category == category);
    if (gps_locations == undefined) return;

    $('#navigator').find('.workspace').html("");

    for (const x of gps_locations) {

        let element = `                            
        <div class="navigator-item-wrapper">
            <div class="navigator-item">
                <div class="title">${x.Name}</div>
            </div>
        </div>`;

        $('#navigator').find('.workspace').append(element);
    }
}

//WORKER FUNCTIONS

function PlayeMessageSound() {
    if (storage.settings.message_sound_effect == null || storage.settings.message_sound_effect == 0) {
        storage.settings.message_sound_effect = 2;
        ChangeMessageAudio($('#sounds').find(`[data-sound="${2}"]`)[0])
    }
    PlaySound(`message-${storage.settings.message_sound_effect}`, 0.25, false);
}

function ScrollToBottom(id) {
    var div = document.getElementById(id);
    div.scrollTop = div.scrollHeight - div.clientHeight;
}

function ConvertInt(input) {
    var num = input.toLocaleString();
    if (num.includes(",")) {
        num = num.replace(',', ' ');
    } else {
        num = num.replace('.', ' ');
    }
    return num.toString();
}

//INIT PHONE 

//let teststring = '{"apps":[{"id":1,"name":"Phone","img_name":"phone","is_panel_app":true,"pagedata":"phone"},{"id":2,"name":"Messanger","img_name":"message","is_panel_app":true,"pagedata":"messanger"},{"id":3,"name":"Notizen","img_name":"notes","is_panel_app":true,"pagedata":"notes"},{"id":4,"name":"Einstellungen","img_name":"settings","is_panel_app":true,"pagedata":"settings"},{"id":5,"name":"Funk","img_name":"radio","is_panel_app":false,"pagedata":"radio"},{"id":6,"name":"Lifeinvader","img_name":"lifeinvader","is_panel_app":false,"pagedata":"lifeinvader"},{"id":7,"name":"Fraktion","img_name":"faction","is_panel_app":false,"pagedata":"faction"}],"contacts":[],"messagechats":[],"settings":{"Id":0,"AccountId":2,"is_flightmodel":false,"is_soundmuted":false,"is_number_suppressed":false,"call_sound_effect":1,"message_sound_effect":1,"background_image":1},"gps_locations":[],"playerinfo":{"name":"Luis_Johnson","birth":"14.03.2022","country":"Deutschland","maritalstatus":"Ledig","phonenumber":0,"visalevel":2,"job":"Arbeitslos","house":"Hotel","faction":{"id":1,"name":"Test"}},"lifeinvader_messages":[{"id":1,"content":"hallo hier ist ein Test 1","phonenumber":0,"date":"14.03.2022 18:53:34","type":0},{"id":2,"content":"hallo hier ist ein Test 2","phonenumber":555111,"date":"14.03.2022 18:53:34","type":0}],"faction_members":[{"name":"Oliver_Kreutzer","rank":0},{"name":"Luis_Johnson","rank":12}]}'
// GPS APP Teststring ,{"id":8,"name":"Gps","img_name":"navigation","is_panel_app":false,"pagedata":"navigator"}
//InitPhone(teststring);

function InitPhone(smartphoneObject) {
    let smartphone = JSON.parse(smartphoneObject);

    storage.apps = smartphone.apps;
    storage.contacts = smartphone.contacts;
    storage.messagechats = ConvertMessageChat(JSON.stringify(smartphone.messagechats));
    storage.call_history = [];
    storage.lifeinvader_messages = smartphone.lifeinvader_messages;
    storage.settings = smartphone.settings; //smartphone.gps_locations
    // storage.gps_locations = [new NavigationModel("Mount Chiliad1 Kleiderladen", 1, "vec"), new NavigationModel("Mount Chiliad2 Kleiderladen", 1, "vec"), new NavigationModel("Rockford Hills Kleiderladen", 2, "vec")];
    storage.playerinfo = smartphone.playerinfo;
    storage.radio = new RadioModel(0, true, "Unknown", 0.0, 0, 0);

    storage.current_screen = 'homescreen';
    storage.call_active = null;
    storage.call_started_at = null;
    storage.call_number = null;
    storage.numbers = "";

    storage.current_played_sound = null;

    storage.background_images = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

    StoragedPhoneSettings = JSON.stringify(smartphone.settings);

    LoadPhoneApps();
    LoadContacts();
    LoadCallHistory();
    LoadFavorites();
    LoadPhoneSettings();
    LoadPlayerInformation();
    LoadMessageChats();

    SetPhoneScale(1);
    ShowScreen('homescreen')
};

var OnPhoneClose = function() {

    if (!objectEquals(storage.settings, JSON.parse(StoragedPhoneSettings))) {
        RemoteCall("Phone:ChangeSettings", JSON.stringify(storage.settings))
        StoragedPhoneSettings = JSON.stringify(storage.settings);
    }

    TogglePhone(false);
};

TogglePhone(true)

var OnPhoneOpen = function() {
    TogglePhone(true);
};

function objectEquals(obj1, obj2) {
    for (var i in obj1) {
        if (obj1.hasOwnProperty(i)) {
            if (!obj2.hasOwnProperty(i)) return false;
            if (obj1[i] != obj2[i]) return false;
        }
    }
    for (var i in obj2) {
        if (obj2.hasOwnProperty(i)) {
            if (!obj1.hasOwnProperty(i)) return false;
            if (obj1[i] != obj2[i]) return false;
        }
    }
    return true;
}