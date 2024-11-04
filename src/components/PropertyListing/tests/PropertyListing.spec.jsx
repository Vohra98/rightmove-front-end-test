import React from 'react';
    import { render, screen } from '@testing-library/react';
    import { within } from '@testing-library/dom';
    import PropertyListing from '../PropertyListing';

    const DUMMY_PROPERTY = {
        id: 73864112,
        bedrooms: 3,
        summary: 'Property 1 Situated moments from the River Thames in Old Chelsea...',
        displayAddress: '1 CHEYNE WALK, CHELSEA, SW3',
        propertyType: 'Flat',
        price: 1950000,
        branchName: 'M2 Property, London',
        propertyUrl: '/property-for-sale/property-73864112.html',
        contactUrl: '/property-for-sale/contactBranch.html?propertyId=73864112',
        propertyTitle: '3 bedroom flat for sale',
        mainImage:
            'https://media.rightmove.co.uk/dir/crop/10:9-16:9/38k/37655/53588679/37655_CAM170036_IMG_01_0000_max_476x317.jpg',
    };

    describe('PropertyListing', () => {

        beforeEach(() => {
            global.fetch = jest.fn();
        });

        it('should render five property cards', async () => {
            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(Array(5).fill(DUMMY_PROPERTY)),
                })
            );

            render(<PropertyListing />);
            const propertiesList = screen.getByRole('list');
            const propertyCards = await within(propertiesList).findAllByRole('listitem');
            expect(propertyCards).toHaveLength(5);
        });

        it('should render an error message when fetch fails', async () => {
            fetch.mockImplementationOnce(() => Promise.reject('API is down'));

            render(<PropertyListing />);
            const errorMessage = await screen.findByText(/Error fetching properties/i);
            expect(errorMessage).toBeInTheDocument();
        });

        it('should render no properties message when no properties are available', async () => {
            fetch.mockImplementationOnce(() =>
                Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve([]),
                })
            );

            render(<PropertyListing />);
            const noPropertiesMessage = await screen.findByText(/No properties available/i);
            expect(noPropertiesMessage).toBeInTheDocument();
        });
    });