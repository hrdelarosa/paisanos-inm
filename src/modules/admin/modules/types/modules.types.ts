import { ModuleType } from '@/src/constants/dominio'
import { CreateModuleFormInput } from '../schema/modules.schema'

export type CreateModuleInput = Omit<CreateModuleFormInput, 'type'> & {
  type: ModuleType
}
