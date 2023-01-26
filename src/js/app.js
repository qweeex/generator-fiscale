import Name from "./data/name";
import Surname from "./data/surname";
import City from "./data/city";
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
            this.users = [];
            for (let i = 0; i < count; i++) {
                let currentCity = this.getCity();
                let fiscaleCode = new CodiceFiscale({
                    name: this.getRandomName(),
                    surname: this.getRandomSurname(),
                    gender: "M",
                    day: this.randomIntFromInterval(1, 24),
                    month: this.randomIntFromInterval(1, 12),
                    year: this.randomIntFromInterval(1970, 2002),
                    birthplace: currentCity.Code
                })
                this.users.push({
                    surname: fiscaleCode.surname,
                    name: fiscaleCode.name,
                    gender: fiscaleCode.gender,
                    code: fiscaleCode.code,
                    birthday: fiscaleCode.birthday,
                    city: currentCity.DisplayedName
                })
            }
        },
        getRandomName(){
            return Name[Math.floor(Math.random() * (16 - 0)) + 0];
        },
        getRandomSurname(){
            return Surname[Math.floor(Math.random() * (16 - 0)) + 0];
        },
        randomIntFromInterval(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min)
        },
        getCity(){
            return City[Math.floor(Math.random() * (16 - 0)) + 0];
        }
    }
})

app.mount('#app')