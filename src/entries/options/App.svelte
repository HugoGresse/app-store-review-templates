<script>
    import TabBar from '~/lib/TabBar.svelte'
    import { getSavedButtons, savePluginButton } from '~/lib/extensionStorage.js'

    let lastValue = null
    let importPreview = null

    const exportData = async () => {
        const data = await getSavedButtons()
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 4))
        const downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute("href", dataStr)
        downloadAnchorNode.setAttribute("download", "app-store-review-templates.json")
        document.body.appendChild(downloadAnchorNode) // required for firefox
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
    }

    const previewImport = async (event) => {
        importPreview = null
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.onload = (event) => {
            importPreview = event.target.result
        }
        reader.readAsText(file)
    }
    const importData = async () => {
        const data = JSON.parse(importPreview)
        await savePluginButton(data)
        alert('Import successful (probably)')
        importPreview = null
    }
</script>

<main>
    <h1>App Store Review Templates Settings</h1>
    <a href="https://github.com/HugoGresse/app-store-review-templates" target="_blank">GitHub</a>
    <br/>
    <br/>
    <div class="exportImport">
        <button on:click={exportData}>Export</button>
        <div>
            <label for="import">Import</label>
            <input type="file"
                   id="import"
                   accept=".json"
                   on:change={previewImport}
            />
            {#if importPreview}
                <pre>{importPreview}</pre>

                <button on:click={() => {
                importData(importData)
            }}>Import
                </button>
            {/if}
        </div>
    </div>

    <br/>

    {#if lastValue}
        <div class="example">
            {lastValue}
        </div>
    {/if}

    <TabBar
            edit={true}
            fill={data => {
            lastValue = data
        }}/>

</main>

<style>
    :root {
        background: #EEE;
    }

    @media (prefers-color-scheme: dark) {
        :root, a {
            background: #333;
            color: #EEE;
        }
    }

    a {
        font-size: 1.4rem;
    }

    main {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
    }

    main {
        max-width: 1200px;
        margin: 0 auto;
    }

    pre {
        text-align: left;
    }

    .example {
        background: #FEFEFE;
        padding: 10px;
        text-align: left;
        margin: 0 10px;
    }

    .exportImport {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }

    button, input, label {
        color: #fff;
        background: darkred;
        display: block;
        padding: 1rem;
        position: relative;
        text-decoration: none;
        transition-duration: 0.5s;
        border: none;
        cursor: pointer;
    }

    button:hover {
        filter: brightness(0.8);
    }
</style>
