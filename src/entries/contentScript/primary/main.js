import $ from "jquery"
import renderContent from '../renderContent.js'
import App from './App.svelte'

let isProcessing = false

const maybeAddButtons = async () => {
    if (isProcessing || !window.location.href.startsWith('https://play.google.com/console/')) {
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
                    new App({
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
    isProcessing = false
}

if ($("review-reply").length !== 0) {
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
// console.log("plugin init")
