import type { Config } from 'jest';

const config: Config = {
  // Configurações gerais
  verbose: true, // Exibir detalhes dos testes
  testEnvironment: 'node', // Usar o ambiente Node.js para testes

  // Configuração para trabalhar com TypeScript
  preset: 'ts-jest', // Usar ts-jest para compilar TypeScript
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Transforma arquivos .ts e .tsx
  },
  // Extensões de arquivos que o Jest deve testar
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  
  // Especificar onde o Jest deve procurar os testes
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  
  // Diretórios de módulos a serem ignorados durante os testes
  modulePathIgnorePatterns: ['<rootDir>/build/'], // Ignorar o diretório build

  // Outros parâmetros do Jest, como cobertura de testes (opcional)
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}', // Incluir todos os arquivos .ts/.tsx para cobertura
    '!src/**/*.d.ts', // Ignorar arquivos de declaração
  ],
  coverageDirectory: '<rootDir>/coverage', // Onde armazenar o relatório de cobertura
};

export default config;
