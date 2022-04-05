<script>
    import AppContentScript from '~/entries/contentScript/primary/AppContentScript.svelte'

    let lastValue = null

</script>

<main>
    <h1>App Store Review Templates Settings</h1>
    <a href="https://github.com/HugoGresse/app-store-review-templates" target="_blank">GitHub</a>

    <br/>
    <br/>

    {#if lastValue}
        <div class="example">
            {lastValue}
        </div>
    {/if}

    <AppContentScript
            edit={true}
            fill={data => {
            lastValue = data
        }}/>

</main>

<style>
    :root {
        background: #EEE;
    }

    main {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
    }

    main {
        max-width: 1200px;
        margin: 0 auto;
    }

    .example {
        background: #FEFEFE;
        padding: 10px;
        text-align: left;
        margin: 0 10px;
    }
</style>
