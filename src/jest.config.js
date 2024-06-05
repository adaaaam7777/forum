module.exports = {
	testEnvironment: 'jsdom',
	transform: {
		'^.+\\.tsx?$': 'babel-jest',
	},
	moduleNameMapper: {
		'\\.(css|less|scss|sass)$': 'identity-obj-proxy',
	},
	setupFilesAfterEnv: ['@testing-library/jest-dom'],
	moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
};