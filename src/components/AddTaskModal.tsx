import { useState } from 'react'
import { supabase } from '../supabase'
import { Task, Status, Priority } from './Board'
import { X } from 'lucide-react'

export default function AddTaskModal({ defaultStatus, onClose, onAdd }: {
  defaultStatus: Status
  onClose: () => void
  onAdd: (task: Task) => void
}) {
  const [title, setTitle]       = useState('')
  const [description, setDesc]  = useState('')
  const [priority, setPriority] = useState<Priority>('normal')
  const [dueDate, setDueDate]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit() {
    if (!title.trim()) { setError('Title is required'); return }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase.from('tasks').insert({
      title: title.trim(),
      description: description.trim() || null,
      status: defaultStatus,
      priority,
      due_date: dueDate || null,
      user_id: user!.id,
    }).select().single()

    if (error) { setError(error.message); setLoading(false); return }
    onAdd(data)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
    }}>
      <div style={{
        background: '#1a1d27', border: '1px solid #2a2d3a', borderRadius: '12px',
        padding: '24px', width: '420px', position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontWeight: 700, fontSize: '15px' }}>New Task</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Title *</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
              style={{ width: '100%', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: '6px', padding: '8px 12px', color: '#e0e0e0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Description</label>
            <textarea
              value={description}
              onChange={e => setDesc(e.target.value)}
              placeholder="Optional description"
              rows={3}
              style={{ width: '100%', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: '6px', padding: '8px 12px', color: '#e0e0e0', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                style={{ width: '100%', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: '6px', padding: '8px 12px', color: '#e0e0e0', fontSize: '13px', outline: 'none' }}
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' }}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                style={{ width: '100%', background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: '6px', padding: '8px 12px', color: '#e0e0e0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {error && <div style={{ color: '#f87171', fontSize: '12px' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button onClick={onClose} style={{ background: 'none', border: '1px solid #2a2d3a', borderRadius: '6px', padding: '8px 16px', color: '#888', fontSize: '13px', cursor: 'pointer' }}>
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ background: '#6366f1', border: 'none', borderRadius: '6px', padding: '8px 16px', color: '#fff', fontSize: '13px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}