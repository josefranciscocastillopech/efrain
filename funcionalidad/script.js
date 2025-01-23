document.addEventListener('DOMContentLoaded', async () => {
    const charactersList = document.getElementById('characters-list');
    const selectedCard = document.getElementById('selected-card');

    const savedCard = localStorage.getItem('selectedCard');
    if (savedCard) {
        selectedCard.innerHTML = savedCard;
    }

    try {
        const response = await fetch('https://rickandmortyapi.com/api/character');
        const data = await response.json();
        const characters = data.results;

        characters.forEach(character => {
            const characterDiv = document.createElement('div');
            characterDiv.classList.add('character');
            characterDiv.innerHTML = `
                <img src="${character.image}" alt="${character.name}">
                <h2>${character.name}</h2>
                <p>${character.status}</p>
            `;

            characterDiv.addEventListener('click', () => {
                const cardHTML = 
                `
                    <div class="card">
                        <img src="${character.image}" alt="${character.name}">
                        <h2>${character.name}</h2>
                        <p>${character.status}</p>
                        <p>${character.species}</p>
                        <p>${character.gender}</p>
                    </div>
                `;
                selectedCard.innerHTML = cardHTML;
                localStorage.setItem('selectedCard', cardHTML);
            });

            charactersList.appendChild(characterDiv);
        });
    } catch (error) {
        console.error('Error fetching characters:', error);
    }
});
