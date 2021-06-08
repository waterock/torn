const vueMixins = {
    escape: {
        methods: {
            escape(value) {
                const htmlEscapes = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;',
                };

                const escapeRegExp = /[&<>"']/g;
                const needsEscapingRegExp = /[&<>"']/;

                value = value.toString();
                if (value.length === 0 || ! needsEscapingRegExp.test(value)) {
                    return value;
                }

                return value.replace(escapeRegExp, (char) => htmlEscapes[char]);
            }
        }
    },
    formatCurrency: {
        methods: {
            formatCurrency(value) {
                return '$' + value.toLocaleString('en-US');
            }
        }
    },
    nl2br: {
        methods: {
            nl2br(value) {
                return value.replace(/\n/g, '<br>');
            }
        }
    }
};
