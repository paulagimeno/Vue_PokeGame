const app = Vue.createApp({
    //data, functions
    // template: '<h2>I am a template</h2>'
    data() {
        return {
            level: 1, 
            score: 0,
            pokemons: [],
            userGuess: {},
            correctGuesses: [],
            endGame: false,
        }
    },
    mounted(){
        this.fetchData();
    },
    computed:{
        filteredPokemons() {
            let minLength, maxLength;

            switch (this.level) {
                case 1: 
                    minLength = 1;
                    maxLength = 5;
                    break;
                case 2: 
                    minLength = 6;
                    maxLength = 6;
                    break;
                case 3: 
                    minLength = 7;
                    maxLength = 7;
                    break;
                case 4: 
                    minLength = 8;
                    maxLength = 8;
                    break;
                case 5: 
                    minLength = 9;
                    maxLength = 9;
                    break;
                case 6: 
                    minLength = 10;
                    maxLength = Infinity;
                    break;
            }

            const filteredByLength = this.pokemons.filter(pokemon => pokemon.name.length >= minLength && pokemon.name.length <= maxLength);

            const shuffledPokemons = this.shuffleArray(filteredByLength);

            return shuffledPokemons.slice(0, 5);
            
        },

        shuffledPokemons() {
            return this.filteredPokemons.map(pokemon => {
                return {
                    ...pokemon,
                    shuffledName: this.shuffleString(pokemon.name),
                };
            });
        },
    },
    methods: {
        fetchData() {
            axios.get('https://pokeapi.co/api/v2/pokemon?limit=386')
                .then(response => {
                    this.pokemons = response.data.results;
                    console.log(this.pokemons)
                })
                .catch(error => {
                    console.error('Error fetching data:', error)
                })
        },

        shuffleString(str) {
            const array = str.split('');
            for(let i = array.length -1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i +1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array.join('')
        }, 

        shuffledName(pokemon) {
            return pokemon.shuffledName;
        },

        shuffleArray(array) {
            for (let i = array.length -1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]
            }
            return array;
        },

        checkAnswer(pokemonName) {
            const userGuess = this.userGuess[pokemonName]

            if (userGuess == pokemonName) {
                this.score++
                this.correctGuesses.push(pokemonName)
            } else {
                this.correctGuesses.push(pokemonName)
            }
        },

        correctlyGuessed(pokemonName) {
            return this.correctGuesses.includes(pokemonName);
        },

        nextLevel() {
            this.level++
        }, 

        showResults() {
            this.endGame = true
        }
    }
})

app.mount('#app')