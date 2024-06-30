module.exports = {
	root: true,
	env: {browser: true, es2020: true},
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended'
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react', 'react-refresh'],
	rules: {
		'react-refresh/only-export-components': ['warn', {allowConstantExport: true}],
		'react/self-closing-comp': [
			'error',
			{
				component: true,
				html: true
			}
		],
		'no-mixed-spaces-and-tabs': 0
	}
};