const searchedWords = {};
const input = document.getElementsByClassName('input')[0];

input.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        searchWord();
    }
});

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

    html += `<ul>`;
    def.meanings.forEach(meaning => {
        html += `<hr><h3><strong>Part of speech:</strong> ${meaning.partOfSpeech}</h3>`;

        html += `<ol>`;
        meaning.definitions.forEach(definitionVar => {
            html += `<li><p>${definitionVar.definition}</p>`;

            const example = definitionVar.example;
            if (example) {
                html += `<p><strong>Example:</strong> ${example}</p>`;
            }
            html += `</li>`;
        });
        html += `</ol>`;
    });
    html += `</ul>`;

    searchedWords[searchedWord] = html;

    result.innerHTML = html;
}

async function searchWord() {
    const word = document.getElementsByClassName('input')[0].value.trim().toLowerCase();
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
        if (searchedWords[word]) {
            result.innerHTML = searchedWords[word];
            return;
        }

        try {
            const response = await fetch(`https://api.datamuse.com/words?sp=${word}`);
            const responseJson = await response.json();

            if (responseJson[0].word == word) {
                throw new Error('No spelling correction available');
            }
    
            searchedWords[word] = `<p><strong>Did you mean:</strong> ${responseJson[0].word}</p>
                                   <p>Word definition does not exist!</p>`;
    
            result.innerHTML = searchedWords[word];
        }
        catch (error) {
            searchedWords[word] = `<p>Word definition does not exist!</p>`;
            result.innerHTML = searchedWords[word];
        }

    }
}