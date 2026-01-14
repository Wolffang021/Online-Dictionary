async function searchWord() {
    const word = document.getElementsByClassName('input')[0].value.trim();
    const result = document.getElementsByClassName('result')[0];

    if (!word) {
        result.innerHTML = `<p class="noWord">Type a word</p>`;
        return;
    }
}