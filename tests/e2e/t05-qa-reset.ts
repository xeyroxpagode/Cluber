import pg from 'pg'

/** Aisla cada ejecución de navegador: solo datos ficticios en gei_test. */
export async function resetMessagingState() {
  const c = new pg.Client({ connectionString: 'postgresql://postgres:postgres@127.0.0.1:56322/gei_test' })
  await c.connect()
  await c.query('delete from app.messages')
  await c.query('update app.conversation_participants set last_read_at = null')
  await c.query('delete from app.notifications')
  await c.end()
}
