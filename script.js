import { storyData } from './dados.js';

class StoryGenerator {
    constructor() {
        // Aqui inicializamos os elementos personalizados e o estado do personagem, assim como contadores para os eventos e limites para controlar a quantidade de certos eventos na história.
        this.customElements = {
            characters: [],
            events: [],
            items: [],
            creatures: []
        };
        this.characterState = {
            hasMagicItem: false
        };
        this.eventCounters = {
            creatureEncounters: 0,
            itemFinds: 0,
            rareEvents: 0,
            twists: 0
        };
        this.eventLimits = {
            maxCreatureEncounters: 2,
            maxItemFinds: 2,
            maxRareEvents: 1,
            maxTwists: 1
        };
    }

    // Função para obter um elemento aleatório de um array (lista)
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }


    // Função principal que gera a história com base no tema escolhido e nos elementos disponíveis (tanto do tema quanto os personalizados pelo usuário)
    generateStory(theme) {
        const selectedTheme = storyData[theme];
    
        // Aumentamos a chance de os elementos personalizados aparecerem duplicando eles na lista
        const characters = [...selectedTheme.characters, ...this.customElements.characters, ...this.customElements.characters];
        const items = [...selectedTheme.items, ...this.customElements.items, ...this.customElements.items];
        const creatures = [...selectedTheme.creatures, ...this.customElements.creatures, ...this.customElements.creatures];
        const events = [...selectedTheme.events, ...this.customElements.events, ...this.customElements.events];
        const settings = selectedTheme.settings;
    
        // Seleciona personagens, itens, criaturas, ambientes e eventos aleatórios
        const character = this.getRandomElement(characters);
        const item = this.eventCounters.itemFinds >= this.eventLimits.maxItemFinds ? 'não encontrou mais itens mágicos' : this.getRandomElement(items);
        const creature = this.getRandomElement(creatures);
        const setting = this.getRandomElement(settings);
        let event1 = this.getRandomElement(events);
        let event2 = this.getRandomElement(events);
        let event3 = this.getRandomElement(events);
    
        // Limita a quantidade de encontros com criaturas e ajusta o evento caso o limite seja alcançado
        if (this.eventCounters.creatureEncounters >= this.eventLimits.maxCreatureEncounters) {
            event1 = 'evitou encontros com criaturas';
            event2 = 'evitou confrontos';
        } else {
            this.eventCounters.creatureEncounters++;
        }
    
        // Aumenta o contador de itens encontrados, se o personagem encontrar um item
        if (item !== 'não encontrou mais itens mágicos') {
            this.eventCounters.itemFinds++;
        }
    
        // Templates de como as histórias podem ser montadas com os elementos selecionados aleatoriamente
        const templates = [
            `${character}, usando ${item}, busca um tesouro escondido em ${setting}, mas é surpreendido por ${creature} durante uma tempestade furiosa.`,
            `${character}, em busca de ${item} capaz de derrotar ${creature}, participa de um torneio real em ${setting}, onde se depara com ${creature} guardiões da arma.`,
            `${character}, pilotando uma nave espacial antiga, busca ${item} capaz de deter uma invasão alienígena em ${setting} e ${event1}, mas é capturado por um alienígena telepata.`,
            `${character}, em busca de ${item} para curar um apocalipse zumbi, se refugia em ${setting}, onde é perseguido por ${creature} imunes à infecção.`,
            `${character}, atraído pelas promessas de riqueza e fama, decide desafiar as antigas lendas e adentrar ${setting}. Ao se aprofundar, descobre que é habitada por ${creature} e que a criatura que busca é, na verdade, ${creature}, um ser poderoso e protetor. Ao confrontar o guardião, se depara com a verdade sobre suas ações e deve escolher entre a glória pessoal e a preservação da natureza.`,
            `${character}, atraída(o) por promessas de desvendar os mistérios de uma antiga civilização, decide desafiar as antigas lendas e adentrar ${setting}. Ao se aprofundar, descobre que é habitada por ${creature} e que a criatura que busca é, na verdade, um leviatã, um ser poderoso e protetor, que guarda ${item}, então ${event1} e ${event2}. E ao confrontar o guardião, se depara com a verdade sobre a destruição causada pela humanidade e deve escolher entre a fama mundial e a preservação do ecossistema. `,
        ];
    
        // Retorna uma história gerada aleatoriamente com base nos templates e elementos selecionados
        return this.getRandomElement(templates);
    }

    // Função para adicionar elementos personalizados (personagens, itens, eventos, criaturas)
    addCustomElement(type, element) {
        if (element && this.customElements[type]) {
            this.customElements[type].push(element);
        }
    }

    // Reseta o estado do personagem e os contadores de eventos para gerar novas histórias com tudo "zerado"
    resetState() {
        this.characterState = {
            hasMagicItem: false
        };
        this.eventCounters = {
            creatureEncounters: 0,
            itemFinds: 0,
            rareEvents: 0,
            twists: 0
        };
    }
}

// Função que exibe a história gerada na tela com efeito de "máquina de escrever"
function displayStory(story) {
    const storyOutput = document.getElementById('story');
    storyOutput.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < story.length) {
            storyOutput.textContent += story.charAt(i);
            i++;
            setTimeout(typeWriter, 30);
        }
    }
    typeWriter();
}

const storyGenerator = new StoryGenerator();

// Função que gera a história com base no tema selecionado e exibe ela na tela
function generateStory() {
    const theme = document.getElementById('theme').value;
    const story = storyGenerator.generateStory(theme);
    displayStory(story);
}

// Função que adiciona novos elementos personalizados (personagens, itens, eventos, criaturas) com base na entrada do usuário
function addCustomElement() {
    const types = ['character', 'event', 'item', 'creature'];
    types.forEach(type => {
        const element = document.getElementById(`custom${type.charAt(0).toUpperCase() + type.slice(1)}`).value.trim();
        if (element) {
            storyGenerator.addCustomElement(`${type}s`, element);
            document.getElementById(`custom${type.charAt(0).toUpperCase() + type.slice(1)}`).value = '';
        }
    });
}

// Adiciona listeners aos botões para gerar histórias e adicionar elementos personalizados
document.getElementById('generate').addEventListener('click', generateStory);
document.getElementById('addCustom').addEventListener('click', addCustomElement);
