var phone = null;
let smartphoneObject = null;

mp.events.add('Client:PhoneToggleSmartphone', (toggle) => {
    try {
        if (toggle) {
            if (phone == null) {
                phone = mp.browsers.new("package://cef/Smartphone/index.html");
                phone.active = true;
                phone.execute(`InitPhone('${smartphoneObject}')`)
                mp.events.call('Client:ToggleCursor', true);
                setTimeout(() => {
                    phone.execute(`OnPhoneOpen()`);
                }, 50);

            } else {
                phone.active = true;
                phone.execute(`OnPhoneOpen()`);
                mp.events.call('Client:ToggleCursor', true);
            }
        } else {
            if (phone != null) {
                phone.execute(`OnPhoneClose()`);
                mp.events.call('Client:ToggleCursor', false);
                setTimeout(() => {
                    phone.active = false;
                }, 1000);
            }
        }
    } catch (error) {
        mp.game.graphics.notify(error);
    }
});

mp.events.add("Client:PhoneShowMessage", (Title, Content, Image) => {
    if (phone != null) {
        phone.execute(`ShowNotification('${Title}', 'Jetzt', '${Content}', '${Image}')`);
    }
})

mp.events.add("Client:SetSmartphoneObject", (rawSmartphoneDate) => {
    smartphoneObject = rawSmartphoneDate;
})

mp.events.add('Client:ToggleCursor', (toggle) => {
    mp.gui.cursor.show(toggle, toggle);
});
mp.events.add("Phone:Callremote", (eventname, ...args) => {
    if (phone != null) {
        mp.events.callRemote(eventname, ...args);
    }
})

mp.events.add("Client:Contact:ChangeBlockState", (ContactId, ContactIsFavorite) => {
    if (phone != null) {
        mp.events.callRemote("Phone:ChangeContactBlockState", ContactId, ContactIsFavorite);
    }
});

//Messanger
mp.events.add("Client:MessagerChat:Chat:Remove", (MessangerChatId) => {
    if (phone != null) {
        phone.execute(`DeleteMessageChat('${MessangerChatId}')`);
    }
});

mp.events.add("Client:MessagerChat:Message:Add", (messageChatId, messageJson) => {
    if (phone != null) {
        let message = JSON.parse(messageJson);
        phone.execute(`AddChatMessage(${messageChatId}, ${message.sender}, ${message.receiver}, '${message.content}', '${message.datetime}', ${message.type})`);
    }
})

mp.events.add("Client:Phone:SetChatMessages", (MessangerChatJson) => {
    if (phone != null) {
        phone.execute(`OpenMessageChatFormServer('${MessangerChatJson}')`);
    }
});

mp.events.add("Client:MessagerChat:Add", (MessangerChatJson) => {
    if (phone != null) {
        phone.execute(`CreatenNewMessagerChat('${MessangerChatJson}')`);
    }
});

mp.events.add("Client:Phone:Debug", (value) => {
    if (phone != null) {
        mp.game.graphics.notify(`${value}`);
    }
});

//CALL
mp.events.add("Phone:CallScreen", (targetNumber, isAccept) => {
    if (phone != null) {
        phone.execute(`OutgoingCall('${targetNumber}', '${isAccept}')`);
    }
});

mp.events.add("Phone:IncommingCall", (targetNumber, is_number_suppressed) => {
    if (phone != null) {
        phone.execute(`IncommingCall('${targetNumber}', '${is_number_suppressed}')`);
    }
});

mp.events.add("Phone:InCall", (targetNumber, is_number_suppressed) => {
    if (phone != null) {
        phone.execute(`InCall('${targetNumber}', '${is_number_suppressed}')`);
    }
});

mp.events.add("Phone:Call:Destory", () => {
    if (phone != null) {
        phone.execute(`KillCall()`);
    }
});

//LIFEINVADER

mp.events.add("Client:Phone:LifeinvaderAddMessage", (rawWerbungsModel) => {
    if (phone != null) {

        var werbung = JSON.parse(rawWerbungsModel);

        phone.execute(`AddLifeinvaderMessage('${werbung.id}', '${werbung.content}', '${werbung.phonenumber}', '${werbung.date}', '${werbung.type}')`);
    }
});

//FACTION
mp.events.add("Client:Phone:LoadFactionMembers", (factionMembersRaw) => {
    if (phone != null) {
        phone.execute(`LoadFactionMembers('${factionMembersRaw}')`);
    }
});

//RADIO

mp.events.add("Client:Phone:RadioUpdateDisplay", (radioData) => {
    if (phone != null) {
        phone.execute(`SetRadioInformations('${radioData}')`);
    }
});