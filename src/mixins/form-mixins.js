import AsyncValidator from "async-validator";

export const formMixin = {
    data: function () {
        return {
            validateError: {}
        };
    },
    computed: {},
    methods: {
        resetError () {
            this.validateError = {};
        },

        getError (key) {
            const fields = this.validateError;
            let msg = "";
            if (fields && fields[key]) {
                msg = fields[key][0].message;
            }
            return msg;
        },

        formValidate (data, rules) {
            return new Promise((resolve, reject) => {
                const validator = new AsyncValidator(rules);
                validator.validate(data, (error, fields) => {
                    if (error) {
                        this.validateError = fields;
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            });
        }
    }
};
