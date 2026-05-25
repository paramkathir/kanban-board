import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Board from './components/Board.tsx'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('existing session:', session)
      if (!session) {
        const { data, error } = await supabase.auth.signInAnonymously()
        console.log('anon sign in:', data, error)
      }
      setReady(true)
    }
    init()
  }, [])

  if (!ready) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', background: '#0f1117', color: '#888', fontSize: '14px'
    }}>
      Loading...
    </div>
  )

  return <Board />
}