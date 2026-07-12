import { CreateOperativeFormInput } from '../schema/operatives.schema'
import { OperativeSeason } from '@/src/constants/dominio'

export type CreateOperativeInput = Omit<CreateOperativeFormInput, 'season'> & {
  season: OperativeSeason
}
