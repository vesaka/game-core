import { describe, it, expect } from 'vitest';
import { parse422 } from '$core/utils/errors';
import { t, setLocales } from '$core/utils/i18n';
import { aprintf } from '$core/utils/string';

setLocales({
    "en": {
        "messages": {
            "email": {
                "required": "Email is required.",
                "email": "Email is invalid.",
                "unique": "Email is already taken.",
                "min": "Email must be at least {0} characters long.",
                "max": "Email must be at most {0} characters long."
            },
            "password": {
                "required": "Password is required.",
                "min": "Password must be at least {0} characters long.",
                "max": "Password must be at most {0} characters long.",
                "confirmed": "Password confirmation does not match."
            },
            "name": {
                "required": "Name is required.",
                "min": "Name must be at least {0} characters long.",
                "max": "Name must be at most {0} characters long.",
                "unique": "Name is already taken.",
                "alphanum": "Name must be alphanumeric."
            },
            "age": {
                "required": "Age is required.",
                "between": "Age must be between {0} and {1}."
            },
            "dimmensions": {
                "required": "Dimmensions are required.",
                "size": "Dimmensions must be {width}x{height}."
            }
        }
    }
});

describe('parse422', () => {
    const response = {
        "status": 422,
        "data": {
            "errors": {
                "email": ["required"],
                "password": ["min:8"],
                "name": ["max:255"],
                "age": ["between:18,35"]
            }
        }
    };
    const errors = parse422(response);
    it('should return formated error with one parameter', () => {
        expect(errors.password).toBe(aprintf(t('messages.password.min'), [8]));
    });

    it('should return formated error with two parameters', () => {
        expect(errors.age).toBe(aprintf(t('messages.age.between'), [18, 35]));
    });

    // it('should return objects maped to error', () => {
    //     expect(errors.dimmensions).toBe(aprintf(t('messages.dimmensions.size'), { width: 100, height: 200 }));
    // });
});