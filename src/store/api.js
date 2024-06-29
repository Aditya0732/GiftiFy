import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Event', 'User', 'Contribution'],
  endpoints: (builder) => ({
    createEvent: builder.mutation({
      query: (eventData) => ({
        url: '/events',
        method: 'POST',
        body: eventData,
      }),
      invalidatesTags: ['Event'],
    }),
    getEvents: builder.query({
      query: () => ({
        url: '/events',
        method: 'GET',
        headers: {
          'user-id': localStorage.getItem('userId'),
        },
      }),
      providesTags: ['Event'],
    }),
    searchUser: builder.query({
      query: (term) => `/users/search?term=${encodeURIComponent(term)}`,
      providesTags: ['User'],
    }),
    getEventGuests: builder.query({
      query: (eventId) => `/events/${eventId}/guests`,
      providesTags: ['User', 'Contribution'],
    }),
    addContribution: builder.mutation({
      query: ({ eventId, contributionData }) => ({
        url: `/events/${eventId}/contributions`,
        method: 'POST',
        body: contributionData,
      }),
      invalidatesTags: ['Event', 'Contribution', 'User'],
    }),
    getContributions: builder.query({
      query: (eventId) => `/events/${eventId}/contributions`,
      providesTags: ['Contribution'],
    }),
    getUserTotalContributions: builder.query({
      query: (userId) => `/users/${userId}/contributions`,
      providesTags: ['Contribution', 'Event'],
    }),
    getAllContributions: builder.query({
      query: () => ({
        url: '/events/contributions',
        method: 'GET',
        headers: {
          'user-id': localStorage.getItem('userId'),
        },
      }),
      providesTags: ['Contribution', 'Event'],
    }),
    getUserDashboardData: builder.query({
      query: (userId) => `/users/${userId}/dashboard`,
    }),
    closeEvent: builder.mutation({
      query: (eventId) => ({
        url: `/events/${eventId}/close`,
        method: 'PUT',
      }),
      invalidatesTags: ['Event'],
    }),
  }),
});

export const {
  useCreateEventMutation,
  useGetEventsQuery,
  useSearchUserQuery,
  useGetEventGuestsQuery,
  useAddContributionMutation,
  useGetContributionsQuery,
  useGetUserTotalContributionsQuery,
  useGetAllContributionsQuery,
  useCloseEventMutation,
  useGetUserDashboardDataQuery,
} = api;