import { createServer, IncomingMessage, ServerResponse } from 'http'
import { createClient } from '@supabase/supabase-js'
import { URL } from 'url'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
}

// Helper function to parse request body
async function parseRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch (error) {
        resolve({})
      }
    })
    req.on('error', reject)
  })
}

// Helper function to get client IP
function getClientIP(req: IncomingMessage): string {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim()
  }
  return req.socket.remoteAddress || 'unknown'
}

// Main handler function
async function handleRequest(req: IncomingMessage, res: ServerResponse) {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders)
    res.end('ok')
    return
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL ?? '',
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
    )

    // Get client IP
    const clientIP = getClientIP(req)

    // Check trial availability
    const { data, error } = await supabase
      .rpc('check_trial_availability', { user_ip: clientIP })

    if (error) throw error

    // Send response
    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ available: data }))

  } catch (error) {
    // Send error response
    res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: error.message }))
  }
}

// Create and start the server
const server = createServer(handleRequest)
const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`Server running on port ${port}`)
})