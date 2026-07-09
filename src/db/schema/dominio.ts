import { sql } from 'drizzle-orm'
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'
import { user } from './auth'

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
}

export const operatives = sqliteTable(
  'operatives',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    season: text('season', {
      enum: ['holy_week', 'summer', 'winter', 'permanent'],
    }).notNull(),
    year: integer('year').notNull(),
    startDate: integer('start_date', { mode: 'timestamp_ms' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp_ms' }).notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    index('operatives_season_year_idx').on(table.season, table.year),
    index('operatives_is_active_idx').on(table.isActive),
  ],
)

export const modules = sqliteTable(
  'modules',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    type: text('type', {
      enum: [
        'airport',
        'bus_station',
        'customs_stop',
        'road',
        'public_square',
        'other',
      ],
    }).notNull(),
    location: text('location').notNull(),
    municipality: text('municipality').notNull(),
    state: text('state').notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    index('modules_type_idx').on(table.type),
    index('modules_is_active_idx').on(table.isActive),
  ],
)

export const userProfiles = sqliteTable(
  'user_profiles',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    moduleId: text('module_id').references(() => modules.id, {
      onDelete: 'set null',
    }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('user_profiles_user_id_unique').on(table.userId),
    index('user_profiles_module_id_idx').on(table.moduleId),
  ],
)

export const moduleAssignments = sqliteTable(
  'module_assignments',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    moduleId: text('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'restrict' }),
    operativeId: text('operative_id').references(() => operatives.id, {
      onDelete: 'set null',
    }),
    startDate: integer('start_date', { mode: 'timestamp_ms' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp_ms' }),
    isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    index('module_assignments_user_id_idx').on(table.userId),
    index('module_assignments_module_id_idx').on(table.moduleId),
    index('module_assignments_operative_id_idx').on(table.operativeId),
    index('module_assignments_is_active_idx').on(table.isActive),
  ],
)

export const attentionTypes = sqliteTable(
  'attention_types',
  {
    id: text('id').primaryKey(),
    code: integer('code').notNull(),
    name: text('name').notNull(),
    description: text('description'),
    sortOrder: integer('sort_order').notNull(),
    requiresDescription: integer('requires_description', { mode: 'boolean' })
      .default(false)
      .notNull(),
    isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('attention_types_code_unique').on(table.code),
    index('attention_types_sort_order_idx').on(table.sortOrder),
    index('attention_types_is_active_idx').on(table.isActive),
  ],
)

export const attentionReports = sqliteTable(
  'attention_reports',
  {
    id: text('id').primaryKey(),
    operativeId: text('operative_id')
      .notNull()
      .references(() => operatives.id, { onDelete: 'restrict' }),
    moduleId: text('module_id')
      .notNull()
      .references(() => modules.id, { onDelete: 'restrict' }),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    reportDate: integer('report_date', { mode: 'timestamp_ms' }).notNull(),
    status: text('status', { enum: ['draft', 'submitted', 'reviewed'] })
      .default('submitted')
      .notNull(),
    notes: text('notes'),
    ...timestamps,
  },
  (table) => [
    index('attention_reports_operative_id_idx').on(table.operativeId),
    index('attention_reports_module_id_idx').on(table.moduleId),
    index('attention_reports_user_id_idx').on(table.userId),
    index('attention_reports_report_date_idx').on(table.reportDate),
    index('attention_reports_status_idx').on(table.status),
  ],
)

export const attentionReportItems = sqliteTable(
  'attention_report_items',
  {
    id: text('id').primaryKey(),
    reportId: text('report_id')
      .notNull()
      .references(() => attentionReports.id, { onDelete: 'cascade' }),
    attentionTypeId: text('attention_type_id')
      .notNull()
      .references(() => attentionTypes.id, { onDelete: 'restrict' }),
    quantity: integer('quantity').default(0).notNull(),
    description: text('description'),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('attention_report_items_report_type_unique').on(
      table.reportId,
      table.attentionTypeId,
    ),
    index('attention_report_items_report_id_idx').on(table.reportId),
    index('attention_report_items_attention_type_id_idx').on(
      table.attentionTypeId,
    ),
  ],
)
