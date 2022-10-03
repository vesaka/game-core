/* global Function */
import Vue from 'vue';
import Alert from '$m/media/game/components/global/Alert';
import I18nMixin from './i18n-mixin';
export default {
    data() {
        return {
            errorBag: {},
            errors: {},
            rules: {},
            inputs: {},
            form: null,
            key: 0
        };
    },
    props: {
        model: {
            type: Object,
            default() {
                return {};
            }
        },
        bail: {
            type: Boolean,
            default: false
        },
        validated: {
            type: Function,
            default() {
                return () => {
                };
            }
        },
        regexp: {
            type: Object,
            default() {
                return  {
                    rule: /^(.+?)\[(.+)\]$/,
                    numeric: /^[0-9]+$/,
                    integer: /^\-?[0-9]+$/,
                    decimal: /^\-?[0-9]*\.?[0-9]+$/,
                    email: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                    alpha: /^[a-z]+$/i,
                    alphaNumeric: /^[a-z0-9]+$/i,
                    alphaDash: /^[a-z0-9_\-\s]+$/i,
                    alphaDashCyrilic: /^[a-zа-я0-9_\-\s\.,]+$/i,
                    natural: /^[0-9]+$/i,
                    naturalNoZero: /^[1-9][0-9]*$/i,
                    ip: /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
                    base64: /[^a-zA-Z0-9\/\+=]/i,
                    numericDash: /^[\d\-\s]+$/,
                    greek: /^[a-zA-Z0-9Ά-ωΑ-ώ\s]+$/i,
                    phoneNumber: /^([99|96|22])(\s{1})([0-9]{3})(\s{1})([0-9]{3})$/,
                    url: /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
                    date: /(^(((0[1-9]|1[0-9]|2[0-8])[-](0[1-9]|1[012]))|((29|30|31)[-](0[13578]|1[02]))|((29|30)[-](0[4,6,9]|11)))[-](19|[2-9][0-9])\d\d$)|(^29[-]02[-](19|[2-9][0-9])(00|04|08|12|16|20|24|28|32|36|40|44|48|52|56|60|64|68|72|76|80|84|88|92|96)$)/

                };
            }

        }
    },
    directives: {
        validate: {
            bind(el, binding, node, oldNode) {
                let rules = {}, params,
                        name = binding.rawName.replace('v-validate:', ''), $vue = node.context;
                el.setAttribute('name', name);

                if (typeof binding.value === 'string') {
                    let _rules = binding.value.split('|'), message;
                    rules = {};

                    _rules.forEach(rule => {
                        const parts = rule.replace(/\\:/g, '').split(':');
                        const _rule = parts[0];
                        let param = $vue.parseStringRule(parts[1]);
                        message = parts[2] || '';

                        if (message.startsWith('i18n\.')) {
                            message = $vue.translate(message.replace(/^i18n./, ''), typeof param === 'object' ? param : {});
                        }

                        if (typeof $vue[_rule] === 'function') {
                            rules[_rule] = {
                                param,
                                message
                            };
                        }
                    });

                    $vue.rules[name] = rules;
                } else if (typeof binding.value === 'object') {
                    let params = null, message;
                    for (let rule in binding.value) {
                        params = binding.value[rule].param || null;
                        message = binding.value[rule].message || '';
                        if (message.startsWith('i18n\.')) {
                            message = $vue.translate(message.replace(/^i18n./, ''), typeof params === 'object' ? params : {});
                        }
                        rules[rule] = {
                            param: binding.value[rule].param || null,
                            message: $vue.translate(message || `validations.${rule}`, params)
                        };
                    }
                    
                    $vue.rules[name] = rules;
                }

                $vue.$watch(name, (newValue, oldValue) => {
                    $vue.validateSingleField(name, newValue, oldValue);
                });


            },
            inserted(el, binding, node, oldNode) {
                let $vue = node.context, input, name = binding.rawName.replace('v-validate:', '');
                const errorBox = `error_${name}`;
                if (!$vue.$refs[errorBox]) {
                    let AlertClass = Vue.extend(Alert);
                    let instance = new AlertClass({
                        'template': `<alert ref="${errorBox}" :key="${$vue.key}"></alert>`,
                        propsData: {
                            attribute: name,
                            classes: 'text text-red-600 font-medium h-4',
                            text() {
                                return $vue.first(name);
                            }
                        },
                    });
                    instance.$mount();
                    el.parentNode.insertBefore(instance.$el, el.nextSibling);
                    $vue.$refs[errorBox] = instance.$el;

                }

            },
            update(el, binding, node) {
            },
            updatedComponent(el, binding, node) {
            }
        }
    },
    mixins: [I18nMixin],
    methods: {
        validateSingleField(name, value, oldValue = null) {
            let errors = [],
                    rules = this.rules[name];
            for (let method in rules) {
                if (false === this[method].apply(this, [value, rules[method].param])) {
                    errors.push(rules[method].message);
                }
            }
            this.errors[name] = errors;
        },
        required(a) {
            return a.length > 0;
        },
        email(a) {
            var pattern = new RegExp(this.$props.regexp.email);
            return pattern.test(a);
        },
        equals(a, b) {
            return a === b;
        },
        different(a, b) {
            return a !== b;
        },
        minLength(a, b) {
            return a.length >= b;
        },
        maxLength(a, b) {
            return a.length <= b;
        },
        length(a, b) {
            return a.length === b;
        },
        min(a, b) {
            return a >= b
        },
        max(a, b) {
            return a <= b;
        },
        range(a, b) {
            var _b = b.split('-');
            return a >= parseInt(_b[0]) && a <= parseInt(_b[1]);
        },
        between(a, b) {
            var _b = b.split('-');
            return a.length >= _b[0] && a.length <= _b[1];
        },
        same(a, b) {
            const data = this.flatten();
            for (var index in data) {
                if (index === b) {
                    return data[index] !== a;
                }
            }
            return true;
        },
        notSame(a, b) {
            const data = this.flatten();
            for (var index in data) {
                if (index === a) {
                    return data[index] !== b;
                }
            }
            return true;
        },
        gt(a, b) {
            return a > b;
        },
        lt(a, b) {
            return a < b;
        },
        gte(a, b) {
            return a >= b;
        },
        lte(a, b) {
            return a <= b;
        },
        dimmensions(a, b) {
            let valid = false;
            if (b.hasOwnProperty('min_width') && a >= b.min_width) {
                
            }

            if (b.hasOwnProperty('max_width') && a <= b.max_width) {

            }

            if (b.hasOwnProperty('min_height')) {

            }

            if (b.hasOwnProperty('max_height')&& a <= b.max_height) {

            }


            return valid;
        },
        regex(a, b) {
            var pattern = new RegExp(this.regexp[b]);
            return pattern.test(a);
        },
        hasExtension(a, b) {
            if (a.length === 0)
                return true;

            var array = b.replace("\s*", "").trim().split(','),
                    extension = a.substr(a.lastIndexOf('.') + 1).trim();
            return array.indexOf(extension) > -1;
        },
        list(a, b) {
            var array = b.replace("\s*", "").trim().split(',');
            return array.indexOf(a) > -1;
        },
        json(text) {
            try {
                var o = JSON.parse(text);
                if (o && typeof o === "object" && o !== null) {
                    true;
                }
            } catch (e) {
                return false;
            }
        },
        onSubmit(ev) {
            if (this.validate()) {
                
                if (typeof this.submit === 'function') {
                    this.submit(ev);
                }
                ;
            }
        },
        validate() {
            let rules, rule, value, errors = {}, valid = true;

            for (let name in this.rules) {
                rules = this.rules[name];
                value = this.dot(name, this.$data);
                errors[name] = [];
                for (let method in rules) {
                    if (false === this[method].apply(this, [value, rules[method].param])) {
                        errors[name].push(rules[method].message);

                        if (true === valid) {
                            valid = false;
                        }
                    }
                }
            }

            this.errors = errors;
            return true === valid;
        },
        setErrors(errors) {
            this.errors = errors;
        },
        parseStringRule(rule, attribute) {
            if (!rule) {
                return '';
            } else if (typeof rule === 'string') {
                if (rule.indexOf(',') > -1) {
                    let params = rule.split(','), rules = {};
                    for (let i in params) {
                        if (params[i].indexOf('=') > -1) {
                            let parts = params[i].split('=', 2);
                            rules[parts[0]] = parts[1];
                        }
                    }

                    if (Object.valueOf(rules) > 0) {
                        return rules;
                    }

                    return params;
                } else {

                }
            }

            return {
                other: rule,
                attribute
            };
        },
        flatten(prefix, obj = null) {
            var propName = (prefix) ? prefix + '.' : '',
                    ret = {},
                    obj = Object.assign({}, obj || this.$data);

            for (var attr in obj) {
                if (Array.isArray(obj[attr])) {
                    ret[attr] = obj[attr].join(',');
                } else if (typeof obj[attr] === 'object') {
                    Object.assign(ret, this.flatten(propName + attr, obj[attr]));
                } else {
                    ret[propName + attr] = obj[attr];
                }
            }
            return ret;
        },
        first(attribute = null) {

            if (Array.isArray(this.errors[attribute]) && this.errors[attribute].length > 0) {
                return this.errors[attribute][0];
            }

            return '';
        },
        dot(path, o) {
            let i, key, keys = path.split('.'), obj = Object.assign({}, o);
            for (i = 0; i < keys.length; i++) {
                key = keys[i];
                if (!obj || !obj.hasOwnProperty(key)) {
                    obj = undefined;
                    break;
                }
                obj = obj[key];
            }
            return obj;
        }
    },
    computed: {

    }
}
