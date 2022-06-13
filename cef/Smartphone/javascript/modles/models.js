function AppModel(...args) {
    this.id = args[0];
    this.name = args[1];
    this.img_name = args[2];
    this.is_panel_app = args[3];
    this.pagedata = args[4];
}

function CallHistoryModel(...args) {
    this.id = args[0];
    this.name = args[1];
    this.action = args[2];
    this.time = args[3];
    this.is_missed = args[4];
}

function ContactModel(...args) {
    this.id = args[0];
    this.name = args[1];
    this.number = args[2];
    this.is_favorite = args[3];
    this.is_blocked = args[4];
}

function MessageModel(...args) {
    this.id = args[0];
    this.sender = args[1];
    this.reciever = args[2];
    this.content = args[3];
    this.datetime = args[4];
    this.type = args[5];
}

function MessageChatModel(...args) {
    this.id = args[0];
    this.sender = args[1];
    this.reciever = args[2];
    this.messages = args[3];
    this.lastmessage = args[4];
    this.newmessage = args[5];
    this.firstload = args[6]
}

function FactionMemberModel(...args) {
    this.name = args[0];
    this.rank = args[1];
    this.phonenumber = args[2];
}

function FactionInfoModel(...args) {
    this.id = args[0];
    this.name = args[1];
}

function BusinessMemberModel(...args) {
    this.id = args[0];
    this.name = args[1];
    this.is_owner = args[3];
}

function SettingsModel(...args) {
    this.is_flightmodel = args[0];
    this.is_soundmuted = args[1];
    this.call_sound_effect = args[2];
    this.message_sound_effect = args[2];
    this.background_image = args[3];
    this.is_number_suppressed = args[4];
}

function NotesModel(...args) {
    this.id = args[0];
    this.name = args[1];
    this.content = args[2];
    this.created_at = args[3];
}

function PlayerInfoModel(...args) {
    this.name = args[0];
    this.birth = args[1];
    this.origin = args[2];
    this.maritalstatus = args[3];
    this.phonenumber = args[4];
    this.visalevel = args[5];
    this.job = args[6];
    this.house = args[7];
}

function TimeModel(...args) {
    this.day = args[0];
    this.time = args[1];
}

function RadioModel(...args) {
    this.id = args[0];
    this.state = args[1];
    this.name = args[2];
    this.frequenz = args[3];
    this.members = args[4];
    this.maxslots = args[5];
}

function LifeinvaderModel(...args) {
    this.id = args[0];
    this.playerId = args[1];
    this.content = args[2];
    this.phonenumber = args[3];
    this.date = args[4];
    this.type = args[5];
}

function DispatchModel(...args) {
    this.id = args[0];
    this.playerId = args[1];
    this.factionName = args[2];
    this.message = args[3];
}

function NotesModel(...args) {
    this.id = args[0];
    this.title = args[1];
    this.content = args[2];
    this.date = args[3];
}
