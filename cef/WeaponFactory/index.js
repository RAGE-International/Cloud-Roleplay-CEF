let browser = null

mp.events.add('Client:WeaponFactory:Create', (data) => {
    if(browser != null) return

    browser = mp.browsers.new('package://cef/WeaponFactory/index.html')
    browser.execute(`SetData('${data}')`)
    browser.active = true
    mp.gui.cursor.show(true, true)
})

mp.events.add('Client:WeaponFactory:Destroy', () => {
    if(browser == null) return;

    browser.active = false
    browser = null
    mp.gui.cursor.show(false, false);
})

mp.events.add('Client:WeaponFactory:TakeItem', (orderId) => {
    mp.events.callRemote('Server:WeaponFactory:TakeWeaponFactoryItem', orderId)
})

mp.events.add('Client:WeaponFactory:TakeAllItems', () => {
    mp.events.callRemote('Server:WeaponFactory:TakeAllWeaponFactoryItems')
})

mp.events.add('Client:WeaponFactory:OrderWeapon', (itemId) => {
    mp.events.callRemote('Server:WeaponFactory:OrderWeapon', itemId)
})