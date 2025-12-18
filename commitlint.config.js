module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // Nueva funcionalidad
        'fix', // Corrección de bug
        'docs', // Cambios en documentación
        'style', // Formateo, punto y comas, etc.
        'refactor', // Refactorización de código
        'perf', // Mejoras de performance
        'test', // Añadir o corregir tests
        'chore', // Actualizar dependencias, configs, etc.
        'revert', // Revertir commit
        'ci', // Cambios en CI/CD
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
    'body-leading-blank': [1, 'always'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
  },
};
