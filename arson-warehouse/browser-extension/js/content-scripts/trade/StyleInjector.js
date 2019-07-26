class StyleInjector {
    constructor() {
        this._styles = {};
    }
    add(selector, rules) {
        this._styles[selector] = rules;
        return this;
    }
    inject(styleClassName = '') {
        const style = document.createElement('style');
        style.className = styleClassName;
        style.innerText = Object.entries(this._styles).map(([selector, rules]) => {
            return selector + '{' + this._flattenRules(rules).join(';') + '}';
        }).join('');
        document.head.appendChild(style);
    }
    _flattenRules(rules) {
        return Object.entries(rules).map(([key, value]) => `${key}:${value}`);
    }
}
