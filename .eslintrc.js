module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb'
  ],
  rules: {
    'vue/require-prop-types': 'off',
    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'import/extensions': 0,
    'no-mixed-operators': 0,
    'import/no-unresolved': 0,
    'import/no-dynamic-require': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true
      }
    ],
    'react/react-in-jsx-scope': 0,
    'react/prop-types': 0,
    'no-labels': 0,
    'object-shorthand': [
      'error',
      'always'
    ],
    'eol-last': 0,
    'global-require': 0,
    'no-console': 0,
    'consistent-return': 0,
    'default-case': 0,
    'one-var': 0,
    semi: [
      'error',
      'never',
      {
        beforeStatementContinuationChars: 'always'
      }
    ],
    'semi-style': 0,
    'comma-dangle': [
      'error',
      'never'
    ],
    'prefer-destructuring': 0,
    'guard-for-in': 0,
    'max-len': [
      'error',
      120
    ],
    indent: [
      2,
      2,
      {
        SwitchCase: 1,
        VariableDeclarator: {
          var: 2,
          let: 2,
          const: 3
        }
      }
    ],
    'no-cond-assign': [
      'error',
      'except-parens'
    ],
    'arrow-body-style': [
      2,
      'as-needed'
    ],
    'no-unused-vars': [
      'error'
    ],
    'one-var-declaration-per-line': 0,
    'object-curly-newline': 0,
    'no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true
      }
    ],
    'no-param-reassign': 0,
    'linebreak-style': 0,
    'no-underscore-dangle': 0,
    'no-continue': 0,
    'arrow-parens': 'off',
    'no-return-assign': 0,
    'no-restricted-syntax': [
      'error',
      {
        selector: 'WithStatement',
        message: '"with" is disallowed in strict mode because it makes code impossible to predict and optimize'
      }
    ],
    'no-multi-spaces': [
      'error',
      {
        exceptions: {
          Property: true,
          VariableDeclarator: true,
          ImportDeclaration: true
        }
      }
    ]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
