
const KEY = 'astr-buttons'
const isBrowser = typeof browser != "undefined"
const storageRoot = chrome ? chrome : browser

export const getSavedButtons = async () => {
    if (isBrowser) {
        const { buttons } = await storageRoot.storage.sync.get(KEY) || { buttons: {} }
        return buttons
    }

    return new Promise((resolve => {
        storageRoot.storage.sync.get([KEY], (items) => {
            resolve(Object.keys(items).length === 0 ? {} : items[KEY])
        })
    }))
}

export const savePluginButton = async (data) => {
    return new Promise(resolve => {
        if (isBrowser) {
            storageRoot.storage.sync.set({
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
