import { defineRelations } from 'drizzle-orm'
import * as schema from './schema'

export const relations = defineRelations(schema, (r) => ({
  user: {
    sessions: r.many.session(),
    accounts: r.many.account(),
    profile: r.one.userProfiles({
      from: r.user.id,
      to: r.userProfiles.userId,
    }),
    moduleAssignments: r.many.moduleAssignments(),
    attentionReports: r.many.attentionReports(),
  },
  session: {
    user: r.one.user({
      from: r.session.userId,
      to: r.user.id,
    }),
  },
  account: {
    user: r.one.user({
      from: r.account.userId,
      to: r.user.id,
    }),
  },
  operatives: {
    moduleAssignments: r.many.moduleAssignments(),
    attentionReports: r.many.attentionReports(),
  },
  modules: {
    userProfiles: r.many.userProfiles(),
    moduleAssignments: r.many.moduleAssignments(),
    attentionReports: r.many.attentionReports(),
  },
  userProfiles: {
    user: r.one.user({
      from: r.userProfiles.userId,
      to: r.user.id,
    }),
    module: r.one.modules({
      from: r.userProfiles.moduleId,
      to: r.modules.id,
    }),
  },
  moduleAssignments: {
    user: r.one.user({
      from: r.moduleAssignments.userId,
      to: r.user.id,
    }),
    module: r.one.modules({
      from: r.moduleAssignments.moduleId,
      to: r.modules.id,
    }),
    operative: r.one.operatives({
      from: r.moduleAssignments.operativeId,
      to: r.operatives.id,
    }),
  },
  attentionTypes: {
    reportItems: r.many.attentionReportItems(),
  },
  attentionReports: {
    operative: r.one.operatives({
      from: r.attentionReports.operativeId,
      to: r.operatives.id,
    }),
    module: r.one.modules({
      from: r.attentionReports.moduleId,
      to: r.modules.id,
    }),
    user: r.one.user({
      from: r.attentionReports.userId,
      to: r.user.id,
    }),
    items: r.many.attentionReportItems(),
  },
  attentionReportItems: {
    report: r.one.attentionReports({
      from: r.attentionReportItems.reportId,
      to: r.attentionReports.id,
    }),
    attentionType: r.one.attentionTypes({
      from: r.attentionReportItems.attentionTypeId,
      to: r.attentionTypes.id,
    }),
  },
}))
