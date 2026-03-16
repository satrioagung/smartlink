'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getLinks() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching links', error)
    return []
  }
  return data
}

export async function getLinkById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('links')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching link by id', error)
    return null
  }
  return data
}

export async function createLink(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const destination_url = formData.get('destination_url') as string
  const smartlink_url = formData.get('smartlink_url') as string

  const { error } = await supabase.from('links').insert([
    { title, destination_url, smartlink_url },
  ])

  if (error) throw new Error('Failed to create link')
  revalidatePath('/dashboard')
  revalidatePath('/')
}

export async function updateLink(id: string, formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const destination_url = formData.get('destination_url') as string
  const smartlink_url = formData.get('smartlink_url') as string

  const { error } = await supabase
    .from('links')
    .update({ title, destination_url, smartlink_url })
    .eq('id', id)

  if (error) throw new Error('Failed to update link')
  revalidatePath('/dashboard')
  revalidatePath('/')
}

export async function deleteLink(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('links').delete().eq('id', id)

  if (error) throw new Error('Failed to delete link')
  revalidatePath('/dashboard')
  revalidatePath('/')
}
