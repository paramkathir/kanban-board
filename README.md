# Kanban Board

A full-stack Kanban task board built with React, TypeScript, and Supabase. Tasks persist in Supabase and can be moved between workflow stages with drag-and-drop.

## Features

- Four workflow columns: To Do, In Progress, In Review, and Done
- Drag-and-drop task movement with persisted status updates
- Add tasks with a title, description, priority, and due date
- Search tasks by title
- Filter by priority
- Overdue and due-soon indicators
- Live summary counts for total, completed, and overdue tasks
- Anonymous Supabase authentication with persistent sessions
- Delete tasks directly from the board

## Tech Stack

- React 19
- TypeScript
- Vite
- Supabase
- `@hello-pangea/dnd`
- Lucide React

## How It Works

The frontend signs users in anonymously through Supabase, then loads task records from the `tasks` table. Dragging a task to a new column updates its `status` both in the UI and in Supabase. New tasks are inserted with the authenticated user's ID, while search and priority filtering are handled client-side.

Task statuses used by the application:

```text
todo
in_progress
in_review
done
```

Task priorities:

```text
low
normal
high
```

## Run Locally

Install dependencies:

```bash
npm install
```

Create a `.env` file with your Supabase project values:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Then start the development server:

```bash
npm run dev
```

## Project Structure

```text
src/
├── components/
│   ├── AddTaskModal.tsx
│   ├── Board.tsx
│   └── TaskCard.tsx
├── App.tsx
├── main.tsx
└── supabase.ts
```

## Live App

A deployed version is available from the repository homepage.
