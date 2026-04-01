ALTER TABLE `announcements` MODIFY COLUMN `imageUrls` json;--> statement-breakpoint
ALTER TABLE `announcements` MODIFY COLUMN `variables` json;--> statement-breakpoint
ALTER TABLE `submission_logs` MODIFY COLUMN `logs` json;--> statement-breakpoint
ALTER TABLE `templates` MODIFY COLUMN `imageUrls` json;--> statement-breakpoint
ALTER TABLE `templates` MODIFY COLUMN `variables` json;