<script>
    import { onMount, tick } from 'svelte'
    import ModalDialog from '~/entries/utils/ModalDialog.svelte'
    import { listenClickOutsideDialog } from '~/entries/utils/listenClickOutsideDialog.js'
    import { getSavedButtons, savePluginButton } from '~/lib/extensionStorage.js'

    export let fill = () => {
    }
    export let edit = true

    let saveMode = false
    let buttonCategories = []
    let buttons = {}
    let categoryDialog = null
    let buttonDialog = null
    let showCategoryDialog = false
    let showButtonDialog = false
    let currentCategory = null
    let content = null
    let contentName = null
    let saveContentIndex = null

    const editCategory = async (category) => {
        saveMode = true
        content = category
        currentCategory = category
        showCategoryDialog = true
        await tick()
        listenClickOutsideDialog(categoryDialog, () => {
            saveMode = false
        })
        categoryDialog.showModal()
    }

    const editButton = async (category, name, cont) => {
        saveMode = true
        content = cont
        contentName = name
        currentCategory = category
        showButtonDialog = true
        saveContentIndex = buttons[currentCategory].findIndex(button => button.name === contentName)
        await tick()
        listenClickOutsideDialog(buttonDialog, () => {
            saveMode = false
        })
        buttonDialog.showModal()
    }

    const onNewButtonPress = async (event, category = null) => {
        event.preventDefault()
        if (category) {
            content = null
            contentName = null
            showButtonDialog = true
            currentCategory = category
            await tick()
            buttonDialog.showModal()
            listenClickOutsideDialog(buttonDialog, () => {
                saveMode = false
            })
        } else {
            showCategoryDialog = true
            await tick()
            categoryDialog.showModal()
            listenClickOutsideDialog(categoryDialog, () => {
                saveMode = false
            })
        }
    }

    const onCategoryInputKeyPress = async (event) => {
        const newCategoryName = event.target.value.trim()
        if (newCategoryName.length === 0) {
            return
        }
        if (event.charCode === 13) {
            categoryDialog.close()
            if (saveMode) {
                const buttons = await getSavedButtons()
                buttons[newCategoryName] = buttons[currentCategory]
                delete buttons[currentCategory]
                await savePluginButton(buttons)
                await updateButtons()
                currentCategory = null
                content = null
                saveMode = false
            } else {
                onNewButtonPress(event, newCategoryName)
            }
        }
    }

    const addNewButton = async (categoryName, content, contentName) => {
        buttonDialog.close()
        currentCategory = null
        const buttons = await getSavedButtons()
        const dataToSave = {
            ...buttons,
        }
        if (!dataToSave[categoryName]) {
            dataToSave[categoryName] = []
        }
        const item = {
            content,
            name: contentName,
        }
        if (saveContentIndex !== null) {
            dataToSave[categoryName][saveContentIndex] = item
        } else {
            dataToSave[categoryName].push(item)
        }
        saveContentIndex = null
        saveMode= false
        await savePluginButton(dataToSave)
        await updateButtons()
    }

    const deleteButton = async (categoryName, contentName) => {
        buttonDialog.close()
        currentCategory = null
        const buttons = await getSavedButtons()
        const dataToSave = {
            ...buttons,
        }
        dataToSave[categoryName] = dataToSave[categoryName].filter(button => button.name !== contentName)
        await savePluginButton(dataToSave)
        await updateButtons()
    }

    export const updateButtons = async () => {
        buttons = await getSavedButtons()
        buttonCategories = Object.keys(buttons)
    }

    onMount(async () => {
        await updateButtons()
    })
</script>

{#if showButtonDialog}
    <ModalDialog bind:dialog={buttonDialog} on:close={() => {
        console.log("reset")
        showButtonDialog = false
        saveMode = false
    }} title={saveMode ? "Edit button" : "Add a new button"}>
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
        <button on:click={() => {
            addNewButton(currentCategory, content, contentName)
        }}>
            {saveMode ? "Save" : "Add"}
        </button>
        {#if saveMode}
            <button on:click={() => {
            deleteButton(currentCategory, contentName)
        }}>
                Delete
            </button>
        {/if}
        <br/>
        <br/>
    </ModalDialog>
{/if}

{#if showCategoryDialog}
    <ModalDialog bind:dialog={categoryDialog} on:close={() => {
        showCategoryDialog = false
        saveMode = false
    }} title={saveMode ? "Edit category" : "Add a new category"}>
        <input type="text"
               placeholder="Category name"
               autofocus
               on:keypress={onCategoryInputKeyPress}
               bind:value={content}/>
    </ModalDialog>
{/if}

<div class="aprt">
    <ul>
        {#each Object.entries(buttons) as [category, innerButtons]}
            <li>
                <a>{category}</a>

                <ul class="dropdown">
                    {#each innerButtons as { name, content }}
                        <li on:click={() => {
                                fill(content)
                            }}>
                            <a>{name}</a>

                            {#if edit}
                                <a on:click={() => {
                                        editButton(category, name, content)
                                    }}> [Edit]</a>
                            {/if}
                        </li>
                    {/each}
                    <li on:click={(event) => {
                            onNewButtonPress(event, category)
                        }}>
                        <a>
                            Add new
                        </a>
                    </li>
                    {#if edit}
                        <li on:click={() => {editCategory(category)}}>
                            <a>Edit Category Name</a>
                        </li>
                    {/if}
                </ul>
            </li>
        {/each}
        <li on:click={(event) => {
            onNewButtonPress(event)
        }}><a>
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

    textarea, input {
        width: 100%;
        margin-bottom: 0.2rem;
        min-height: 50px;
        min-width: 600px;
        border: none;
        overflow: auto;
        outline: none;
        background: #f6f6ff;
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
        z-index: 100;
    }

    button {
        margin-right: 0.2rem;
    }

    li a {
        color: #fff;
    }

    li:hover,
    button:hover,
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
        min-width: 10rem;
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

    ul.dropdown li {
        padding: 0.5rem 0.7rem;
    }

    ul li ul li {
        clear: both;
        width: 100%;
    }
</style>
