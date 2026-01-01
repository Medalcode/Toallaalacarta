
import { Client, Databases, Permission, Role } from 'node-appwrite';

const client = new Client()
    .setEndpoint('https://tor.cloud.appwrite.io/v1')
    .setProject('6955b868000976fc0778')
    .setKey('standard_23ddb5d1f37c8dd598a8f03a33a64cff819376ad8e0061c964f63079288a574cb275d50467acf154ca7101d6116652f76c4b23a84e45407a916c9b1ef0dbf540785424829807cbca26108b4ac8353abd0c58326c0bdd891ee59c3c5e1b4c76d40632c56096536b8b045227eea09bee8b1494c1baf90e21aeac1eb31bc991c224');

const databases = new Databases(client);

const DB_ID = 'toalla-db';

async function setup() {
    try {
        console.log('Creating database...');
        await databases.create(DB_ID, 'Toalla Data');
    } catch (error) {
        console.log('Database might already exist, skipping...');
    }

    // 1. PRODUCTS
    try {
        console.log('Creating Products collection...');
        await databases.createCollection(DB_ID, 'products', 'Products', [Permission.read(Role.any())]);
        
        console.log('Adding attributes to Products...');
        await databases.createStringAttribute(DB_ID, 'products', 'handle', 255, true);
        await databases.createStringAttribute(DB_ID, 'products', 'title', 255, true);
        await databases.createStringAttribute(DB_ID, 'products', 'description', 5000, false);
        await databases.createFloatAttribute(DB_ID, 'products', 'price', true);
        await databases.createFloatAttribute(DB_ID, 'products', 'compare_at_price', false);
        await databases.createStringAttribute(DB_ID, 'products', 'vendor', 128, false);
        await databases.createStringAttribute(DB_ID, 'products', 'images', 5000, false, undefined, true); // Array
        await databases.createStringAttribute(DB_ID, 'products', 'tags', 64, false, undefined, true); // Array
        await databases.createStringAttribute(DB_ID, 'products', 'variants_json', 10000, false); // Storing variants as JSON for simplicity initially
        // Wait for attributes to be processed
        await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
        console.log('Products collection issue (maybe exists):', e.message);
    }

    // 2. CARTS
    try {
        console.log('Creating Carts collection...');
        await databases.createCollection(DB_ID, 'carts', 'Carts', [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.any())
        ]);
        // Cart Logic: We will use the document ID as the Cart ID
        // Attributes can be added if we need to store status or timestamps manualy, but appwrite has $createdAt
    } catch (e) {
        console.log('Carts collection issue:', e.message);
    }

    // 3. CART LINES
    try {
        console.log('Creating Cart Lines collection...');
        await databases.createCollection(DB_ID, 'cart-lines', 'Cart Lines', [
            Permission.read(Role.any()),
            Permission.create(Role.any()),
            Permission.update(Role.any()),
            Permission.delete(Role.any())
        ]);

        console.log('Adding attributes to Cart Lines...');
        await databases.createStringAttribute(DB_ID, 'cart-lines', 'cart_id', 255, true);
        await databases.createStringAttribute(DB_ID, 'cart-lines', 'merchandise_id', 255, true);
        await databases.createIntegerAttribute(DB_ID, 'cart-lines', 'quantity', true);
        await databases.createStringAttribute(DB_ID, 'cart-lines', 'attributes_json', 5000, false); // For customizations
        await databases.createStringAttribute(DB_ID, 'cart-lines', 'product_title', 255, false);
        await databases.createStringAttribute(DB_ID, 'cart-lines', 'variant_title', 255, false);
        await databases.createFloatAttribute(DB_ID, 'cart-lines', 'price_amount', false);
        await databases.createStringAttribute(DB_ID, 'cart-lines', 'image_url', 1000, false);
    } catch (e) {
        console.log('Cart Lines collection issue:', e.message);
    }

    // 4. ORDERS
    try {
        console.log('Creating Orders collection...');
        await databases.createCollection(DB_ID, 'orders', 'Orders', [
            Permission.create(Role.any()), // Allow public to create orders? Or maybe just backend function? For now public for checkout.
            Permission.read(Role.any()) // Typically users should only read their own, but for dev simplicity
        ]);

        console.log('Adding attributes to Orders...');
        await databases.createStringAttribute(DB_ID, 'orders', 'customer_email', 255, true);
        await databases.createFloatAttribute(DB_ID, 'orders', 'total_price', true);
        await databases.createStringAttribute(DB_ID, 'orders', 'status', 64, true, 'pending');
        await databases.createStringAttribute(DB_ID, 'orders', 'shipping_address_json', 5000, false);
        await databases.createStringAttribute(DB_ID, 'orders', 'line_items_json', 10000, true); // Storing full order snapshot
    } catch (e) {
        console.log('Orders collection issue:', e.message);
    }

    console.log('Setup Complete! Database and Collections are ready.');
}

setup();
