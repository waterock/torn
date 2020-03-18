global.Vue.component('MoneyInput', {
    template: `
<input type="text" :value="value" @input="parseThenEmitValue($event.target.value)" @blur="formatValue($event.target.value)"/>   
`,
    props: ['value'],
    methods: {
        parseThenEmitValue(value) {
            // todo in input - parse the current input like "1M" into 1,000,000 under water without changing the user's input
            const parsedValue = this.parseValue(value);
        },
        parseValue(value) {
            const digitsOnly = value.replace(/[.,]/g, '');
            console.log(digitsOnly);
        },
        formatValue() {
            // todo on blur - turn the value like "1M" into 1,000,000
        },
    }
});