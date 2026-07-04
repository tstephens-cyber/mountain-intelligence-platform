import { createContext, useContext, type ReactNode } from 'react'

export interface Revenue {
  amount: number
  currency: 'USD'
}

export interface RevenueTarget {
  amount: number
  currency: 'USD'
}

export interface ScheduledRevenue {
  amount: number
  currency: 'USD'
}

export interface EBITDA {
  percent: number
}

export interface LaborPercentage {
  percent: number
}

export interface Retention {
  percent: number
}

export interface Productivity {
  score: number
}

export interface Forecast {
  month: string
  projectedRevenue: number
}

export interface OpenActionItems {
  count: number
}

export interface Branch {
  id: string
  name: string
  revenue: Revenue
  revenueTarget: RevenueTarget
  scheduledRevenue: ScheduledRevenue
  ebitda: EBITDA
  laborPercentage: LaborPercentage
  retention: Retention
  productivity: Productivity
  forecast: Forecast
  openActionItems: OpenActionItems
}

export interface Company {
  id: string
  name: string
  branches: Branch[]
}

interface BusinessContextValue {
  company: Company
  selectedBranch: Branch
}

const sampleBranch: Branch = {
  id: 'south-phoenix',
  name: 'South Phoenix',
  revenue: {
    amount: 207024,
    currency: 'USD',
  },
  revenueTarget: {
    amount: 357744,
    currency: 'USD',
  },
  scheduledRevenue: {
    amount: 183178,
    currency: 'USD',
  },
  ebitda: {
    percent: 7.8,
  },
  laborPercentage: {
    percent: 22.5,
  },
  retention: {
    percent: 83,
  },
  productivity: {
    score: 91,
  },
  forecast: {
    month: 'July',
    projectedRevenue: 349000,
  },
  openActionItems: {
    count: 12,
  },
}

const sampleCompany: Company = {
  id: 'mountain-intelligence',
  name: 'Mountain Intelligence',
  branches: [sampleBranch],
}

const BusinessContext = createContext<BusinessContextValue | undefined>(undefined)

interface BusinessContextProviderProps {
  children: ReactNode
}

export function BusinessContextProvider({ children }: BusinessContextProviderProps) {
  const value: BusinessContextValue = {
    company: sampleCompany,
    selectedBranch: sampleBranch,
  }

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
}

export function useBusinessContext() {
  const context = useContext(BusinessContext)

  if (!context) {
    throw new Error('useBusinessContext must be used within a BusinessContextProvider')
  }

  return context
}
