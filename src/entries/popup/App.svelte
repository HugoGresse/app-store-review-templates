<script>
</script>

<main>
    <a on:click={() => {
    if(chrome) {
        chrome.runtime.openOptionsPage()
    }
}}>Open Settings</a>

</main>

<style>
main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

a {
    cursor: pointer;
}
</style>
