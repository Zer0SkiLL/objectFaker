import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';

faker.setLocale('de_CH');

export const getFakeData = (type, config) => {
    let result = '';
    switch (type) {
        case 'streetName':
            result = faker.address.street();
            break;

        case 'city':
            result = faker.address.city();
            break;

        case 'zipCode':
            result = faker.address.zipCode(config);
            break;

        case 'financeAccount':
            let conf = '';
            if (config != 'null') {
                conf = config;
            }
            result = faker.finance.account(conf);
            console.log(result);
            break;

        case 'firstname':
            result = faker.name.firstName(config);
            break;

        case 'lastname':
            result = faker.name.lastName(config);
            break;

        case 'bic':
            result = faker.finance.bic(config);
            break;

        case 'iban':
            result = faker.finance.iban(config);
            break;

        default:
            break;
    }

    return result;
};
