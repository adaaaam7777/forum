/** * @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
jest.mock('./Home.module.css', () => ({}));
jest.mock('../components/TopicComments.module.css', () => ({}));
import Home from './Home';

const queryClient = new QueryClient();

const Wrapper = ({ children }) => (
	<QueryClientProvider client={queryClient}>
		{children}
	</QueryClientProvider>
);

import { useTopics } from '../api/topicApi';
import { useUser } from '../api/adminApi';

jest.mock('../api/topicApi', () => ({
	__esModule: true,
	useTopics: jest.fn(),
	useCreateTopic: jest.fn(),
}));
jest.mock('../api/adminApi', () => ({
	__esModule: true,
	useUser: jest.fn(),
}));

describe('Home page', () => {

	test('renders title', () => {
		(useTopics as jest.Mock).mockReturnValue({
			data: { data: [] },
			error: null,
			isLoading: false,
		});
		(useUser as jest.Mock).mockReturnValue({
			data: { data: { name: 'testUser', id: 0 } },
			error: null,
			isLoading: false,
		});

		render(<Home />, { wrapper: Wrapper });
		const headingElement = screen.getByText(/Forum Posts/i);
		expect(headingElement).toBeInTheDocument();
	});
})
