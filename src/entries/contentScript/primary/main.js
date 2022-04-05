import $ from "jquery"
import { renderContent } from '~/entries/contentScript/renderContent.js'
import AppContentScript from './AppContentScript.svelte'

let isProcessing = false

const maybeAddButtons = async () => {
    if (isProcessing) {
        console.log("cancel")
        return
    }

    if ($(".aprt-container").length !== 0) {
        // already added
        return
    }

    isProcessing = true

    document.querySelectorAll('.mdc-text-field__resizer').forEach(element => {
        element.style.overflow = 'visible'
    })

    $("review-reply").each(async function (i, el) {
        if ($(this).find(".aprt-container").length === 0) {
            $(el).find('textarea').first().after('<div class="aprt-container"></div>')
            const target = $(el).find('.aprt-container').first().get()[0]
            if (target) {
                renderContent(import.meta.CURRENT_CONTENT_SCRIPT_CSS_URL, target, (appRoot) => {
                    new AppContentScript({
                        target: appRoot,

                        props: {
                            fill: (data) => {
                                $(el).find('textarea').first().val(data)
                                const event = new Event("input", { "bubbles": true, "cancelable": true })
                                $(el).find('textarea').first().get()[0].dispatchEvent(event)
                            }
                        }
                    })
                })
            }
        }
    })
    console.log("Added buttons")
    isProcessing = false
}

if ($("review-reply").length !== 0) {
    console.log("init first")
    setTimeout(() => {
        maybeAddButtons()

    }, 200)
}

$(document).on('DOMNodeInserted', function (e) {
    if ($("review-reply").length !== 0) {
        setTimeout(() => {
            maybeAddButtons()
        }, 200)
    }
})

console.log("plugin init")
