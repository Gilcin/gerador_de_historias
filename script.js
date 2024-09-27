import { storyData, PLOT_TWISTS } from './dados.js';
import { connectors, connect, actions, consequences } from './conectors.js';

document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme');
    
    const changeBackground = (theme) => {
        document.body.classList.remove('fantasia', 'aventura', 'misterio', 'ficcao', 'terror', 'epica');
        if (theme) {
            document.body.classList.add(theme);
        }
    };

    themeSelect.addEventListener('change', (event) => {
        changeBackground(event.target.value);
    });

    const initialTheme = themeSelect.value;
    changeBackground(initialTheme);
});

class StoryGenerator {
    constructor() {
        this.customElements = {
            characters: [],
            events: [],
            items: [],
            creatures: []
        };
        this.lastGeneratedStory = '';
    }

    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    selectElementWithHighPreference(themeElements, customElements) {
        if (customElements.length > 0) {
            return Math.random() < 0.9 ? this.getRandomElement(customElements) : this.getRandomElement(themeElements);
        }
        return this.getRandomElement(themeElements);
    }

    generateStory(theme) {
        const selectedTheme = storyData[theme];
    
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        const characters = shuffleArray([...selectedTheme.characters, ...this.customElements.characters]);
        const items = shuffleArray([...selectedTheme.items, ...this.customElements.items]);
        const creatures = shuffleArray([...selectedTheme.creatures, ...this.customElements.creatures]);
        const events = shuffleArray([...selectedTheme.events, ...this.customElements.events]);
        const scenarios = shuffleArray([...selectedTheme.scenarios]);
        const bosses = shuffleArray([...selectedTheme.boss]);
        const plotTwists = shuffleArray(PLOT_TWISTS);
    
        const character = characters[0];
        const item = items[0];
        const creature = creatures[0];
        const scenario = scenarios[0];
        const boss = bosses[0];
        const plotTwist = plotTwists[0];
        const [event1, event2, event3] = events.slice(0, 3);

        function getRandomConnector() {
            return connectors[Math.floor(Math.random() * connectors.length)];
        }

        const templates = [
            `Em uma jornada épica, ${character} parte em busca de ${item} em ${scenario}. ${getRandomConnector()} ${event1} ${getRandomConnector()} um encontro inesperado com ${creature} muda tudo quando ${plotTwist}. Será que ${character} conseguirá superar ${boss} e completar sua missão? `,
            
            `O mundo de ${scenario} está em perigo, e apenas ${character} pode salvá-lo usando ${item}. ${getRandomConnector()} ${event1}. Com a ajuda improvável de ${creature}, nosso herói enfrenta ${boss} em uma batalha final cheia de reviravoltas. E naquele momento ${plotTwist}.  `,
            
            `${character} descobre um antigo segredo em ${scenario}: ${item} tem o poder de controlar ${creature}. ${getRandomConnector()} ${event1} ameaça revelar esse segredo para ${boss}. Em uma corrida contra o tempo, ${character} precisa ${event2} antes que seja tarde demais. `,
            
            `Uma profecia antiga fala de ${character}, ${item}, e um destino ligado a ${scenario}. Quando ${event1}, tudo parecia perdido. Mas com a orientação de ${creature} e enfrentando os desafios impostos por ${boss}, uma nova esperança surge. ${getRandomConnector()} ${event2} revela uma verdade chocante que muda tudo. `,
        
            `${character} herda ${item} de um ancestral misterioso. ${getRandomConnector()} descobre que o objeto é a chave para salvar ${scenario} de uma antiga maldição. Com ${creature} como aliado improvável, enfrenta ${boss} em uma batalha épica que decidirá o destino de todos. `,
        
            `Em ${scenario}, ${character} é escolhido para um torneio mágico. Armado apenas com ${item}, enfrenta desafios impossíveis. ${getRandomConnector()} ${event1} revela uma conspiração envolvendo ${boss}. Com a ajuda de ${creature}, nosso herói luta não só pela vitória, mas pela verdade. `,
        
            `${character} acorda em ${scenario} sem memória, apenas com ${item} em mãos. ${getRandomConnector()} ${event1} o que levou a uma jornada de autodescoberta. Enfrentando ${creature} e desvendando segredos, percebe que seu verdadeiro inimigo é ${boss}, uma parte esquecida de si mesmo. E que ${plotTwist}. `,
        
            `Numa era de caos em ${scenario}, ${character} descobre que ${item} é a chave para restaurar a ordem. ${getRandomConnector()} ${event1} que ameaçam destruir tudo. Aliando-se a ${creature}, nosso herói deve impedir ${boss} de usar o poder do caos para seus próprios fins nefastos. `
        ];

        const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
        this.lastGeneratedStory = selectedTemplate;

        return selectedTemplate;
    }

    generateAdditionalParagraph() {
        if (!this.lastGeneratedStory) {
            return "Primeiro gere uma história antes de adicionar um parágrafo.";
        }

        const additionalParagraph = `${this.getRandomElement(connect)} nosso herói ${this.getRandomElement(actions)}, ${this.getRandomElement(consequences)}.`;
        
        this.lastGeneratedStory += " " + additionalParagraph;
        return additionalParagraph;
    }

    addCustomElement(type, element) {
        if (element && this.customElements[type]) {
            this.customElements[type].push(element);
        }
    }
}

function displayStory(story, append = false) {
    const storyOutput = document.getElementById('story');
    if (!append) {
        storyOutput.textContent = '';
    }
    
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

function generateStory() {
    const theme = document.getElementById('theme').value;
    const story = storyGenerator.generateStory(theme);
    displayStory(story);
}

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

function generateAdditionalParagraph() {
    const additionalParagraph = storyGenerator.generateAdditionalParagraph();
    displayStory(additionalParagraph, true);
}

document.getElementById('generate').addEventListener('click', generateStory);
document.getElementById('addCustom').addEventListener('click', addCustomElement);
document.getElementById('addParagraph').addEventListener('click', generateAdditionalParagraph);