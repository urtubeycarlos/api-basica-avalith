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
    for (let i = 0; i < fakeCareers.length; i += 1) {
      const career = fakeCareers[i];
      await careerService.insert(career);
    }
  });

  afterEach(async () => {
    const dbContent = await careerService.getAll();
    for (let i = 0; i < dbContent.length; i += 1) {
      const career = dbContent[i];
      await careerService.remove(career.id);
    }
  });

  describe('main methods', () => {
    it('getAll', async () => {
      const result = await careerService.getAll();
      assert.strictEqual(result.length, 3);
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
      assert.strictEqual(result.length, 4);
    });

    it('remove', async () => {
      const dbContent = await careerService.getAll();
      await careerService.remove(dbContent[0].id);
      const result = await careerService.getAll();
      assert.strictEqual(result.length, 2);
    });
  });

  describe('border cases', () => {
    describe('getAll', () => {
      it('empty result', async () => {
        const dbContent = await careerService.getAll();
        for (let i = 0; i < dbContent.length; i += 1) {
          const career = dbContent[i];
          await careerService.remove(career.id);
        }
        const result = await careerService.getAll();
        assert.strictEqual(result.length, 0);
      });
    });

    describe('get', () => {
      it('null id', async () => {
        try {
          await careerService.get(null);
        } catch (error) {
          assert.strictEqual(error.code, 'ER_NOT_ID');
        }
      });

      it('undefined id', async () => {
        try {
          await careerService.get(undefined);
        } catch (error) {
          assert.strictEqual(error.code, 'ER_NOT_ID');
        }
      });

      it('career not exists', async () => {
        const dbContent = await careerService.getAll();
        const nextId = dbContent[2].id + 1;
        const inexistent = await careerService.get(nextId);
        assert.deepEqual(inexistent, {});
      });
    });

    describe('insert', () => {
      it('empty', async () => {
        try {
          await careerService.insert({});
        } catch (error) {
          assert.strictEqual(error.code, 'ER_NOT_PARAM');
        }
      });

      it('null', async () => {
        try {
          await careerService.insert(null);
        } catch (error) {
          assert.isTrue(error instanceof TypeError);
        }
      });

      it('undefined', async () => {
        try {
          await careerService.insert(undefined);
        } catch (error) {
          assert.isTrue(error instanceof TypeError);
        }
      });

      it('null values', async () => {
        try {
          await careerService.insert({ name: null, institute: null });
        } catch (error) {
          assert.strictEqual(error.code, 'ER_NOT_PARAM');
        }
      });

      it('undefined values', async () => {
        try {
          await careerService.insert({ name: undefined, institute: undefined });
        } catch (error) {
          assert.strictEqual(error.code, 'ER_NOT_PARAM');
        }
      });

      it('duplicated entry', async () => {
        try {
          await careerService.insert(fakeCareers[0]);
        } catch (error) {
          assert.strictEqual(error.code, 'ER_DUP_ENTRY');
        }
      });
    });

    describe('remove', () => {
      it('career not exists', async () => {
        const dbContent = await careerService.getAll();
        const nextId = dbContent[2].id + 1;
        const resultOfInexistent = await careerService.remove(nextId);
        assert.strictEqual(resultOfInexistent.affectedRows, 0);
      });

      it('not id', async () => {
        try {
          await careerService.remove(null);
        } catch (error) {
          assert.strictEqual(error.code, 'ER_NOT_ID');
        }
      });
    });
  });
});
