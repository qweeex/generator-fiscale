import { CHECK_CODE_CHARS, CHECK_CODE_EVEN, CHECK_CODE_ODD, MONTH_CODES, OMOCODIA_TABLE, OMOCODIA_TABLE_INVERSE } from './constants'
import { extractConsonants, extractVowels, getValidDate, birthplaceFields } from './utils'
class CodiceFiscale {
    constructor (data) {
        if (typeof data === 'string') {
            throw new Error('Provided input is not a valid Codice Fiscale')
        } else if (typeof data === 'object') {
            const cfData = data
            this.name = cfData.name
            this.surname = cfData.surname
            this.gender = this.checkGender(cfData.gender)
            // @ts-ignore
            this.birthday = cfData.birthday ? getValidDate(cfData.birthday) : getValidDate(cfData.day, cfData.month, cfData.year)
            // @ts-ignore
            this.birthplace = data.birthplace
            this.compute()
        } else {
            throw new Error('CodiceFiscale constructor accept either a valid string or a plain object. Check the documentation')
        }
    }
    static getCheckCode (codiceFiscale) {
        codiceFiscale = codiceFiscale.toUpperCase();
        let val = 0
        for (let i = 0; i < 15; i = i + 1) {
            const c = codiceFiscale[i]
            val += i % 2 !== 0 ? CHECK_CODE_EVEN[c] : CHECK_CODE_ODD[c]
        }
        val = val % 26
        return CHECK_CODE_CHARS.charAt(val)
    }
    static check (codiceFiscale) {
        if (typeof codiceFiscale !== 'string') {
            return false
        }
        let cf = codiceFiscale.toUpperCase()
        if (cf.length !== 16) {
            return false
        }
        if(! /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST]{1}[0-9LMNPQRSTUV]{2}[A-Z]{1}[0-9LMNPQRSTUV]{3}[A-Z]{1}$/.test(cf)){
            return false;
        }
        const expectedCheckCode = codiceFiscale.charAt(15)
        cf = codiceFiscale.slice(0, 15)
        return CodiceFiscale.getCheckCode(cf).toUpperCase() === expectedCheckCode.toUpperCase();
    }
    static isOmocodia(cf){
        for(const pos of [6,7,9,10,12,13,14]){
            if(!/^[0-9]$/.test(cf[pos])) return true;
        }
        return false;
    }
    static getOmocodie (cf) {
        return new CodiceFiscale(cf).omocodie()
    }
    static surnameCode(surname){
        const codeSurname = `${extractConsonants(surname)}${extractVowels(surname)}XXX`
        return codeSurname.substr(0, 3).toUpperCase()
    }
    static nameCode(name){
        let codNome = extractConsonants(name)
        if (codNome.length >= 4) {
            codNome = codNome.charAt(0) + codNome.charAt(2) + codNome.charAt(3)
        } else {
            codNome += `${extractVowels(name)}XXX`
            codNome = codNome.substr(0, 3)
        }
        return codNome.toUpperCase()
    }
    static dateCode(day, month, year, gender){
        year = `0${year}`
        year = year.substr(year.length - 2, 2)
        month = MONTH_CODES[month-1];
        if (gender.toUpperCase() === 'F') {
            day += 40
        }
        day = `0${day}`
        day = day.substr(day.length - 2, 2)
        return `${year}${month}${day}`
    }
    static toNumberIfOmocodia(input){
        if (isNaN(input)) {
            let res = ""
            let tokens = input.split("")
            for(let i=0; i<tokens.length; i++){
                let e = tokens[i]
                res += isNaN(e) ? OMOCODIA_TABLE_INVERSE[e] : e
            }
            return res;
        }
        return input
    }
    toString () {
        return this.code
    }
    isValid () {
        if (typeof this.code !== 'string') {
            return false
        }
        this.code = this.code.toUpperCase()
        if (this.code.length !== 16) {
            return false
        }
        const expectedCheckCode = this.code.charAt(15)
        const cf = this.code.slice(0, 15)
        return CodiceFiscale.getCheckCode(cf).toUpperCase() === expectedCheckCode.toUpperCase()
    }
    omocodie () {
        const results = []
        let lastOmocode = (this.code.slice(0, 15))
        for (let i = this.code.length - 1; i >= 0; i--) {
            const char = this.code[i]
            if (char.match(/\d/) !== null) {
                lastOmocode = `${lastOmocode.substr(0, i)}${OMOCODIA_TABLE[char]}${lastOmocode.substr(i + 1)}`
                results.push(lastOmocode + CodiceFiscale.getCheckCode(lastOmocode))
            }
        }
        return results
    }
    compute () {
        let code = this.getSurnameCode()
        code += this.getNameCode()
        code += this.dateCode()
        code += this.birthplace
        code += CodiceFiscale.getCheckCode(code)
        this.code = code
    }
    checkGender (gender) {
        this.gender = gender !== undefined ? gender.toUpperCase() : this.gender.toUpperCase()
        if (typeof this.gender !== 'string') {
            throw new Error('Gender must be a string')
        }
        if (this.gender !== 'M' && this.gender !== 'F') {
            throw new Error('Gender must be either \'M\' or \'F\'')
        }
        return gender
    }
    getSurnameCode () {
        return CodiceFiscale.surnameCode(this.surname);
    }
    getNameCode () {
        return CodiceFiscale.nameCode(this.name);
    }
    dateCode () {
        return CodiceFiscale.dateCode(this.birthday.getDate(), this.birthday.getMonth() + 1, this.birthday.getFullYear(), this.gender);
    }
}

CodiceFiscale.utils = {
    birthplaceFields: birthplaceFields
}
export default CodiceFiscale;