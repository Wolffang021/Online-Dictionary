function displayDefinition(definition) {
    const result = document.getElementsByClassName('result')[0];

    let html = `<h2>${definition.word}</h2>
                <p><strong>Phonetic:</strong> ${definition.phonetic || "N/A"}</p>`;

    const pronounceAudio = definition.phonetics?.find(p => p.audio);
    if (pronounceAudio) {
        html += `<audio controls src="${pronounceAudio.audio}"></audio>`
    }

    result.innerHTML = html;
}

async function searchWord() {
    const word = document.getElementsByClassName('input')[0].value.trim();
    const result = document.getElementsByClassName('result')[0];

    if (!word) {
        result.innerHTML = `<p>Type a word</p>`;
        return;
    }

    result.innerHTML = `<p>Loading...</p>`;

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (!response.ok) {
            throw new Error('Word not found');
        }

        const definition = await response.json();
        displayDefinition(definition[0]);
    } catch (error) {
        result.innerHTML = `<p>Word definition does not exist!</p>`;
    }
}