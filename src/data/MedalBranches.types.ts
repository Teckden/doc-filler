export type MedalBranchId =
  | 'mobilization'
  | 'marksmanship'
  | 'logistics'
  | 'supply'
  | 'armory'
  | 'service'
  | 'fieldcraft'

export interface MedalBranch {
  id: MedalBranchId
  ribbon: {
    primary: string
    secondary: string
  }
}
