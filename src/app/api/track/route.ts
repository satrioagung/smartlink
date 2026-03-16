import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { linkId } = await request.json()

  if (!linkId) {
    return NextResponse.json({ error: 'Link ID is required' }, { status: 400 })
  }

  const supabase = await createClient()

  // Increment clicks securely utilizing our rpc function
  const { error } = await supabase.rpc('increment_click', { link_id: linkId })
  if (error) {
    console.error('Error tracking click:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }

  // Get the link data to pass to Telegram
  const { data: linkData } = await supabase
    .from('links')
    .select('title')
    .eq('id', linkId)
    .single()

  // Track to Telegram if configured
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN
  const telegramChatId = process.env.TELEGRAM_CHAT_ID

  if (telegramBotToken && telegramChatId) {
    const message = `🔔 *New Click!*\n\nLink: *${linkData?.title || 'Unknown'}*\nTime: ${new Date().toISOString()}`
    
    try {
        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown',
        }),
        })
    } catch (telegramError) {
        console.error('Failed to send Telegram notification:', telegramError)
    }
  }

  return NextResponse.json({ success: true })
}
