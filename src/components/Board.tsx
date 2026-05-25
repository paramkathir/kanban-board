import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { supabase } from '../supabase'
import TaskCard from './TaskCard.tsx'
import AddTaskModal from './AddTaskModal.tsx'
import { Plus, Search } from 'lucide-react'

export type Priority = 'low' | 'normal' | 'high'
export type Status = 'todo' | 'in_progress' | 'in_review' | 'done'

export interface Task {
  id: string
  title: string
  description?: string
  status: Status
  priority: Priority
  due_date?: string
  created_at: string
}

const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: 'todo',        label: 'To Do',      color: '#6366f1' },
  { id: 'in_progress', label: 'In Progress', color: '#f59e0b' },
  { id: 'in_review',   label: 'In Review',  color: '#8b5cf6' },
  { id: 'done',        label: 'Done',       color: '#10b981' },
]

export default function Board() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all')
  const [showModal, setShowModal] = useState(false)
  const [modalStatus, setModalStatus] = useState<Status>('todo')

  useEffect(() => {
    fetchTasks()
  }, [])

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error && data) setTasks(data)
    setLoading(false)
  }

  async function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const taskId = result.draggableId
    const newStatus = result.destination.droppableId as Status
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
    await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId)
  }

  async function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
    await supabase.from('tasks').delete().eq('id', id)
  }

  function openModal(status: Status) {
    setModalStatus(status)
    setShowModal(true)
  }

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase())
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
    return matchSearch && matchPriority
  })

  const totalTasks     = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'done').length
  const overdueTasks   = tasks.filter(t => {
    if (!t.due_date) return false
    return new Date(t.due_date) < new Date() && t.status !== 'done'
  }).length

  return (
    <div style={{ minHeight: '100vh', background: '#0f1117', color: '#e0e0e0', fontFamily: 'Segoe UI, sans-serif' }}>

      {/* Header */}
      <div style={{ background: '#1a1d27', borderBottom: '1px solid #2a2d3a', padding: '0 24px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#fff' }}>Kanban Board</span>
          <div style={{ display: 'flex', gap: '16px', marginLeft: '24px' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Total: <b style={{ color: '#fff' }}>{totalTasks}</b></span>
            <span style={{ fontSize: '12px', color: '#888' }}>Done: <b style={{ color: '#10b981' }}>{completedTasks}</b></span>
            {overdueTasks > 0 && <span style={{ fontSize: '12px', color: '#f87171' }}>Overdue: <b>{overdueTasks}</b></span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks..."
              style={{ background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: '6px', padding: '6px 10px 6px 30px', color: '#ccc', fontSize: '13px', width: '200px', outline: 'none' }}
            />
          </div>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value as Priority | 'all')}
            style={{ background: '#0f1117', border: '1px solid #2a2d3a', borderRadius: '6px', padding: '6px 10px', color: '#ccc', fontSize: '13px', outline: 'none' }}
          >
            <option value="all">All priorities</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* Board */}
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 56px)', color: '#555' }}>Loading tasks...</div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', padding: '20px 24px', height: 'calc(100vh - 56px)', boxSizing: 'border-box' }}>
            {COLUMNS.map(col => {
              const colTasks = filtered.filter(t => t.status === col.id)
              return (
                <div key={col.id} style={{ background: '#1a1d27', borderRadius: '10px', border: '1px solid #2a2d3a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                  {/* Column header */}
                  <div style={{ padding: '14px 16px', borderBottom: '1px solid #2a2d3a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }} />
                      <span style={{ fontWeight: 600, fontSize: '13px' }}>{col.label}</span>
                      <span style={{ background: '#2a2d3a', color: '#888', fontSize: '11px', padding: '1px 7px', borderRadius: '20px' }}>{colTasks.length}</span>
                    </div>
                    <button onClick={() => openModal(col.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', display: 'flex', alignItems: 'center' }}>
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Droppable */}
                  <Droppable droppableId={col.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          flex: 1, overflowY: 'auto', padding: '10px',
                          background: snapshot.isDraggingOver ? '#1e2230' : 'transparent',
                          transition: 'background 0.2s'
                        }}
                      >
                        {colTasks.length === 0 && (
                          <div style={{ textAlign: 'center', color: '#3a3d4a', fontSize: '12px', marginTop: '20px' }}>
                            No tasks yet
                          </div>
                        )}
                        {colTasks.map((task, index) => (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{ marginBottom: '8px', ...provided.draggableProps.style }}
                              >
                                <TaskCard task={task} onDelete={deleteTask} isDragging={snapshot.isDragging} />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              )
            })}
          </div>
        </DragDropContext>
      )}

      {showModal && (
        <AddTaskModal
          defaultStatus={modalStatus}
          onClose={() => setShowModal(false)}
          onAdd={(task) => {
            setTasks(prev => [...prev, task])
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}