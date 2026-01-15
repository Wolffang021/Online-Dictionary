const searchedWords = {};

function displayDefinition(searchedWord, def) {
    const result = document.getElementsByClassName('result')[0];

    let html = `<h1>${def.word}</h1>
                <p><strong>Phonetic:</strong> ${def.phonetic || "N/A"}</p>`;

    const pronounceAudio = def.phonetics?.find(p => p.audio);
    if (pronounceAudio) {
        html += `<hr><audio controls src="${pronounceAudio.audio}"></audio>`;
    }
    else {
        html += `<hr><p>Audio not available</p>`;
    }

    def.meanings.forEach(meaning => {
        html += `<hr><h3><strong>Part of speech:</strong> ${meaning.partOfSpeech}</h3>`;

        meaning.definitions.forEach(definitionVar => {
            html += `<p>${definitionVar.definition}</p>`;

            const example = definitionVar.example;
            if (example) {
                html += `<p><strong>Example:</strong> ${example}</p>`;
            }
        });
    });

    searchedWords[searchedWord] = html;

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

    if (searchedWords[word]) {
        result.innerHTML = searchedWords[word];
        return;
    }

    try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);

        if (!response.ok) {
            throw new Error('Word not found');
        }

        const definition = await response.json();
        displayDefinition(word, definition[0]);
    }
    catch (error) {
        result.innerHTML = `<p>Word definition does not exist!</p>`;
    }
}