module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'airbnb',
		'airbnb-typescript',
		'airbnb/hooks',
		'plugin:react/recommended',
	],
	parserOptions: {
		project: ['./tsconfig.json'],
	},
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'import/no-absolute-path': 'off',
		'react/react-in-jsx-scope': 'off',
		'max-len': ["error", { "code": 140 }],
		'no-bitwise': 'off'
	},
}
