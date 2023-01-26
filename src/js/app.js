import Name from "./data/name";
import Surname from "./data/surname";
import {createApp} from "vue/dist/vue.esm-browser";
import CodiceFiscale from "./libs/codice-fiscale/codice-fiscale";

const app = createApp({
    data(){
         return {
             randomName: [],
             randomSurname: [],
             users: [],
             count: 0
         }
    },
    mounted() {
        console.log(this.getRandomName())
    },
    methods: {
        generateUsers(){
            let count = this.count;
            let fiscaleCode = new CodiceFiscale({
                name: "Arkady",
                surname: "Pugachev",
                gender: "M",
                day: 4,
                month: 9,
                year: 1997,
                birthplace: "B300"
            })
            console.log(fiscaleCode)
        },
        getRandomName(){
            return Name[Math.floor(Math.random() * (16 - 0)) + 0];
        },
        getRandomSurname(){
            return Surname[Math.floor(Math.random() * (16 - 0)) + 0];
        }
    }
})

app.mount('#app')