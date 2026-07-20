import type { MedalBranch, MedalBranchId } from './MedalBranches.types'

export const MedalBranches: MedalBranch[] = [
  { id: 'mobilization', ribbon: { primary: '#2f5fa3', secondary: '#e2b93b' } },
  { id: 'marksmanship', ribbon: { primary: '#8a2f3b', secondary: '#2f3f66' } },
  { id: 'logistics', ribbon: { primary: '#2f6f68', secondary: '#cbb578' } },
  { id: 'supply', ribbon: { primary: '#2f4d8a', secondary: '#e2b93b' } },
  { id: 'armory', ribbon: { primary: '#555c63', secondary: '#a33b3b' } },
  { id: 'service', ribbon: { primary: '#5c6449', secondary: '#d4af37' } },
  { id: 'fieldcraft', ribbon: { primary: '#26332b', secondary: '#4c7a53' } },
]

export const MedalBranchById: Record<MedalBranchId, MedalBranch> = Object.fromEntries(
  MedalBranches.map((branch) => [branch.id, branch]),
) as Record<MedalBranchId, MedalBranch>
