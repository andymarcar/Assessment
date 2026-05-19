import { faker } from '@faker-js/faker';
import { UserPayload } from '../api/models/User';
import { ContactPayload } from '../api/models/Contact';

export function generateUser(): UserPayload {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email({ provider: 'testmail.com' }),
    // Garantiza mayúscula, número y carácter especial para cumplir validaciones
    password: 'Test' + faker.internet.password({ length: 8, memorable: false }) + '1!',
  };
}

export function generateContact(): ContactPayload {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    birthdate: faker.date
      .between({ from: new Date('1960-01-01'), to: new Date('2000-12-31') })
      .toISOString()
      .split('T')[0],
    email: faker.internet.email(),
    phone: faker.string.numeric(10),
    street1: faker.location.streetAddress(),
    city: faker.location.city(),
    stateProvince: faker.location.state({ abbreviated: true }),
    postalCode: faker.location.zipCode('#####'),
    country: 'USA',
  };
}
