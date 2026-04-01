CREATE TABLE `announcements` (
`id` int AUTO_INCREMENT NOT NULL,
`userId` int NOT NULL,
`templateId` int,
`title` varchar(255) NOT NULL,
`description` text NOT NULL,
`price` varchar(64),
`category` varchar(128),
`contactName` varchar(255),
`contactPhone` varchar(32),
`contactEmail` varchar(320),
`location` varchar(255),
`imageUrls` json,
`variables` json,
`createdAt` timestamp NOT NULL DEFAULT (now()),
`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT `announcements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `api_config` (
`id` int AUTO_INCREMENT NOT NULL,
`key` varchar(128) NOT NULL,
`value` text,
`description` text,
`isSecret` boolean NOT NULL DEFAULT true,
`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT `api_config_id` PRIMARY KEY(`id`),
CONSTRAINT `api_config_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `submission_logs` (
`id` int AUTO_INCREMENT NOT NULL,
`submissionId` int NOT NULL,
`site` varchar(64) NOT NULL,
`status` enum('pending','running','success','failed') NOT NULL DEFAULT 'pending',
`externalUrl` text,
`errorMessage` text,
`logs` json,
`startedAt` timestamp,
`completedAt` timestamp,
`createdAt` timestamp NOT NULL DEFAULT (now()),
CONSTRAINT `submission_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `submissions` (
`id` int AUTO_INCREMENT NOT NULL,
`userId` int NOT NULL,
`announcementId` int NOT NULL,
`targetSites` json NOT NULL,
`overallStatus` enum('pending','running','completed','failed') NOT NULL DEFAULT 'pending',
`startedAt` timestamp,
`completedAt` timestamp,
`createdAt` timestamp NOT NULL DEFAULT (now()),
CONSTRAINT `submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `templates` (
`id` int AUTO_INCREMENT NOT NULL,
`userId` int NOT NULL,
`name` varchar(255) NOT NULL,
`title` text,
`description` text,
`price` varchar(64),
`category` varchar(128),
`contactName` varchar(255),
`contactPhone` varchar(32),
`contactEmail` varchar(320),
`location` varchar(255),
`imageUrls` json,
`variables` json,
`createdAt` timestamp NOT NULL DEFAULT (now()),
`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
CONSTRAINT `templates_id` PRIMARY KEY(`id`)
);
