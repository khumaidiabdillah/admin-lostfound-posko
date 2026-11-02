import { supabaseAdminDB } from '@/lib/supabase'
import InventarisClient from './inventaris-client'
import { PoskoInventory } from '@/lib/types'

export const dynamic = 'force-dynamic'

async function getInventoryItems(): Promise<PoskoInventory[]> {
  try {
    const { data, error } = await supabaseAdminDB
      .from('posko_inventory')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching inventory:', error)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Catch fetching inventory:', err)
    return []
  }
}

export default async function InventarisPage() {
  const items = await getInventoryItems()

  return <InventarisClient initialItems={items} />
}
