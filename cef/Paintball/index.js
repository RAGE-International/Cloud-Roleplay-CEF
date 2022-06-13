let paintball = null

mp.events.add('CreatePaintballBrowser', (data) => {
    paintball = mp.browsers.new('package://cef/Paintball/index.html')
    mp.gui.cursor.show(true, true)
    mp.players.local.freezePosition(true)
    let intervall = setInterval(() => {
        if(paintball != null) {
            clearInterval(intervall)
            paintball.execute(`SetPaintballData('${data}')`)
        }
    }, 10)
})

mp.events.add('DestroyPaintballBrowser', (data) => {
    paintball.destroy()
    paintball = null
    mp.gui.cursor.show(false, false)
    mp.players.local.freezePosition(false)
})

mp.events.add('CreatePaintballLobby', (data) => {
    if(data != '')
        mp.events.callRemote('Niggerevent', data)
})

mp.events.add('JoinPaintballArena', (arenaId, password) => {
    mp.events.callRemote('nigga', arenaId, password)
})