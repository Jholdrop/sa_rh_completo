import { Vaga } from './vaga.model';

describe('Vaga', () => {
  it('should create an instance', () => {
    expect(new Vaga (1, 'Teste', 'test.jpg', 'Descrição do teste', 1000)).toBeTruthy();
  });
});
