//plugin commands enum
const Command = {
    PluginState: 0,
    Initiate: 1,
    Reset: 2,
    Ping: 3,
    Pong: 4,
    InstanceState: 5,
    SoundState: 6,
    SelfStateUpdate: 7,
    PlayerStateUpdate: 8,
    BulkUpdate: 9,
    RemovePlayer: 10,
    TalkState: 11,
    PlaySound: 18,
    StopSound: 19,
    PhoneCommunicationUpdate: 20,
    StopPhoneCommunication: 21,
    RadioCommunicationUpdate: 30,
    StopRadioCommunication: 31,
    RadioTowerUpdate: 32,
    MegaphoneCommunicationUpdate: 40,
    StopMegaphoneCommunication: 41,
};

//plugin error enum
const PluginError = {
    OK: 0,
    InvalidJson: 1,
    NotConnectedToServer: 2,
    AlreadyInGame: 3,
    ChannelNotAvailable: 4,
    NameNotAvailable: 5,
    InvalidValue: 6
};

const PluginKeys = {
    VoiceRage: 246,
    RadioToggle: 306,
};

const EventNames = {
    Initialize: "SaltyChat_Initialize",
    UpdateClient: "SaltyChat_UpdateClient",
    Disconnected: "SaltyChat_Disconnected",
    IsTalking: "SaltyChat_IsTalking",
    PlayerDied: "SaltyChat_PlayerDied",
    PlayerRevived: "SaltyChat_PlayerRevived",
    EstablishedCall: "SaltyChat_EstablishedCall",
    EstablishedCallRelayed: "SaltyChat_EstablishedCallRelayed",
    EndCall: "SaltyChat_EndCall",
    SetRadioChannel: "SaltyChat_SetRadioChannel",
    IsSending: "SaltyChat_IsSending",
    IsSendingRelayed: "SaltyChat_IsSendingRelayed",
    UpdateRadioTowers: "SaltyChat_UpdateRadioTowers",
    OnConnected: "SaltyChat_OnConnected",
    OnDisconnected: "SaltyChat_OnDisconnected",
    OnMessage: "SaltyChat_OnMessage",
    OnError: "SaltyChat_OnError",
    SetVoiceRange: "SaltyChat_SetVoiceRange",
    Render: "render",
    Debug: "SaltyChat_Debug",
};

const LogTypes = {
    Info: 1,
    Warning: 2,
    Error: 3,
};

const ErrorTypes = {
    HandleEmpty: 0x14,
    ArryEmpty: 0x15,
    PluginError: 0x88,
};

const Sounds = {

};

const KeyTrypes = {
    Y: 89,
    N: 78,
}

class PluginCommand {
    constructor(command, serverIdentifier, parameter) {
        this.Command = command;
        this.ServerUniqueIdentifier = serverIdentifier;
        this.Parameter = parameter;
    }
    Serialize() {
        return JSON.stringify(this);
    }
}
class GameInstance {
    constructor(serverIdentifier, name, channelId, channelPassword, soundPack) {
        this.ServerUniqueIdentifier = serverIdentifier;
        this.Name = name;
        this.ChannelId = channelId;
        this.ChannelPassword = channelPassword;
        this.SoundPack = soundPack;
    }
}

class PlayerState {
    constructor(name, position, rotation, voiceRange, isAlive, volumeOverride, DistanceCulled, muffle) {
        this.Name = name;
        this.Position = position;
        this.Rotation = rotation;
        this.VoiceRange = voiceRange;
        this.IsAlive = isAlive;
        this.VolumeOverride = volumeOverride;
        this.Muffle = muffle;
        this.DistanceCulled = DistanceCulled;
    }
}
class PhoneCommunication {
    constructor(name, signalStrength, volume, direct, relayedBy) {
        this.Name = name;
        this.SignalStrength = signalStrength;
        this.Volume = volume;
        this.Direct = direct;
        this.RelayedBy = relayedBy;
    }
}
class RadioCommunication {
    constructor(name, senderRadioType, ownRadioType, playerMicClick, volume, direct, relayedBy) {
        this.Name = name;
        this.SenderRadioType = senderRadioType;
        this.OwnRadioType = ownRadioType;
        this.PlayMicClick = playerMicClick;
        this.Volume = volume;
        this.Direct = direct;
        this.RelayedBy = relayedBy;
    }
}
class RadioTower {
    constructor(towers) {
        this.Towers = towers;
    }
}
class Sound {
    constructor(filename, isLoop, handle) {
        this.Filename = filename;
        this.IsLoop = isLoop;
        this.Handle = handle;
    }
}
class VoiceClient {
    constructor(player, tsName, voiceRange, isAlive) {
        this.Player = player;
        this.TeamSpeakName = tsName;
        this.VoiceRange = voiceRange;
        this.IsAlive = isAlive;
    }
}

class LogModule {
    constructor(type, message) {
        this.Type = type;
        this.Message = message;
    }
}

class MuffleEffect {
    constructor(intensity) {
        this.Intensity = intensity;
    }
}

class VoiceManager {
    constructor() {
        this.IsEnabled = false;
        this.ServerUniqueIdentifier = null;
        this.SoundPack = null;
        this.IngameChannel = null;
        this.IngameChannelPassword = null;
        this.TeamSpeakName = null;
        this.VoiceRange = null;
        this.RadioChannel = null;
        this.IsTalking = false;
        this.IsMicrophoneMuted = false;
        this.IsSoundMuted = false;
        this.Cef = null;
        this.IsConnected = false;
        this.IsInGame = false;
        this.NextUpdate = Date.now();
        this.VoiceClients = new Map();
        this.VoiceRanges = [3.0, 8.0, 15.0, 32.0];

        mp.events.add(EventNames.Initialize, (tsName, serverIdentifier, soundPack, ingameChannel, ingameChannelPassword) => this.OnInitialize(tsName, serverIdentifier, soundPack, ingameChannel, ingameChannelPassword));
        mp.events.add(EventNames.UpdateClient, (playerHandle, tsName, voiceRange) => this.OnUpdateVoiceClient(playerHandle, tsName, voiceRange));
        mp.events.add(EventNames.Disconnected, (playerHandle) => this.OnPlayerDisconnect(playerHandle));
        mp.events.add(EventNames.IsTalking, (playerHandle, isTalking) => this.OnPlayerTalking(playerHandle, isTalking));
        mp.events.add(EventNames.PlayerDied, (playerHandle) => this.OnPlayerDied(playerHandle));
        mp.events.add(EventNames.PlayerRevived, (playerHandle) => this.OnPlayerRevived(playerHandle));
        mp.events.add(EventNames.EstablishedCall, (playerHandle) => this.OnEstablishCall(playerHandle));
        mp.events.add(EventNames.EstablishedCallRelayed, (playerHandle, direct, relayJson) => this.OnEstablishCallRelayed(playerHandle, direct, relayJson));
        mp.events.add(EventNames.EndCall, (playerHandle) => this.OnEndCall(playerHandle));
        mp.events.add(EventNames.SetRadioChannel, (radioChannel) => this.OnSetRadioChannel(radioChannel));
        mp.events.add(EventNames.IsSending, (playerHandle, isOnRadio) => this.OnPlayerIsSending(playerHandle, isOnRadio));
        mp.events.add(EventNames.IsSendingRelayed, (playerHandle, isOnRadio, stateChange, direct, relayJson) => this.OnPlayerIsSendingRelayed(playerHandle, isOnRadio, stateChange, direct, relayJson));
        mp.events.add(EventNames.UpdateRadioTowers, (radioTowerJson) => this.OnUpdateRadioTowers(radioTowerJson));
        mp.events.add(EventNames.OnConnected, () => this.OnPluginConnected());
        mp.events.add(EventNames.OnDisconnected, () => this.OnPluginDisconnected());
        mp.events.add(EventNames.OnMessage, (messageJson) => this.OnPluginMessage(messageJson));
        mp.events.add(EventNames.OnError, (errorJson) => this.OnPluginError(errorJson));
        mp.events.add(EventNames.Render, () => this.OnTick());
        mp.events.add(EventNames.Debug, (message) => this.OnDebug(message));
        mp.events.add(EventNames.SetVoiceRange, (playerHandle, voiceRange) => this.SetClientsVoiceRange(playerHandle, voiceRange));
    }
    SetClientsVoiceRange(playerHandle, voiceRange) {

        if (!this.VoiceClients.size || playerHandle == undefined || voiceRange == undefined) return;

        let playerId = parseInt(playerHandle);

        try {
            if (this.VoiceClients.has(playerId)) {
                let voiceClient = this.VoiceClients.get(playerId);
                voiceClient.VoiceRange = voiceRange;
            }
        } catch (error) {
            this.OnDebug(new LogModule(LogTypes.Error, `SaltyChat >>>> Array\"VoiceClients\" does not contains current client handle | Code ${ErrorTypes.HandleEmpty} | Error ${error}`));
        }
    }
    OnInitialize(tsName, serverIdentifier, soundPack, ingameChannel, ingameChannelPassword) {
        this.TeamSpeakName = tsName;
        this.ServerUniqueIdentifier = serverIdentifier;
        this.SoundPack = soundPack;
        this.IngameChannel = parseInt(ingameChannel);
        this.IngameChannelPassword = ingameChannelPassword;
        this.IsEnabled = true;
        this.Cef = mp.browsers.new("package://SaltyChat/SaltyWebSocket.html");
        this.Cef.active = false;
        if (this.Cef) {
            this.PlaySound("on", 0.3)
        }

        if (this.IsInGame) {
            this.SetVoiceRange(0);
        }
    }
    OnUpdateVoiceClient(playerHandle, tsName, voiceRange) {
        let playerId = parseInt(playerHandle);
        let player = mp.players.atRemoteId(playerId);
        if (player == null)
            return;
        if (player == mp.players.local) {
            this.VoiceRange = voiceRange;
            this.OnDebug(new LogModule(LogTypes.Info, `SaltyChat >>>> Voice has been updated...`));
        } else {
            if (this.VoiceClients.has(playerId)) {
                let voiceClient = this.VoiceClients.get(playerId);
                voiceClient.TeamSpeakName = tsName;
                voiceClient.VoiceRange = voiceRange;
            } else {
                this.OnDebug(new LogModule(LogTypes.Info, `SaltyChat >>>> A new voice object (TeamSpeak: ${tsName}) was added to the \"VoiceClients\" array...`));
                this.VoiceClients.set(playerId, new VoiceClient(player, tsName, voiceRange, true));
            }
        }
    }

    OnPlayerDisconnect(playerHandle) {
        let playerId = parseInt(playerHandle);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            this.ExecuteCommand(new PluginCommand(Command.RemovePlayer, this.ServerUniqueIdentifier, new PlayerState(voiceClient.TeamSpeakName, null, null, null, false, null)));
            this.VoiceClients.delete(playerId);
        }
    }
    OnPlayerTalking(playerHandle, isTalking) {
        let playerId = parseInt(playerHandle);
        let player = mp.players.atRemoteId(playerId);
        if (player == null) return;
        if (isTalking) player.playFacialAnim("mic_chatter", "mp_facial");
        else player.playFacialAnim("mood_normal_1", "facials@gen_male@variations@normal");
    }
    OnPlayerDied(playerHandle) {
        let playerId = parseInt(playerHandle);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            voiceClient.IsAlive = false;
        }
    }
    OnPlayerRevived(playerHandle) {
        let playerId = parseInt(playerHandle);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            voiceClient.IsAlive = true;
        }
    }

    OnEstablishCall(playerHandle) {
        this.OnDebug(new LogModule(LogTypes.Info, `SaltyChat >>>> PhoneCall`));
        let playerId = parseInt(playerHandle);
        this.OnDebug(new LogModule(LogTypes.Info, `SaltyChat >>>> ${playerId}`));
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            this.OnDebug(new LogModule(LogTypes.Info, `SaltyChat >>>> ${JSON.stringify(voiceClient)}`));
            let player = mp.players.atRemoteId(playerId);
            let ownPosition = mp.players.local.position;
            let playerPosition = player.position;
            this.ExecuteCommand(new PluginCommand(Command.PhoneCommunicationUpdate, this.ServerUniqueIdentifier, new PhoneCommunication(voiceClient.TeamSpeakName, 0, 1.4, true, null)));
        }
    }
    OnEstablishCallRelayed(playerHandle, direct, relayJson) {
        let playerId = parseInt(playerHandle);
        let relays = JSON.parse(relayJson);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            let player = mp.players.atRemoteId(playerId);
            let ownPosition = mp.players.local.position;
            let playerPosition = player.position;
            this.ExecuteCommand(new PluginCommand(Command.PhoneCommunicationUpdate, this.ServerUniqueIdentifier, new PhoneCommunication(voiceClient.TeamSpeakName, 0, 1.4, direct, relays)));
        }
    }

    OnEndCall(playerHandle) {
        let playerId = parseInt(playerHandle);
        if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            this.ExecuteCommand(new PluginCommand(Command.StopPhoneCommunication, this.ServerUniqueIdentifier, new PhoneCommunication(voiceClient.TeamSpeakName, null, null, true, null)));
        }
    }
    OnSetRadioChannel(radioChannel) {
        if (typeof radioChannel === "string" && radioChannel != "") {
            this.RadioChannel = radioChannel;
            this.PlaySound("on", 0.3);
        } else {
            this.RadioChannel = null;
            this.PlaySound("off", 0.3);
        }
    }
    OnPlayerIsSending(playerHandle, isOnRadio) {
        let playerId = parseInt(playerHandle);
        let player = mp.players.atRemoteId(playerId);
        if (player == mp.players.local) {
            //this.PlaySound("idk", 0.3);
        } else if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            if (isOnRadio) {
                this.ExecuteCommand(new PluginCommand(Command.RadioCommunicationUpdate, this.ServerUniqueIdentifier, new RadioCommunication(voiceClient.TeamSpeakName, RadioType.LongRange | RadioType.Distributed, RadioType.LongRange | RadioType.Distributed, true, null, true, null)));
            } else {
                this.ExecuteCommand(new PluginCommand(Command.StopRadioCommunication, this.ServerUniqueIdentifier, new RadioCommunication(voiceClient.TeamSpeakName, RadioType.None, RadioType.None, true, null, true, null)));
            }
        }
    }
    OnPlayerIsSendingRelayed(playerHandle, isOnRadio, stateChange, direct, relayJson) {
        let playerId = parseInt(playerHandle);
        let relays = JSON.parse(relayJson);
        let player = mp.players.atRemoteId(playerId);
        if (player == mp.players.local) {
            //this.PlaySound("idk", 0.3);
        } else if (this.VoiceClients.has(playerId)) {
            let voiceClient = this.VoiceClients.get(playerId);
            if (isOnRadio) {
                this.ExecuteCommand(new PluginCommand(Command.RadioCommunicationUpdate, this.ServerUniqueIdentifier, new RadioCommunication(voiceClient.TeamSpeakName, RadioType.LongRange | RadioType.Distributed, RadioType.LongRange | RadioType.Distributed, stateChange, null, direct, relays)));
            } else {
                this.ExecuteCommand(new PluginCommand(Command.StopRadioCommunication, this.ServerUniqueIdentifier, new RadioCommunication(voiceClient.TeamSpeakName, RadioType.None, RadioType.None, stateChange, null, true, null)));
            }
        }
    }
    OnUpdateRadioTowers(radioTowerJson) {
        let radioTowers = JSON.parse(radioTowerJson);
        this.ExecuteCommand(new PluginCommand(Command.RadioTowerUpdate, this.ServerUniqueIdentifier, new RadioTower(radioTowers)));
    }
    OnPluginConnected() {
        this.IsConnected = true;
        this.Initiate();
    }
    OnPluginDisconnected() {
        this.IsConnected = false;
    }
    OnPluginMessage(messageJson) {
        let message = JSON.parse(messageJson);
        if (message.ServerUniqueIdentifier != this.ServerUniqueIdentifier) return;
        if (message.Command == Command.Ping && this.NextUpdate + 1000 > Date.now()) {
            this.ExecuteCommand(new PluginCommand(Command.Pong, this.ServerUniqueIdentifier, null));
            return;
        }
        if (message.Parameter === typeof('undefined') || message.Parameter == null) return;
        let parameter = message.Parameter;
        if (parameter.IsReady && !this.IsInGame) {
            mp.events.callRemote("SaltyChat_CheckVersion", parameter.UpdateBranch, parameter.Version);
            this.IsInGame = parameter.IsReady;
        }
        if (parameter.IsTalking != this.IsTalking) {
            this.IsTalking = parameter.IsTalking;
            mp.events.callRemote("SaltyChat_IsTalking", this.IsTalking);
        }
        if (parameter.IsMicrophoneMuted != this.IsMicrophoneMuted) {
            this.IsMicrophoneMuted = parameter.IsMicrophoneMuted;
        }
        if (parameter.IsSoundMuted != this.IsSoundMuted) {
            this.IsSoundMuted = parameter.IsSoundMuted;
        }
    }
    OnPluginError(errorJson) {
        try {
            let error = JSON.parse(errorJson);
            if (error.Error == PluginError.AlreadyInGame) {
                this.Initiate();
            } else {
                this.OnDebug(new LogModule(LogTypes.Error, `SaltyChat >>>> Error: ${error.Error} | Message: ${error.Message}`));
            }
        } catch {
            this.OnDebug(new LogModule(LogTypes.Error, `SaltyChat >>>> Error: ${ErrorTypes.PluginError} | Message: this error could not be identified...`));
        }
    }
    OnTick() {

        if (this.IsConnected && this.IsInGame && Date.now() > this.NextUpdate) {
            this.PlayerStateUpdate();
            this.NextUpdate = Date.now() + 300;
        }
    }
    OnDebug(module) {

        if (!module) return;

        switch (module.Type) {
            case LogTypes.Info:
                mp.console.logInfo(`${module.Message}`);
                break;
            case LogTypes.Warning:
                mp.console.logWarning(`${module.Message}`);
                break;
            case LogTypes.Error:
                mp.console.logError(`${module.Message}`);
                break;
            default:
                mp.console.logInfo(`${module.Message}`);
                break;
        }
    }
    PlaySound(name, valume) {
        if (this.Cef) {
            this.Cef.execute(`playsound("${name}", ${valume});`);
        }
    }
    StopSound(handle) {
        this.ExecuteCommand(new PluginCommand(Command.StopSound, this.ServerUniqueIdentifier, new Sound(handle, false, handle)));
    }
    Initiate() {
        this.ExecuteCommand(new PluginCommand(Command.Initiate, this.ServerUniqueIdentifier, new GameInstance(this.ServerUniqueIdentifier, this.TeamSpeakName, this.IngameChannel, this.IngameChannelPassword, this.SoundPack)));
    }

    PlayerStateUpdate() {

        let playerPosition = mp.players.local.position;
        let playerRoomId = mp.game.invoke("0x47C2A06D4F5F424B", mp.players.local.handle);
        let PlayerUpdates = new Array();

        if (this.IsMicrophoneMuted) {
            this.ChangeHudVoiceState(3);
        }

        this.VoiceClients.forEach((voiceClient, playerId) => {
            if (!mp.players.exists(voiceClient.Player)) return;

            let otherPosition = voiceClient.Player.position;
            let distance = mp.game.gameplay.getDistanceBetweenCoords(playerPosition.x, playerPosition.y, playerPosition.z, otherPosition.x, otherPosition.y, otherPosition.z, true);
            let isInMaxRange = distance <= this.VoiceRanges[this.VoiceRanges.length - 1];
            let distanceCulled = !isInMaxRange && !voiceClient.IsRadioSending;

            let otherRoomId = mp.game.invoke("0x47C2A06D4F5F424B", voiceClient.Player.handle);
            let hasLineOfSight = mp.game.invoke("0xFCDFF7B72D23A1AC", mp.players.local.handle, voiceClient.Player.handle, 17);
            let muffle = playerRoomId !== otherRoomId && !hasLineOfSight ? new MuffleEffect(10) : null;

            let maxrange = 15.0;
            let volume = 1.5 - (distance / maxrange);

            if (volume <= 0) volume = 0;
            else if (volume >= 1.5) volume = 1.5;

            PlayerUpdates.push(new PlayerState(voiceClient.TeamSpeakName, otherPosition, null, voiceClient.VoiceRange, voiceClient.IsAlive, volume, distanceCulled, muffle));
        });
        this.ExecuteCommand(new PluginCommand(Command.BulkUpdate, this.ServerUniqueIdentifier, { "PlayerStates": PlayerUpdates, "SelfState": new PlayerState(this.TeamSpeakName, playerPosition, mp.game.cam.getGameplayCamRot(0).z, this.VoiceRange, this.isAlive, null, false, null) }));

        this.IsPlayerPositionsUpdateFinished = true;
        this.PlayerUpdateFinished = Date.now();
    }

    ToggleVoiceRange() {
        //if (this.IsMicrophoneMuted) return;

        let oldVoiceRange = this.VoiceRange;

        switch (oldVoiceRange) {
            case this.VoiceRanges[0]:
                mp.events.callRemote("SaltyChat_SetVoiceRange", this.VoiceRanges[1]);
                this.VoiceRange = this.VoiceRanges[1];
                this.ChangeHudVoiceState(0)
                break;
            case this.VoiceRanges[1]:
                mp.events.callRemote("SaltyChat_SetVoiceRange", this.VoiceRanges[2]);
                this.VoiceRange = this.VoiceRanges[2];
                this.ChangeHudVoiceState(1)
                break;
            case this.VoiceRanges[2]:
                mp.events.callRemote("SaltyChat_SetVoiceRange", this.VoiceRanges[0]);
                this.VoiceRange = this.VoiceRanges[0];
                this.ChangeHudVoiceState(2)
                break;
        }

        this.OnDebug(new LogModule(LogTypes.Info, `SaltyChat >>>> { old-voice-range: ${oldVoiceRange}, new-voice-range: ${this.VoiceRange} }`));
    }
    SetVoiceRange(index) {
        mp.events.callRemote("SaltyChat_SetVoiceRange", this.VoiceRanges[index]);
        this.VoiceRange = this.VoiceRanges[index];
        this.ChangeHudVoiceState(index)
    }
    ExecuteCommand(command) {
        if (this.IsEnabled && this.IsConnected) {
            this.Cef.execute("runCommand('" + JSON.stringify(command) + "')");
        }
    }
    ChangeHudVoiceState(value) {
        mp.events.call('Client:SetHudVoice', value);
    }
    ChangeHudRadioState(value) {
        mp.events.call('Client:SetHudRadio', value);
    }
    ToggelHudRadio(toggle) {
        mp.events.call('Client:ToggleHudRadio', toggle);
    }
}
let voiceManager = new VoiceManager();

mp.keys.bind(KeyTrypes.Y, true, () => {
    voiceManager.ToggleVoiceRange();
});

mp.keys.bind(KeyTrypes.N, true, function() {
    if (voiceManager.RadioChannel != null) {
        voiceManager.OnDebug(new LogModule(LogTypes.Info, `SaltyChat >>>> Radio Channel Start Sending On ${voiceManager.RadioChannel}`));
        mp.events.callRemote("SaltyChat_IsSending", voiceManager.RadioChannel, true);
    }
});

mp.keys.bind(KeyTrypes.N, false, function() {
    if (voiceManager.RadioChannel != null) {
        voiceManager.OnDebug(new LogModule(LogTypes.Info, `SaltyChat >>>> Radio Channel Stop Sending On ${voiceManager.RadioChannel}`));
        mp.events.callRemote("SaltyChat_IsSending", voiceManager.RadioChannel, false);
    }
});