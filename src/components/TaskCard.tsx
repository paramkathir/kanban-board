import { Trash2, AlertCircle, Clock } from 'lucide-react'
import { Task } from './Board'

const PRIORITY_COLORS: Record<string, string> = {
  low:    '#6b7280',
  normal: '#3b82f6',
  high:   '#ef4444',
}

const PRIORITY_BG: Record<string, string> = {
  low:    '#1f2937',
  normal: '#1e3a5f',
  high:   '#450a0a',
}

function isOverdue(due_date?: string, status?: string) {
  if (!due_date || status === 'done') return false
  return new Date(due_date) < new Date()
}

function isDueSoon(due_date?: string, status?: string) {
  if (!due_date || status === 'done') return false
  const diff = new Date(due_date).getTime() - new Date().getTime()
  return diff > 0 && diff < 1000 * 60 * 60 * 24 * 2
}

export default function TaskCard({ task, onDelete, isDragging }: {
  task: Task
  onDelete: (id: string) => void
  isDragging: boolean
}) {
  const overdue  = isOverdue(task.due_date, task.status)
  const dueSoon  = isDueSoon(task.due_date, task.status)

  return (
    <div style={{
      background: isDragging ? '#252836' : '#0f1117',
      border: `1px solid ${isDragging ? '#3b82f6' : '#2a2d3a'}`,
      borderRadius: '8px',
      padding: '12px',
      boxShadow: isDragging ? '0 8px 24px rgba(0,0,0,0.4)' : 'none',
      transition: 'box-shadow 0.2s',
    }}>

      {/* Top row — priority + delete */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{
          fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '20px',
          color: PRIORITY_COLORS[task.priority],
          background: PRIORITY_BG[task.priority],
          textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          {task.priority}
        </span>
        <button
          onClick={() => onDelete(task.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3a3d4a', padding: '2px', display: 'flex', alignItems: 'center' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color = '#3a3d4a')}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Title */}
      <div style={{ fontSize: '13px', fontWeight: 500, color: '#e0e0e0', marginBottom: task.description ? '6px' : '0', lineHeight: '1.4' }}>
        {task.title}
      </div>

      {/* Description */}
      {task.description && (
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '8px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </div>
      )}

      {/* Due date */}
      {task.due_date && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '4px', marginTop: '8px',
          fontSize: '11px',
          color: overdue ? '#f87171' : dueSoon ? '#f59e0b' : '#6b7280',
          background: overdue ? '#450a0a' : dueSoon ? '#422006' : '#1a1d27',
          padding: '3px 8px', borderRadius: '4px', width: 'fit-content'
        }}>
          {overdue ? <AlertCircle size={11} /> : <Clock size={11} />}
          {overdue ? 'Overdue · ' : dueSoon ? 'Due soon · ' : ''}
          {new Date(task.due_date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
        </div>
      )}
    </div>
  )
}