import React from 'react';
import { act, render } from '@testing-library/react';
import ServiceList from '../../components/ServiceList';
import { mockServiceList } from '../../__mocks__/getMockServiceList';
import mockAxios from 'axios';


describe('ServiceList', () => {
    it('renders correctly', async () => {
        const promise = Promise.resolve();
        let handleServiceUpdate = jest.fn(() => promise);

        mockAxios.get.mockImplementationOnce(() => Promise.resolve({
            data: { results: mockServiceList }
        }));

        const { asFragment } = render(<ServiceList setServices={handleServiceUpdate}/>);
        expect(asFragment()).toMatchSnapshot();
        expect(mockAxios.get).toHaveBeenCalledWith("/services/");
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        
        await act(() => promise);
    });
});
