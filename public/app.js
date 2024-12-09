const characterGrid = document.getElementById('characterGrid');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalDescription = document.getElementById('modalDescription');
const closeModal = document.getElementById('closeModal');
const loadingSpinner = document.getElementById('loadingSpinner');

async function fetchCharacters() {
    showLoading();
    try {
        const response = await fetch('/api/characters');
        const data = await response.json();
        return data.characters;
    } finally {
        hideLoading();
    }
}

function createCharacterCard(character) {
    const card = document.createElement('div');
    card.className = 'character-card bg-gray-800/80 rounded-xl overflow-hidden border border-gray-700 backdrop-blur-sm hover:border-blue-500 transition-all duration-300';
    card.innerHTML = `
        <div class="character-image-container">
            <img src="${character.image_url}" 
                 alt="${character.name}" 
                 class="character-image">
        </div>
        <div class="p-4">
            <h2 class="text-xl font-bold text-white mb-2">${character.name}</h2>
            ${character.title ? `<p class="text-blue-400 text-sm">${character.title}</p>` : ''}
        </div>
    `;
    card.addEventListener('click', () => showCharacterInfo(character.name));
    return card;
}

async function showCharacterInfo(name) {
    showLoading();
    try {
        const response = await fetch(`/api/character/${name}`);
        const data = await response.json();
        const character = data.character;

        modalTitle.textContent = `${character.name} - ${character.title}`;
        modalImage.src = character.info_image_url || character.image_url;
        modalImage.alt = character.name;
        modalDescription.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                    <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 class="text-lg font-semibold text-blue-400 mb-2">Ability</h3>
                        <p class="text-gray-300">${character.ability}</p>
                    </div>
                    <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 class="text-lg font-semibold text-blue-400 mb-2">Ability Info</h3>
                        <p class="text-gray-300">${character.ability_info}</p>
                    </div>
                </div>
                <div class="space-y-4">
                    <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 class="text-lg font-semibold text-blue-400 mb-2">Personal Info</h3>
                        <p class="text-gray-300">Gender: ${character.gender}</p>
                        <p class="text-gray-300">Age: ${character.age}</p>
                        <p class="text-gray-300">Birthday: ${character.birthday}</p>
                    </div>
                    <div class="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                        <h3 class="text-lg font-semibold text-blue-400 mb-2">About</h3>
                        <p class="text-gray-300">${character.about}</p>
                    </div>
                </div>
            </div>
            <div class="mt-6 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <h3 class="text-lg font-semibold text-blue-400 mb-2">Description</h3>
                <p class="text-gray-300">${character.description}</p>
            </div>
        `;
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        setTimeout(() => modalContent.classList.add('active'), 10);
    } finally {
        hideLoading();
    }
}

closeModal.addEventListener('click', () => {
    modalContent.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }, 300);
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal.click();
    }
});

let debounceTimer;
searchInput.addEventListener('input', async (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        const query = e.target.value.trim();
        showLoading();
        try {
            if (query) {
                const response = await fetch(`/api/search/${query}`);
                const data = await response.json();
                displayCharacters(data.characters);
            } else {
                const characters = await fetchCharacters();
                displayCharacters(characters);
            }
        } finally {
            hideLoading();
        }
    }, 300);
});

async function displayCharacters(characters) {
    characterGrid.innerHTML = '';
    characters.forEach((character, index) => {
        const card = createCharacterCard(character);
        card.style.animationDelay = `${index * 100}ms`;
        characterGrid.appendChild(card);
    });
}

(async () => {
    const characters = await fetchCharacters();
    displayCharacters(characters);
})();

function showLoading() {
    loadingSpinner.classList.remove('hidden');
    characterGrid.classList.add('loading');
}

function hideLoading() {
    loadingSpinner.classList.add('hidden');
    characterGrid.classList.remove('loading');
}

