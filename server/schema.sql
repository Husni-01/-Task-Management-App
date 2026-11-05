-- =======================================================
-- OCTOM Task & Project Management Database Schema (MySQL)
-- =======================================================

CREATE DATABASE IF NOT EXISTS `task_management_db` 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `task_management_db`;

-- Drop existing tables if re-initializing
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `collaborators`;
DROP TABLE IF EXISTS `timeline_items`;
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `schedules`;
DROP TABLE IF EXISTS `tasks`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Users Table
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `avatar` VARCHAR(255) DEFAULT '',
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `role` VARCHAR(100) NOT NULL DEFAULT 'Contributor',
  `status` ENUM('Online', 'Offline', 'Busy', 'Away') DEFAULT 'Online',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Tasks / Projects Table
CREATE TABLE `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `status` ENUM('New', 'In Progress', 'Completed', 'Done') NOT NULL DEFAULT 'New',
  `progress_percentage` INT NOT NULL DEFAULT 0,
  `start_time` VARCHAR(50) DEFAULT '9:00 am',
  `due_date` DATE NULL,
  `type` VARCHAR(100) NOT NULL DEFAULT 'General',
  `link_url` VARCHAR(255) DEFAULT 'www.dribbble.com',
  `comments_count` INT NOT NULL DEFAULT 0,
  `has_reminder` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Schedule / Meetings Table
CREATE TABLE `schedules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` VARCHAR(255) DEFAULT '30 mins call with client',
  `time` VARCHAR(50) NOT NULL DEFAULT '28:20',
  `duration` VARCHAR(50) NOT NULL DEFAULT '30 mins',
  `call_link` VARCHAR(255) NOT NULL DEFAULT 'https://meet.google.com/octom-call',
  `attendees` TEXT NULL COMMENT 'JSON array or comma-separated attendee avatars/names',
  `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Messages Table
CREATE TABLE `messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_id` INT NULL,
  `sender_name` VARCHAR(100) NOT NULL,
  `sender_avatar` VARCHAR(255) DEFAULT '',
  `message_text` TEXT NOT NULL,
  `timestamp` VARCHAR(50) DEFAULT 'Just now',
  `is_read` BOOLEAN NOT NULL DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_messages_sender`
    FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`)
    ON DELETE SET NULL
) ENGINE=InnoDB;

-- 5. Collaborators Relational Mapping Table
CREATE TABLE `collaborators` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `task_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `role` VARCHAR(100) DEFAULT 'Collaborator',
  `assigned_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_collab_task`
    FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_collab_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Timeline Milestones Table (for Gantt-style Timeline View)
CREATE TABLE `timeline_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `phase_name` VARCHAR(100) NOT NULL,
  `sub_phase` VARCHAR(100) NULL,
  `title` VARCHAR(150) NOT NULL,
  `start_day` INT NOT NULL,
  `end_day` INT NOT NULL,
  `progress_percentage` INT NOT NULL DEFAULT 0,
  `color_theme` VARCHAR(50) NOT NULL DEFAULT 'purple',
  `assignee_avatars` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =======================================================
-- Dummy Seed Data Matching Reference Design
-- =======================================================

INSERT INTO `users` (`id`, `name`, `avatar`, `email`, `role`, `status`) VALUES
(1, 'Cris Morish', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', 'cris@octom.io', 'Product Designer', 'Online'),
(2, 'Charmie', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', 'charmie@octom.io', 'UI/UX Lead', 'Online'),
(3, 'Jason Mandala', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', 'jason@octom.io', 'Frontend Dev', 'Away'),
(4, 'Charlie Chu', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', 'charlie@octom.io', 'Full-Stack Dev', 'Online'),
(5, 'Angeline', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', 'angeline@octom.io', 'Project Lead', 'Online');

INSERT INTO `tasks` (`id`, `title`, `description`, `status`, `progress_percentage`, `start_time`, `due_date`, `type`, `link_url`, `comments_count`, `has_reminder`) VALUES
(1, 'Search Inspiration for project', 'Review top design trends on dribbble for OCTOM dashboard UI', 'In Progress', 24, '9.00 am', '2026-11-20', 'Design Phase', 'www.dribbble.com', 8, 1),
(2, 'Search Inspiration for project', 'Gather moodboards and user flows from pinterest and behance', 'In Progress', 60, '3.00 pm', '2026-11-22', 'UX Research', 'www.pinterest.org', 12, 0),
(3, 'Build Wireframe & Component Library', 'Construct responsive atoms and molecules in Figma', 'Completed', 85, '11.00 am', '2026-11-24', 'Design Phase', 'www.figma.com', 5, 1),
(4, 'Setup Express REST API & Database Schema', 'Implement MySQL relational mapping and dashboard analytics endpoints', 'Done', 100, '2.00 pm', '2026-11-15', 'Development', 'github.com/octom', 14, 0);

INSERT INTO `schedules` (`id`, `title`, `subtitle`, `time`, `duration`, `call_link`, `attendees`, `is_active`) VALUES
(1, 'Project Discovery Call', '30 mins call with client', '28:20', '30 mins', 'https://meet.google.com/octom-call', 
 '["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100"]', 1);

INSERT INTO `messages` (`id`, `sender_id`, `sender_name`, `sender_avatar`, `message_text`, `timestamp`, `is_read`) VALUES
(1, 1, 'Cris Morish', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', 'Hi Angeline! How are You?', '10:42 am', 0),
(2, 2, 'Charmie', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', 'Do you need that design?', '11:15 am', 0),
(3, 3, 'Jason Mandala', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', 'What is the price of hourly...', '12:05 pm', 1),
(4, 4, 'Charlie Chu', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', 'Awesome design!', '01:30 pm', 1);

INSERT INTO `collaborators` (`task_id`, `user_id`, `role`) VALUES
(1, 1, 'Designer'),
(1, 5, 'Owner'),
(2, 2, 'Researcher'),
(2, 3, 'Developer'),
(3, 1, 'Designer'),
(4, 4, 'Backend Dev');

INSERT INTO `timeline_items` (`id`, `phase_name`, `sub_phase`, `title`, `start_day`, `end_day`, `progress_percentage`, `color_theme`, `assignee_avatars`) VALUES
(1, 'UX Research', NULL, 'Profile', 7, 10, 40, 'purple', '["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"]'),
(2, 'UX Research', NULL, 'Menu', 12, 15, 64, 'green', '["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100"]'),
(3, 'UX Research', NULL, 'Settings', 17, 20, 39, 'blue', '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"]'),
(4, 'Information Architecture', NULL, 'Login', 5, 8, 49, 'green', '["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"]'),
(5, 'Information Architecture', NULL, 'Overview', 14, 17, 54, 'orange', '["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"]'),
(6, 'Design Phase', 'Build Wireframe', 'Complete Task', 9, 14, 72, 'indigo', '["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100"]'),
(7, 'Design Phase', 'User Interface D...', 'Testimonials', 11, 14, 85, 'purple', '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"]'),
(8, 'Design Phase', 'User Interface D...', 'Client Review', 11, 13, 62, 'orange', '["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"]'),
(9, 'Design Phase', 'User Interface D...', 'Homepage', 16, 19, 42, 'green', '["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"]'),
(10, 'Phototyping', NULL, 'GUI Portfolio', 12, 16, 82, 'cyan', '["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"]'),
(11, 'Development', 'Back-End Dev.', 'Profile', 7, 10, 45, 'purple', '["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100"]'),
(12, 'Development', 'Front-End Dev.', 'Release', 15, 18, 54, 'orange', '["https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"]');

