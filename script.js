// Importa os dados das histórias de um arquivo externo.
import { storyData } from './dados.js';

class StoryGenerator {
    constructor() {
        // Define um objeto para armazenar elementos personalizados que o usuário adicionar.
        this.customElements = {
            characters: [], events: [], items: [], creatures: []
        };
    }

    // Função para selecionar um elemento aleatório de um array.
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    selectElementWithHighPreference(themeElements, customElements) {
        if (customElements.length > 0) {
            // 80% de chance de selecionar um elemento personalizado
            return Math.random() < 0.8 ? this.getRandomElement(customElements) : this.getRandomElement(themeElements);
        }
        return this.getRandomElement(themeElements);
    }

    // Função que gera uma história com base no tema selecionado.
    generateStory(theme) {
        const selectedTheme = storyData[theme];
    
        // Usa a nova função de seleção para cada tipo de elemento
        const character = this.selectElementWithHighPreference(selectedTheme.characters, this.customElements.characters);
        const item = this.selectElementWithHighPreference(selectedTheme.items, this.customElements.items);
        const creature = this.selectElementWithHighPreference(selectedTheme.creatures, this.customElements.creatures);
        const scenario = this.getRandomElement(selectedTheme.scenarios);
        const boss = this.getRandomElement(selectedTheme.boss);
        
        const events = this.selectEvents(selectedTheme.events, this.customElements.events, 3);
        const [event1, event2, event3] = events;
    
        const templates = [
            `${character}, usando ${item}, busca um tesouro escondido em ${scenario}, mas é surpreendido por ${creature} durante uma tempestade furiosa.`,
            `${character}, em busca de ${item} capaz de derrotar ${creature}, participa de um torneio real em ${scenario}, onde se depara com ${boss} guardião da arma.`,
            `${character}, pilotando uma nave espacial antiga, busca ${item} capaz de deter uma invasão alienígena em ${scenario} e ${event1}, mas é capturado por um alienígena telepata.`,
            `${character}, em busca de ${item} para curar um apocalipse zumbi, se refugia em ${scenario}, onde é perseguido por ${creature} imunes à infecção.`,
            `${character}, atraído pelas promessas de riqueza e fama, decide desafiar as antigas lendas e adentrar ${scenario}. Ao se aprofundar, descobre que é habitada por ${creature} e que a criatura que busca é, na verdade, ${boss}, um ser poderoso e protetor. Ao confrontar o guardião, se depara com a verdade sobre suas ações e deve escolher entre a glória pessoal e a preservação da natureza.`,
            `${character}, atraída(o) por promessas de desvendar os mistérios de uma antiga civilização, decide desafiar as antigas lendas e adentrar ${scenario}. Ao se aprofundar, descobre que é habitada por ${creature} e que a criatura que busca é, na verdade, ${boss}, um ser poderoso e protetor, que guarda ${item}, então ${event1} e ${event2}. E ao confrontar o guardião, se depara com a verdade sobre a destruição causada pela humanidade e deve escolher entre a fama mundial e a preservação do ecossistema. `,
        ];
    
        return this.getRandomElement(templates);
    }

    selectEvents(themeEvents, customEvents, count) {
        let selectedEvents = [];
        for (let i = 0; i < count; i++) {
            if (customEvents.length > 0 && (Math.random() < 0.75 || selectedEvents.length >= customEvents.length)) {
                // 75% de chance de selecionar um evento personalizado, ou se já selecionamos todos os personalizados
                let event = this.getRandomElement(customEvents);
                while (selectedEvents.includes(event) && customEvents.length > selectedEvents.length) {
                    event = this.getRandomElement(customEvents);
                }
                selectedEvents.push(event);
            } else {
                let event = this.getRandomElement(themeEvents);
                while (selectedEvents.includes(event)) {
                    event = this.getRandomElement(themeEvents);
                }
                selectedEvents.push(event);
            }
        }
        return selectedEvents;
    }

    addCustomElement(type, element) {
        if (element && this.customElements[type]) {
            this.customElements[type].push(element);
        }
    }
}


// Função que exibe a história na página, imprimindo-a letra por letra (efeito de máquina de escrever).
function displayStory(story) {
    const storyOutput = document.getElementById('story');
    storyOutput.textContent = ''; // Limpa o conteúdo anterior.

    let i = 0;
    function typeWriter() {
        if (i < story.length) {
            storyOutput.textContent += story.charAt(i); // Adiciona cada letra gradualmente.
            i++;
            setTimeout(typeWriter, 30); // Controla a velocidade de digitação.
        }
    }
    typeWriter(); // Inicia o efeito de digitação.
}

// Aguarda até que o documento esteja completamente carregado.
document.addEventListener('DOMContentLoaded', () => {
    const storyGenerator = new StoryGenerator(); // Cria uma instância da classe StoryGenerator.
    const themeSelect = document.getElementById('theme'); // Obtém a seleção de tema no HTML.

    // Função para alterar o fundo da página de acordo com o tema selecionado.
    function changeBackground(theme) {
        document.body.classList.remove('fantasia', 'aventura', 'misterio', 'ficcao');
        if (theme) document.body.classList.add(theme); // Adiciona a classe correspondente ao tema.
    }

    // Atualiza o fundo da página quando o usuário seleciona um tema.
    themeSelect.addEventListener('change', (event) => changeBackground(event.target.value));
    changeBackground(themeSelect.value); // Define o fundo inicial com o valor selecionado.

    // Gera uma nova história quando o botão "generate" é clicado.
    document.getElementById('generate').addEventListener('click', () => {
        const theme = themeSelect.value; // Obtém o tema selecionado.
        const story = storyGenerator.generateStory(theme); // Gera a história.
        displayStory(story); // Exibe a história.
    });

    // Adiciona elementos personalizados quando o botão "addCustom" é clicado.
    document.getElementById('addCustom').addEventListener('click', () => {
        // Para cada tipo de elemento (character, event, item, creature), adiciona o valor inserido pelo usuário.
        ['character', 'event', 'item', 'creature'].forEach(type => {
            const input = document.getElementById(`custom${type.charAt(0).toUpperCase() + type.slice(1)}`);
            const element = input.value.trim(); // Remove espaços em branco do início e do fim.
            if (element) {
                storyGenerator.addCustomElement(`${type}s`, element); // Adiciona o elemento ao gerador.
                input.value = ''; // Limpa o campo de entrada após a adição.
            }
        });
    });
});
