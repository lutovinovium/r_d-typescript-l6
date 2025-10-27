import {classValidatorsKey, initializedMetadataKey, requiredMetadataKey} from "./task.constants";

export const addValidatorToClassMetadata = (target: Object, validator: Function) => {
    const existingValidators: Function[] = Reflect.getMetadata(classValidatorsKey, target) || [];
    Reflect.defineMetadata(classValidatorsKey, [...existingValidators, validator], target);
}

export const withValidation = <T extends abstract new (...args: any[]) => {}>(target: T) => {
    abstract class c extends target {
        protected constructor(...args: any[]) {
            super(...args);
            this._validate();
            Reflect.defineMetadata(initializedMetadataKey, true, this);
        }
        private _validate(): void {
            const validators: Function[] = Reflect.getMetadata(classValidatorsKey, this) || [];
            const lol = validators.map(validator => validator(this)).filter(v => v instanceof Error);
            if (lol.length > 0) {
                throw new Error(`Validation errors: ${lol.map(e => (e as Error).message).join('; ')}`);
            }
        }
    }
    return c as T;
};

export const validationDecoratorFactory = <T>(validator: (value: T, fieldName: string, context?: any) => Error | void) => {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const required = getRequiredMetadataKey(target, propertyKey);
        const validatorFn = (context: any) => {
            if (required || context[propertyKey] !== undefined) {
                return validator(context[propertyKey], propertyKey.toString(), context)
            }
        };
        addValidatorToClassMetadata(target, validatorFn);

        const originalSet: ((v: T) => void) | undefined = descriptor.set;
        descriptor.set = function (newValue: T) {
            originalSet?.call(this, newValue);
            const initialized = Reflect.getMetadata(initializedMetadataKey, this) === true;
            if (initialized) {
                const validationResult = validatorFn(this);
                if (validationResult instanceof Error) {
                    throw validationResult;
                }
            }

        }
    }
}

export const inferDecoratorFactory = <T>(inferrer: (value: unknown, fieldName: string) => T | Error) => {
    return function (target: Object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const originalSet: ((v: T | undefined) => void) | undefined = descriptor.set;

        descriptor.set = function (newValue: unknown) {
            const required = getRequiredMetadataKey(target, propertyKey);
            if (required || newValue !== undefined) {
                const inferResult = inferrer(newValue, propertyKey.toString());
                if (inferResult instanceof Error) {
                    throw inferResult;
                }
                return originalSet?.call(this, inferResult);
            }
            return originalSet?.call(this, newValue as undefined);
        }
    }
}

export const required = (target: Object, propertyKey: string | symbol) => {
    Reflect.defineMetadata(requiredMetadataKey, true, target, propertyKey);
}

export const getRequiredMetadataKey =(target: Object, propertyKey: string | symbol): boolean  =>{
    return Reflect.getMetadata(requiredMetadataKey, target, propertyKey) === true;
}

export const isString = validationDecoratorFactory<unknown>((value, fieldName) => {
    if (typeof value !== 'string') {
        return new Error(`Field ${fieldName} must be a string`);
    }
})

export const stringMinLength = (min: number) => validationDecoratorFactory<string>((value, fieldName) => {
    if (value.length < min) {
        return new Error(`Field ${fieldName} must be at least ${min} characters long`);
    }
});

export const stringMaxLength = (max: number) => validationDecoratorFactory<string>((value, fieldName) => {
    if (value.length > max) {
        return new Error(`Field ${fieldName} must be at most ${max} characters long`);
    }
});

export const isPartOfEnum = (enumObj: object) => validationDecoratorFactory<unknown>((value, fieldName) => {
    if (typeof value !== 'string' && typeof value !== 'number') {
        return new Error(`Incorrect value type for field ${fieldName}: must be a valid enum value`)
    }
    if (!Object.values(enumObj).includes(value)) {
        return new Error(`Field ${fieldName} must be one of: ${Object.values(enumObj).join(', ')}`);
    }
});

export const inferToDate = inferDecoratorFactory<Date>((value, fieldName) => {
    if (value instanceof Date) {
        return value;
    }
    if (typeof value === 'string' || typeof value === 'number') {
        return new Date(value);
    }
    return new Error(`Field ${fieldName} must be a Date or string/number`);
})

export const isDate = validationDecoratorFactory<unknown>((value, fieldName) => {
    if (!(value instanceof Date)) {
        return new Error(`Field ${fieldName} must be a Date`);
    }
});

export const isCorrectDate = validationDecoratorFactory<Date>((value, fieldName) => {
    if (isNaN(value.getTime())) {
        return new Error(`Field ${fieldName} is an invalid Date`);
    }
});

export const isInPast = validationDecoratorFactory<Date>((value, fieldName) => {
    const now = new Date();

    if (value > now) {
        return new Error(`Field ${fieldName} must be in the past`);
    }
})

export const isAfter = (otherFieldName: string) => validationDecoratorFactory<Date>(function (value, fieldName, context) {
    const otherValue: Date = context[otherFieldName];

    if (!(otherValue instanceof Date)) {
        return new Error(`Field ${otherFieldName} is not a Date`);
    }
    if (value < otherValue) {
        return new Error(`Field ${fieldName} must be after field ${otherFieldName}`);
    }
})
