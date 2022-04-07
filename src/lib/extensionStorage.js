const KEY = 'astr-buttons'
const isBrowser = typeof browser != "undefined"
const storageRoot = chrome ? chrome : browser

export const getSavedButtons = async () => {
    if (isBrowser) {
        const items = await browser.storage.sync.get(KEY)
        return (!items || Object.keys(items).length === 0) ? {} : items[KEY]
    }

    return new Promise((resolve => {
        storageRoot.storage.sync.get([KEY], (items) => {
            resolve(Object.keys(items).length === 0 ? {} : items[KEY])
        })
    }))
}

export const savePluginButton = async (data) => {
    return new Promise(async resolve => {
        if (isBrowser) {
            await browser.storage.sync.set({
                [KEY]: data
            })
            resolve()
        } else {
            storageRoot.storage.sync.set({
                [KEY]: data
            }, async () => {
                resolve()
            })
        }
    })
}
