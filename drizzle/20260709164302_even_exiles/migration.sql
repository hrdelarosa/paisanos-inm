CREATE TABLE `attention_report_items` (
	`id` text PRIMARY KEY,
	`report_id` text NOT NULL,
	`attention_type_id` text NOT NULL,
	`quantity` integer DEFAULT 0 NOT NULL,
	`description` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_attention_report_items_report_id_attention_reports_id_fk` FOREIGN KEY (`report_id`) REFERENCES `attention_reports`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_attention_report_items_attention_type_id_attention_types_id_fk` FOREIGN KEY (`attention_type_id`) REFERENCES `attention_types`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `attention_reports` (
	`id` text PRIMARY KEY,
	`operative_id` text NOT NULL,
	`module_id` text NOT NULL,
	`user_id` text NOT NULL,
	`report_date` integer NOT NULL,
	`status` text DEFAULT 'submitted' NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_attention_reports_operative_id_operatives_id_fk` FOREIGN KEY (`operative_id`) REFERENCES `operatives`(`id`) ON DELETE RESTRICT,
	CONSTRAINT `fk_attention_reports_module_id_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE RESTRICT,
	CONSTRAINT `fk_attention_reports_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `attention_types` (
	`id` text PRIMARY KEY,
	`code` integer NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`sort_order` integer NOT NULL,
	`requires_description` integer DEFAULT false NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `module_assignments` (
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
	CONSTRAINT `fk_module_assignments_operative_id_operatives_id_fk` FOREIGN KEY (`operative_id`) REFERENCES `operatives`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`type` text NOT NULL,
	`location` text NOT NULL,
	`municipality` text NOT NULL,
	`state` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `operatives` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`season` text NOT NULL,
	`year` integer NOT NULL,
	`start_date` integer NOT NULL,
	`end_date` integer NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_profiles` (
	`id` text PRIMARY KEY,
	`user_id` text NOT NULL,
	`module_id` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	CONSTRAINT `fk_user_profiles_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_user_profiles_module_id_modules_id_fk` FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `attention_report_items_report_type_unique` ON `attention_report_items` (`report_id`,`attention_type_id`);--> statement-breakpoint
CREATE INDEX `attention_report_items_report_id_idx` ON `attention_report_items` (`report_id`);--> statement-breakpoint
CREATE INDEX `attention_report_items_attention_type_id_idx` ON `attention_report_items` (`attention_type_id`);--> statement-breakpoint
CREATE INDEX `attention_reports_operative_id_idx` ON `attention_reports` (`operative_id`);--> statement-breakpoint
CREATE INDEX `attention_reports_module_id_idx` ON `attention_reports` (`module_id`);--> statement-breakpoint
CREATE INDEX `attention_reports_user_id_idx` ON `attention_reports` (`user_id`);--> statement-breakpoint
CREATE INDEX `attention_reports_report_date_idx` ON `attention_reports` (`report_date`);--> statement-breakpoint
CREATE INDEX `attention_reports_status_idx` ON `attention_reports` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `attention_types_code_unique` ON `attention_types` (`code`);--> statement-breakpoint
CREATE INDEX `attention_types_sort_order_idx` ON `attention_types` (`sort_order`);--> statement-breakpoint
CREATE INDEX `attention_types_is_active_idx` ON `attention_types` (`is_active`);--> statement-breakpoint
CREATE INDEX `module_assignments_user_id_idx` ON `module_assignments` (`user_id`);--> statement-breakpoint
CREATE INDEX `module_assignments_module_id_idx` ON `module_assignments` (`module_id`);--> statement-breakpoint
CREATE INDEX `module_assignments_operative_id_idx` ON `module_assignments` (`operative_id`);--> statement-breakpoint
CREATE INDEX `module_assignments_is_active_idx` ON `module_assignments` (`is_active`);--> statement-breakpoint
CREATE INDEX `modules_type_idx` ON `modules` (`type`);--> statement-breakpoint
CREATE INDEX `modules_is_active_idx` ON `modules` (`is_active`);--> statement-breakpoint
CREATE INDEX `operatives_season_year_idx` ON `operatives` (`season`,`year`);--> statement-breakpoint
CREATE INDEX `operatives_is_active_idx` ON `operatives` (`is_active`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_profiles_user_id_unique` ON `user_profiles` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_profiles_module_id_idx` ON `user_profiles` (`module_id`);