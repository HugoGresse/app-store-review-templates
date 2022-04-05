export const listenClickOutsideDialog = (dialog) => {
    dialog.addEventListener('click', function (event) {
        const rect = dialog.getBoundingClientRect();
        const isInDialog=(rect.top <= event.clientY && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
        if (!isInDialog) {
            dialog.close();
        }
    });
}
