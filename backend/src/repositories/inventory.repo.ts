import { getDatabase } from '../config/database.js';
import { InventoryItem } from '../types/index.js';

const rowToInventory = (row: any): InventoryItem => ({
  id: row.id,
  medicineName: row.medicine_name,
  category: row.category,
  supplier: row.supplier,
  batchNumber: row.batch_number,
  purchaseDate: row.purchase_date,
  expiryDate: row.expiry_date,
  quantityAvailable: row.quantity_available,
  minimumStockLevel: row.minimum_stock_level,
  unitPrice: row.unit_price,
});

export const inventoryRepo = {
  findAll(): InventoryItem[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM inventory ORDER BY medicine_name ASC').all().map(rowToInventory);
  },

  findById(id: string): InventoryItem | undefined {
    const db = getDatabase();
    const row = db.prepare('SELECT * FROM inventory WHERE id = ?').get(id) as any;
    return row ? rowToInventory(row) : undefined;
  },

  create(item: InventoryItem): void {
    const db = getDatabase();
    db.prepare(`
      INSERT INTO inventory (id, medicine_name, category, supplier, batch_number, purchase_date, expiry_date, quantity_available, minimum_stock_level, unit_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(item.id, item.medicineName, item.category, item.supplier, item.batchNumber,
      item.purchaseDate, item.expiryDate, item.quantityAvailable, item.minimumStockLevel, item.unitPrice);
  },

  update(id: string, data: Partial<InventoryItem>): void {
    const db = getDatabase();
    const updates: string[] = [];
    const params: any[] = [];
    if (data.medicineName !== undefined) { updates.push('medicine_name = ?'); params.push(data.medicineName); }
    if (data.category !== undefined) { updates.push('category = ?'); params.push(data.category); }
    if (data.supplier !== undefined) { updates.push('supplier = ?'); params.push(data.supplier); }
    if (data.batchNumber !== undefined) { updates.push('batch_number = ?'); params.push(data.batchNumber); }
    if (data.expiryDate !== undefined) { updates.push('expiry_date = ?'); params.push(data.expiryDate); }
    if (data.quantityAvailable !== undefined) { updates.push('quantity_available = ?'); params.push(data.quantityAvailable); }
    if (data.minimumStockLevel !== undefined) { updates.push('minimum_stock_level = ?'); params.push(data.minimumStockLevel); }
    if (data.unitPrice !== undefined) { updates.push('unit_price = ?'); params.push(data.unitPrice); }
    if (updates.length === 0) return;
    params.push(id);
    db.prepare(`UPDATE inventory SET ${updates.join(', ')} WHERE id = ?`).run(...params);
  },

  deductStock(medicineId: string, quantity: number): void {
    const db = getDatabase();
    db.prepare('UPDATE inventory SET quantity_available = quantity_available - ? WHERE id = ?').run(quantity, medicineId);
  },

  getLowStock(): InventoryItem[] {
    const db = getDatabase();
    return db.prepare('SELECT * FROM inventory WHERE quantity_available <= minimum_stock_level').all().map(rowToInventory);
  },

  delete(id: string): void {
    const db = getDatabase();
    db.prepare('DELETE FROM inventory WHERE id = ?').run(id);
  },
};
