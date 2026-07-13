ALTER TABLE `attention_reports` ADD `reviewed_by` text REFERENCES user(id) ON DELETE SET NULL;--> statement-breakpoint
ALTER TABLE `attention_reports` ADD `reviewed_at` integer;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_attention_report_items` (
	`id` text PRIMARY KEY,
	`report_id` text NOT NULL,
	`attention_type_id` text NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_attention_report_items_report_id_attention_reports_id_fk` FOREIGN KEY (`report_id`) REFERENCES `attention_reports`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_attention_report_items_attention_type_id_attention_types_id_fk` FOREIGN KEY (`attention_type_id`) REFERENCES `attention_types`(`id`) ON DELETE RESTRICT,
	CONSTRAINT "attention_report_items_quantity_check" CHECK("quantity" >= 0)
);
--> statement-breakpoint
INSERT INTO `__new_attention_report_items`(`id`, `report_id`, `attention_type_id`, `quantity`, `description`, `created_at`, `updated_at`) SELECT `id`, `report_id`, `attention_type_id`, `quantity`, `description`, `created_at`, `updated_at` FROM `attention_report_items`;--> statement-breakpoint
DROP TABLE `attention_report_items`;--> statement-breakpoint
ALTER TABLE `__new_attention_report_items` RENAME TO `attention_report_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_module_assignments` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`module_id` text NOT NULL,
	`operative_id` text,
	`start_date` integer NOT NULL,
	`end_date` integer,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_module_assignments_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_module_assignments_module_id_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE RESTRICT,
	CONSTRAINT `fk_module_assignments_operative_id_operatives_id_fk` FOREIGN KEY (`operative_id`) REFERENCES `operatives`(`id`) ON DELETE SET NULL,
	CONSTRAINT "module_assignments_dates_check" CHECK("end_date" is null or "end_date" >= "start_date")
);
--> statement-breakpoint
INSERT INTO `__new_module_assignments`(`id`, `user_id`, `module_id`, `operative_id`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`) SELECT `id`, `user_id`, `module_id`, `operative_id`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at` FROM `module_assignments`;--> statement-breakpoint
DROP TABLE `module_assignments`;--> statement-breakpoint
ALTER TABLE `__new_module_assignments` RENAME TO `module_assignments`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_operatives` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`season` text NOT NULL,
	`year` integer NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT "operatives_dates_check" CHECK("end_date" >= "start_date")
);
--> statement-breakpoint
INSERT INTO `__new_operatives`(`id`, `name`, `season`, `year`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at`) SELECT `id`, `name`, `season`, `year`, `start_date`, `end_date`, `is_active`, `created_at`, `updated_at` FROM `operatives`;--> statement-breakpoint
DROP TABLE `operatives`;--> statement-breakpoint
ALTER TABLE `__new_operatives` RENAME TO `operatives`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `attention_report_items_report_type_unique` ON `attention_report_items` (`report_id`,`attention_type_id`);--> statement-breakpoint
CREATE INDEX `attention_report_items_report_id_idx` ON `attention_report_items` (`report_id`);--> statement-breakpoint
CREATE INDEX `attention_report_items_attention_type_id_idx` ON `attention_report_items` (`attention_type_id`);--> statement-breakpoint
CREATE INDEX `module_assignments_user_id_idx` ON `module_assignments` (`user_id`);--> statement-breakpoint
CREATE INDEX `module_assignments_module_id_idx` ON `module_assignments` (`module_id`);--> statement-breakpoint
CREATE INDEX `module_assignments_operative_id_idx` ON `module_assignments` (`operative_id`);--> statement-breakpoint
CREATE INDEX `module_assignments_is_active_idx` ON `module_assignments` (`is_active`);--> statement-breakpoint
CREATE INDEX `module_assignments_user_dates_idx` ON `module_assignments` (`user_id`,`start_date`,`end_date`);--> statement-breakpoint
CREATE INDEX `module_assignments_scope_idx` ON `module_assignments` (`operative_id`,`module_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `operatives_season_year_idx` ON `operatives` (`season`,`year`);--> statement-breakpoint
CREATE INDEX `operatives_is_active_idx` ON `operatives` (`is_active`);--> statement-breakpoint
CREATE INDEX `attention_reports_reviewed_by_idx` ON `attention_reports` (`reviewed_by`);--> statement-breakpoint
CREATE INDEX `attention_reports_operative_date_idx` ON `attention_reports` (`operative_id`,`report_date`);--> statement-breakpoint
CREATE INDEX `attention_reports_module_date_idx` ON `attention_reports` (`module_id`,`report_date`);--> statement-breakpoint
CREATE INDEX `attention_reports_user_date_idx` ON `attention_reports` (`user_id`,`report_date`);--> statement-breakpoint
CREATE INDEX `attention_reports_scope_date_idx` ON `attention_reports` (`operative_id`,`module_id`,`report_date`);