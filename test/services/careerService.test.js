const { describe, it } = require('mocha');
const { beforeEach, afterEach } = require('mocha');
const { assert } = require('chai');
const careerService = require('../../services/careerService');

describe('Testing career Service', () => {
  const fakeCareers = [
    {
      name: 'Licenciatura en Sistemas',
      institute: 'Industria',
    },
    {
      name: 'Tecnicatura Universitaria en Informatica',
      institute: 'Ciencias',
    },
    {
      name: 'Profesorado de Ingles',
      institute: 'Desarrollo Humano',
    },
  ];

  beforeEach(async () => {
    await fakeCareers.forEach(async (career) => {
      await careerService.insert(career);
    });
  });

  afterEach(async () => {
    const dbContent = await careerService.getAll();
    await dbContent.forEach(async (career) => {
      await careerService.remove(career.id);
    });
  });

  describe('main methods', () => {
    it('getAll', async () => {
      const result = await careerService.getAll();
      console.log(result);
      console.log(result.length);
      assert.equal(result.length, 3);
    });
    it('get', async () => {
      const dbContent = await careerService.getAll();
      const result = await careerService.get(dbContent[0].id);
      assert.deepEqual(result, dbContent[0]);
    });
    it('insert', async () => {
      const newCareer = {
        name: 'Profesorado de Matematicas',
        institute: 'Ciencias',
      };
      await careerService.insert(newCareer);
      const result = await careerService.getAll();
      assert.equal(result.length, 4);
    });
    it('remove', async () => {
      const dbContent = await careerService.getAll();
      await careerService.remove(dbContent[0].id);
      const result = await careerService.getAll();
      assert.equal(result.length, 2);
    });
  });
});
