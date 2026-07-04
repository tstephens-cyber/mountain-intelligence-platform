import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { FinancialSnapshot } from '../services/mountainFinancialParser'

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

export interface EBITDAAmount {
  amount: number
  currency: 'USD'
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

export interface LaborDollars {
  amount: number
  currency: 'USD'
}

export interface ChemicalCost {
  amount: number
  currency: 'USD'
}

export interface VehicleCost {
  amount: number
  currency: 'USD'
}

export interface Rent {
  amount: number
  currency: 'USD'
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
  ebitdaDollars: EBITDAAmount
  laborPercentage: LaborPercentage
  laborDollars: LaborDollars
  chemicalCost: ChemicalCost
  vehicleCost: VehicleCost
  rent: Rent
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

export interface CurrentBusinessContext {
  companyId: string
  companyName: string
  branchId: string
  branchName: string
  revenue: number
  revenueTarget: number
  scheduledRevenue: number
  ebitdaPercent: number
  ebitdaDollars: number
  laborPercent: number
  retentionPercent: number
  productivityScore: number
  forecastRevenue: number
  laborDollars: number
  chemicalCost: number
  vehicleCost: number
  rent: number
}

interface BusinessContextValue {
  company: Company
  selectedBranch: Branch
  currentBusinessContext: CurrentBusinessContext
  hasUploadedBusinessContext: boolean
  applyFinancialSnapshot: (snapshot: FinancialSnapshot) => void
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
  ebitdaDollars: {
    amount: 27162,
    currency: 'USD',
  },
  laborPercentage: {
    percent: 22.5,
  },
  laborDollars: {
    amount: 95521,
    currency: 'USD',
  },
  chemicalCost: {
    amount: 14300,
    currency: 'USD',
  },
  vehicleCost: {
    amount: 6200,
    currency: 'USD',
  },
  rent: {
    amount: 17800,
    currency: 'USD',
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
  const [selectedBranch, setSelectedBranch] = useState<Branch>(sampleBranch)
  const [hasUploadedBusinessContext, setHasUploadedBusinessContext] = useState(false)

  function applyFinancialSnapshot(snapshot: FinancialSnapshot) {
    setSelectedBranch((previous) => ({
      ...previous,
      revenue: {
        ...previous.revenue,
        amount: snapshot.revenue.value ?? previous.revenue.amount,
      },
      revenueTarget: {
        ...previous.revenueTarget,
        amount: snapshot.revenueTarget.value ?? previous.revenueTarget.amount,
      },
      scheduledRevenue: {
        ...previous.scheduledRevenue,
        amount: snapshot.scheduledRevenue.value ?? previous.scheduledRevenue.amount,
      },
      laborDollars: {
        ...previous.laborDollars,
        amount: snapshot.laborDollars.value ?? previous.laborDollars.amount,
      },
      laborPercentage: {
        percent: snapshot.laborPercentage.value ?? previous.laborPercentage.percent,
      },
      chemicalCost: {
        ...previous.chemicalCost,
        amount: snapshot.chemicalCost.value ?? previous.chemicalCost.amount,
      },
      vehicleCost: {
        ...previous.vehicleCost,
        amount: snapshot.vehicleCost.value ?? previous.vehicleCost.amount,
      },
      rent: {
        ...previous.rent,
        amount: snapshot.rent.value ?? previous.rent.amount,
      },
      ebitda: {
        percent:
          snapshot.ebitda.value !== null && previous.revenue.amount > 0
            ? (snapshot.ebitda.value / previous.revenue.amount) * 100
            : snapshot.ebitdaPercentage.value ?? previous.ebitda.percent,
      },
      ebitdaDollars: {
        ...previous.ebitdaDollars,
        amount: snapshot.ebitda.value ?? previous.ebitdaDollars.amount,
      },
      retention: {
        percent: snapshot.retention.value ?? previous.retention.percent,
      },
      productivity: {
        score: snapshot.productivity.value ?? previous.productivity.score,
      },
      forecast: {
        ...previous.forecast,
        projectedRevenue: snapshot.forecast.value ?? previous.forecast.projectedRevenue,
      },
    }))

    setHasUploadedBusinessContext(true)
  }

  const company = useMemo<Company>(() => ({
    ...sampleCompany,
    branches: [selectedBranch],
  }), [selectedBranch])

  const currentBusinessContext = useMemo<CurrentBusinessContext>(() => ({
    companyId: company.id,
    companyName: company.name,
    branchId: selectedBranch.id,
    branchName: selectedBranch.name,
    revenue: selectedBranch.revenue.amount,
    revenueTarget: selectedBranch.revenueTarget.amount,
    scheduledRevenue: selectedBranch.scheduledRevenue.amount,
    ebitdaPercent: selectedBranch.ebitda.percent,
    ebitdaDollars: selectedBranch.ebitdaDollars.amount,
    laborPercent: selectedBranch.laborPercentage.percent,
    retentionPercent: selectedBranch.retention.percent,
    productivityScore: selectedBranch.productivity.score,
    forecastRevenue: selectedBranch.forecast.projectedRevenue,
    laborDollars: selectedBranch.laborDollars.amount,
    chemicalCost: selectedBranch.chemicalCost.amount,
    vehicleCost: selectedBranch.vehicleCost.amount,
    rent: selectedBranch.rent.amount,
  }), [company.id, company.name, selectedBranch])

  const value: BusinessContextValue = {
    company,
    selectedBranch,
    currentBusinessContext,
    hasUploadedBusinessContext,
    applyFinancialSnapshot,
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
