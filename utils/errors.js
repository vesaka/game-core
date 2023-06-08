import { t } from './i18n';
import { isObject } from './object';
import { aprintf } from './string';

export const parse422 = (response) => {
    if ((422 === response.status)) {
        const newErrors = {};
        const { errors } = response.data;
        console.log(errors);
        for (let name in errors) {
            const [rule, params] = errors[name][0].split(':'); 
            console.log(params?.split(','));
            newErrors[name] = aprintf(t(`messages.${name}.${rule}`), parse(params));
        }
        return newErrors;
    }

    return {
        "error": "404"
    }
};

const parse = (params) => {
    if (!params) {
        return [];
    }

    if (params.match(/^\s*[\w\s]+(?:,\s*[\w\s]+)*\s*$/)) {
        return  params.split(',').map((param) => param.trim());
    }

    if (params.match(/^(\w+)=(\w+)(?:,(\w+)=(\w+))*$/)) {
        return params.split(',').map((param) => {
            const [key, value] = param.split('=');
            return { [key]: value };
        });
    }

    return [];
}