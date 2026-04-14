const { db, products } = require('../db');
const seedProducts = require('../seed-products-data');

try {
    console.log('--- Product Refresh Started ---');
    
    // Clear existing products
    db.prepare('DELETE FROM products').run();
    console.log('✓ Cleared products table.');
    
    // Reset auto-increment
    db.prepare("DELETE FROM sqlite_sequence WHERE name = 'products'").run();
    console.log('✓ Reset product IDs.');

    // Seed new products
    let seeded = 0;
    for (const p of seedProducts) {
        products.create(p);
        seeded++;
        console.log(`✓ Seeded: ${p.name}`);
    }
    
    console.log(`--- Product Refresh Completed: ${seeded} items seeded ---`);
} catch (e) {
    console.error('Error refreshing products:', e.message);
    process.exit(1);
}
