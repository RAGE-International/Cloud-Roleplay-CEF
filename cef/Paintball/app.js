let lobbys = []
let selectedMap = 0
let maps = [ /*'Humane Labs', 'Würfelpark'*/]
let weapons = []
let selectedWeapons = []

function SetPaintballData(_data) {
    let data = JSON.parse(_data)
    lobbys = data.Lobbys
    maps = data.Maps
    weapons = data.Weapons
    ChangeMap(0)
    SetWeapons()
    SetLobbys()
}

function SetLobbys() {
    let list = document.getElementById('paintball-lobbylist')
    list.innerHTML = ''
    let public = lobbys.filter(x => !x.Private)
    let private = lobbys.filter(x => x.Private)

    public.forEach(x => {
        list.innerHTML +=
            `<div class="paintball-arenacontent">
            <p class="paintball-contentinfo">#${lobbys.indexOf(x) + 1} <br><span>${x.Name}</span></p>
            <div class="paintball-players">
                <p class="paintball-contentplayers">SPIELER</p>
                <br>
                <span>${x.Players}</span>
                <div class="lobbydot"></div>
            </div>
            <button class="paintball-contentbutton" onclick="JoinPaintballArena(${lobbys.indexOf(x)})">Arena beitreten</button>
        </div>`
    })

    if (private.length > 0) {
        list.innerHTML += `<p class="paintball-arenatitle">Private Arenen</p>`

        private.forEach(x => {
            list.innerHTML +=
                `<div class="paintball-arenacontent">
                <p class="paintball-contentinfo">#${lobbys.indexOf(x) + 1} <br><span>${x.Name}</span></p>
                <div class="paintball-players">
                    <p class="paintball-contentplayers">SPIELER</p>
                    <br>
                    <span>${x.Players}</span>
                    <div class="lobbydot"></div>
                </div>
                <button class="paintball-contentbutton" onclick="JoinPaintballArena(${lobbys.indexOf(x)})">Arena beitreten</button>
            </div>`
        })
    }
}

function SetWeapons() {
    let list = document.getElementById('paintball-weaponlist')
    list.innerHTML = ''
    weapons.forEach(x => {
        list.innerHTML +=
            `<div class="paintball-weaponcontent" onclick="SelectWeapon(this.innerText, this)">
            <img src="img/weapons/weapon_${x.toLowerCase().replaceAll(' ', '_')}.png" class="paintball-weaponimg">
            <p class="paintball-weaponname">${x}</p>
            <img src="img/checkbox.svg" class="weaponcheckbox" id="weaponicon-${x.toLowerCase().replaceAll(' ', '_')}">
        </div>`
    })
}

function CreatePaintballLobby() {
    let name = document.getElementById('lobbyname').value
    let password = document.getElementById('lobbypass').value
    let maxplayer = document.getElementById('lobbymaxplayer').value
    let maxhp = document.getElementById('lobbymaxhp').value

    if (name == '' || maxplayer < 2 || maxhp < 100)
        return

    mp.trigger('CreatePaintballLobby', JSON.stringify({ Name: name, Password: password, MaxPlayers: maxplayer, MaxHealth: maxhp, Map: maps[selectedMap] }))
}

function JoinPaintballArena(index) {
    let arena = lobbys[index]
    if (!arena.Private) {
        mp.trigger('JoinPaintballArena', arena.Id, '')
    } else {
        ShowEntryMenu(arena)
    }
}

function ShowEntryMenu(arena) {
    document.getElementById('entry-pass').value = ''
    document.getElementById('entry-arena-name').innerText = arena.Name.toUpperCase()
    document.getElementById('entry-arena-map').innerText = arena.Map.toUpperCase()
    document.getElementById('entry-arena-players').innerText = `${arena.Players}/${arena.MaxPlayers}`
    document.getElementById('entry-submit').onclick = () => { SubmitEntry(lobbys.indexOf(arena)) }
    document.getElementById('entry').style.display = 'block'
}

function CloseEntryMenu() {
    document.getElementById('entry').style.display = 'none'
}

function SubmitEntry(index) {
    let password = document.getElementById('entry-pass').value
    mp.trigger('JoinPaintballArena', arena.Id, password)
}

function ChangeMap(offset) {
    selectedMap += offset

    if (selectedMap < 0)
        selectedMap = 0

    if (selectedMap > maps.length - 1)
        selectedMap = maps.length - 1

    document.getElementById('paintball-index').innerText = `#${selectedMap + 1}`
    let name = document.createElement('span')
    name.innerText = maps[selectedMap].toUpperCase()
    document.getElementById('paintball-index').appendChild(name)
    document.getElementById('paintball-map').style.backgroundImage = `url(./img/maps/${maps[selectedMap].replaceAll(' ', '_').toLowerCase()}.png)`
}

function SelectWeapon(weapon, el) {
    if (!selectedWeapons.includes(weapon.toLowerCase())) {
        selectedWeapons.push(weapon.toLowerCase())
        el.classList.add('paintball-weaponcontent-active')
        document.getElementById('weaponicon-' + weapon.toLowerCase().replaceAll(' ', '_')).style.display = 'block'
    } else {
        selectedWeapons.splice(selectedWeapons.indexOf(weapon))
        el.classList.remove('paintball-weaponcontent-active')
        document.getElementById('weaponicon-' + weapon.toLowerCase().replaceAll(' ', '_')).style.display = 'none'
    }
}

function CloseMenu() {
    mp.trigger('DestroyPaintballBrowser')
}

SetPaintballData('{"Lobbys":[{"Name":"Würfelpark", "Players": 124, "MaxPlayers": 24, "Private": false, "Map":"Humane Labs"},{"Name":"Würfelpark 2", "Players": 24, "MaxPlayers": 24, "Private": true, "Map":"Humane Labs"},{"Name":"Würfelpark 3", "Players": 24, "MaxPlayers": 24, "Private": true, "Map":"Humane Labs"}], "Maps": ["Humane Labs", "Würfelpark"], "Weapons": ["Advancedrifle", "Bullpuprifle"]}')