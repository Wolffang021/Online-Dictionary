const definitionCache = {};
const input = document.getElementsByClassName('input')[0];

input.addEventListener('keyup', function(event) {
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
        html += `<audio controls src="${pronounceAudio.audio}"></audio>`;
    }
    else {
        html += `<p>Audio not available</p>`;
    }

    html += `<ul>`;
    def.meanings.forEach(meaning => {
        html += `<h3><strong>Part of speech:</strong> ${meaning.partOfSpeech}</h3>`;

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

    definitionCache[searchedWord] = html;
    document.getElementById('searchHistory').innerHTML += `<option value="${searchedWord}">`;

    result.innerHTML = html;
}

async function searchWord() {
    const word = input.value.trim().toLowerCase();
    const result = document.getElementsByClassName('result')[0];
    result.style.display = "block";

    if (!word) {
        result.innerHTML = `<p>Type a word</p>`;
        return;
    }

    result.innerHTML = `<p>Loading...</p>`;

    if (definitionCache[word]) {
        result.innerHTML = definitionCache[word];
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
        if (definitionCache[word]) {
            result.innerHTML = definitionCache[word];
            return;
        }

        try {
            const response = await fetch(`https://api.datamuse.com/words?sp=${word}`);
            const responseJson = await response.json();

            if (responseJson[0].word == word) {
                throw new Error('No spelling correction available');
            }
    
            definitionCache[word] = 
                `<p><strong>Did you mean:</strong> <a href="javascript:void(0)" onclick="document.getElementsByClassName('input')[0].value='${responseJson[0].word}';searchWord()">${responseJson[0].word}</a></p>
                <p>Word definition does not exist!</p>`;
    
            result.innerHTML = definitionCache[word];
        }
        catch (error) {
            definitionCache[word] = `<p>Word definition does not exist!</p>`;
            result.innerHTML = definitionCache[word];
        }
    }
}