<script>
    import { onMount, tick } from 'svelte'
    import ModalDialog from '~/entries/utils/ModalDialog.svelte'
    import { listenClickOutsideDialog } from '~/entries/utils/listenClickOutsideDialog.js'

    const KEY = 'astr-buttons'

    const isBrowser = typeof browser != "undefined"
    const storageRoot = chrome ? chrome : browser

    let buttonCategories = []
    let buttons = {}
    let categoryDialog = null
    let buttonDialog = null
    let showCategoryDialog = false
    let showButtonDialog = false
    let currentCategory = null
    let content = null
    let contentName = null

    const getSavedButtons = async () => {
        if (isBrowser) {
            const { buttons } = await storageRoot.storage.sync.get(KEY) || { buttons: {} }
            return buttons
        }

        return new Promise((resolve => {
            storageRoot.storage.sync.get([KEY], (items) => {
                console.log("ttitit", items)
                resolve(Object.keys(items).length === 0 ? {} : items[KEY])
            })
        }))
    }

    const onNewButtonPress = async (event, category = null) => {
        event.preventDefault()
        if (category) {
            content=null
            contentName=null
            showButtonDialog = true
            currentCategory = category
            await tick()
            buttonDialog.showModal()
            listenClickOutsideDialog(buttonDialog)
        } else {
            showCategoryDialog = true
            await tick()
            categoryDialog.showModal()
            listenClickOutsideDialog(categoryDialog)
        }
    }

    const onCategoryInputKeyPress= async (event) => {
        if (event.charCode === 13) {
            categoryDialog.close()
            onNewButtonPress(event, event.target.value.trim())
        }
    }

    const addNewButton = async (categoryName, content, contentName) => {
        const buttons = await getSavedButtons()
        const dataToSave = {
            [KEY]: {
                ...buttons,
            }
        }
        if (!dataToSave[categoryName]) {
            dataToSave[categoryName] = []
        }
        dataToSave[categoryName].push({
            content,
            name: contentName,
        })

        if (isBrowser) {
            storageRoot.storage.sync.set(dataToSave)
            await updateButtons()
        } else {
            storageRoot.storage.sync.set(dataToSave, async () => {
                await updateButtons()
            })
        }
    }

    const updateButtons = async () => {
        buttons = await getSavedButtons()
        buttonCategories = Object.keys(buttons)
    }

    onMount(async () => {
        await updateButtons()
    })
</script>

{#if showButtonDialog}
    <ModalDialog bind:dialog={buttonDialog} on:close={() => {
        showButtonDialog = false

    }} title="Add a new button">
        <div>
            Category: {currentCategory} <br/>
        </div>
        <br/>
        <div>
            <input type="text"
                   placeholder="name"
                   autofocus
                   bind:value={contentName}/>
            <textarea bind:value={content} autofocus rows="10"/>
        </div>
        Length: {content ? content.length : 0}/350 <br/>
        <button on:click={() => {addNewButton(currentCategory, content, contentName)}}>
            Add
        </button>
        <br/>
        <br/>
    </ModalDialog>
{/if}

{#if showCategoryDialog}
    <ModalDialog bind:dialog={categoryDialog} on:close={() => {
        showCategoryDialog = false

    }} title="Add a new category">
        <input type="text"
               placeholder="Category name"
               autofocus
               on:keypress={onCategoryInputKeyPress}
               bind:value={content}/>
    </ModalDialog>
{/if}

<div class="aprt">
    <ul>
        {#each buttonCategories as category}
            <li>
                <a>{category}</a>

                <ul class="dropdown">
                </ul>
            </li>
        {/each}
        <li><a on:click={(event) => {
            onNewButtonPress(event)
        }}>
            Add new</a>
        </li>
    </ul>
</div>


<style>
    input {
        width: 100%;
        min-height: 50px;
        min-width: 300px;
        box-sizing: border-box;
        padding: 5px 10px;
    }

    textarea {
        width: 100%;
        min-height: 50px;
        min-width: 600px;
        border: none;
        overflow: auto;
        outline: none;
        background: #eef;
        font-family: sans-serif;
        padding: 10px;
        box-sizing: border-box;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
    }

    a {
        text-decoration: none;
    }

    ul {
        background: darkorange;
        list-style: none;
        margin: 0;
        padding-left: 0;
    }

    li, button {
        color: #fff;
        background: darkorange;
        display: block;
        float: left;
        padding: 1rem;
        position: relative;
        text-decoration: none;
        transition-duration: 0.5s;
        border: none;
        cursor: pointer;
    }

    li a {
        color: #fff;
    }

    li:hover,
    li:focus-within {
        background: red;
        cursor: pointer;
    }

    li:focus-within a {
        outline: none;
    }

    ul li ul {
        background: orange;
        visibility: hidden;
        opacity: 0;
        min-width: 5rem;
        position: absolute;
        transition: all 0.5s ease;
        margin-top: 1rem;
        left: 0;
        display: none;
    }

    ul li:hover > ul,
    ul li:focus-within > ul,
    ul li ul:hover,
    ul li ul:focus {
        visibility: visible;
        opacity: 1;
        display: block
    }

    ul li ul li {
        clear: both;
        width: 100%;
    }
</style>
