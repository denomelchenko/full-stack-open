import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, test, vi } from 'vitest'
import countriesService from '../services/countries'
import App from '../App'

vi.mock('../services/countries', () => ({
  default: { getAll: vi.fn() },
}))

const country = (common, capital, area, languages, latlng) => ({
  name: { common },
  capital: [capital],
  area,
  languages,
  flags: { png: 'https://example.com/' + common + '.png', alt: 'Flag of ' + common },
  capitalInfo: { latlng },
})

const countryData = [
  country('Finland', 'Helsinki', 338424, { fin: 'Finnish', swe: 'Swedish' }, [60.17, 24.94]),
  country('France', 'Paris', 551695, { fra: 'French' }, [48.87, 2.33]),
  country('Germany', 'Berlin', 357022, { deu: 'German' }, [52.52, 13.4]),
  country('India', 'New Delhi', 3287263, { hin: 'Hindi', eng: 'English' }, [28.6, 77.2]),
  country('Italy', 'Rome', 301340, { ita: 'Italian' }, [41.9, 12.5]),
  country('Japan', 'Tokyo', 377975, { jpn: 'Japanese' }, [35.68, 139.69]),
  country('Kenya', 'Nairobi', 580367, { swa: 'Swahili', eng: 'English' }, [-1.28, 36.82]),
  country('Latvia', 'Riga', 64589, { lav: 'Latvian' }, [56.95, 24.11]),
  country('Malta', 'Valletta', 316, { mlt: 'Maltese', eng: 'English' }, [35.9, 14.51]),
  country('Panama', 'Panama City', 75417, { spa: 'Spanish' }, [8.98, -79.52]),
  country('Spain', 'Madrid', 505990, { spa: 'Spanish' }, [40.42, -3.7]),
  country('Thailand', 'Bangkok', 513120, { tha: 'Thai' }, [13.75, 100.5]),
]

const renderApp = async () => {
  render(<App />)
  await act(async () => {})
}

beforeEach(() => {
  vi.clearAllMocks()
  countriesService.getAll.mockResolvedValue(countryData)
})

describe('countries', () => {
  test('shows nothing until a query is typed', async () => {
    await renderApp()
    expect(screen.queryByText('Finland')).not.toBeInTheDocument()
  })

  test('asks for a more specific filter when more than ten countries match', async () => {
    const user = userEvent.setup()
    await renderApp()

    await user.type(screen.getByLabelText('find countries'), 'a')

    expect(
      screen.getByText('Too many matches, specify another filter')
    ).toBeInTheDocument()
  })

  test('lists the matches when between two and ten countries match', async () => {
    const user = userEvent.setup()
    await renderApp()

    await user.type(screen.getByLabelText('find countries'), 'pan')

    expect(screen.getByText('Japan')).toBeInTheDocument()
    expect(screen.getByText('Panama')).toBeInTheDocument()
    expect(screen.queryByText('capital Helsinki')).not.toBeInTheDocument()
  })

  test('shows the details of the only matching country', async () => {
    const user = userEvent.setup()
    await renderApp()

    await user.type(screen.getByLabelText('find countries'), 'fin')

    expect(screen.getByRole('heading', { name: 'Finland' })).toBeInTheDocument()
    expect(screen.getByText('capital Helsinki')).toBeInTheDocument()
    expect(screen.getByText('area 338424')).toBeInTheDocument()
    expect(screen.getByText('Finnish')).toBeInTheDocument()
    expect(screen.getByText('Swedish')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Flag of Finland' })).toBeInTheDocument()
  })
})
