# SUIMS (Student Internship Management System)

SUIMS is a comprehensive, full-stack web application designed to streamline the internship lifecycle for universities. It provides a unified platform connecting **Students**, **Companies**, **Lecturers**, and **University Administrators** to facilitate seamless internship applications, management, and evaluations.

---

## 🌟 Key Features

### For Students
*   **CV Builder**: Construct a professional digital CV including personal summary, education, experience, and skills with proficiency levels.
*   **Job Discovery**: Browse and search for internship listings posted by verified companies.
*   **Application Tracking**: Apply to internships with a single click (sending a snapshot of your current CV) and track application statuses.
*   **Weekly Reports**: Submit weekly progress reports during the active internship period.

### For Companies
*   **Company Profile Management**: Maintain a rich organizational profile.
*   **Listing Management**: Create, edit, and manage internship opportunities.
*   **Applicant Tracking System (ATS)**: Review applications, view student CV snapshots, and easily Shortlist, Accept, or Reject candidates.
*   **Intern Evaluation**: Submit final evaluations and feedback for completed internships.

### For Lecturers
*   **Supervision Dashboard**: Monitor assigned interns and their progress.
*   **Report Review**: Review, comment on, and approve student weekly reports.
*   **Student Evaluation**: Provide academic grading based on the student's performance and company feedback.

### For Administrators
*   **System Oversight**: Full control over user management, listing approvals, and system-wide settings.
*   **Analytics**: View system health, placement statistics, and active internship metrics.

---

## 🛠 Tech Stack

*   **Frontend**: React 18, TypeScript, Tailwind CSS, React Router DOM, Vite
*   **Backend**: Laravel 11.x (PHP 8.2+)
*   **Database**: Oracle 19c (integrated via `yajra/laravel-oci8`)
*   **Authentication**: Custom JWT Authentication implementation

---

## 🚀 Getting Started (Local Development)

### Prerequisites
*   **PHP** >= 8.2 (with OCI8 extension enabled for Oracle)
*   **Node.js** >= 18 and npm/yarn
*   **Composer**
*   **Oracle Database** 19c or higher (Oracle Instant Client required)

### 1. Database Setup
The system is built to interface with Oracle sequences and custom tables.
1. Connect to your Oracle database.
2. Execute the provided SQL scripts located in `database/sql/` to generate the required schema (tables, sequences, and relationships).

### 2. Backend Setup (Laravel)
```bash
# 1. Clone the repository and enter the directory
git clone <repository-url>
cd sims-app

# 2. Install PHP dependencies
composer install

# 3. Setup environment variables
cp .env.example .env

# 4. Configure your Oracle DB in the .env file
# DB_CONNECTION=oracle
# DB_HOST=127.0.0.1
# DB_PORT=1521
# DB_DATABASE=XE (or your SID/Service Name)
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# 5. Generate application key
php artisan key:generate

# 6. Start the Laravel development server
php artisan serve
```
*The backend API will run at `http://127.0.0.1:8000`*

### 3. Frontend Setup (React/Vite)
```bash
# 1. Install Node.js dependencies
npm install

# 2. Start the Vite development server
npm run dev
```
*The frontend will run at `http://localhost:5173` (or the port specified by Vite).*

---

## 📖 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
