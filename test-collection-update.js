// Quick test for collection update API
// Run in browser console on http://localhost:3001

async function testCollectionUpdate() {
  console.log('🧪 Testing Collection Update API...');

  try {
    // First get current collections
    const collectionsResponse = await fetch('/api/collections');
    const collectionsData = await collectionsResponse.json();

    console.log('Available collections:', collectionsData.collections?.length || 0);

    if (collectionsData.collections && collectionsData.collections.length > 0) {
      const testCollection = collectionsData.collections[0];
      console.log('Test collection:', {
        id: testCollection.id,
        title: testCollection.title,
        current_amount: testCollection.current_amount
      });

      // Test collection update
      console.log('Testing collection update...');
      const updateResponse = await fetch('/api/collections/update-total', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection_id: testCollection.id,
          amount: 25
        })
      });

      const updateResult = await updateResponse.json();
      console.log('Update result:', updateResult);

      if (updateResult.success) {
        console.log('✅ Collection update works!');
        console.log('New total:', updateResult.data.current_amount);
      } else {
        console.log('❌ Collection update failed:', updateResult.error);
      }
    } else {
      console.log('❌ No collections found');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Instructions
console.log('📋 Collection Update Test Instructions:');
console.log('1. Open http://localhost:3001 in your browser');
console.log('2. Open browser developer console (F12)');
console.log('3. Copy and paste the entire script into the console');
console.log('4. Run: testCollectionUpdate()');

// Export for browser use
typeof window !== 'undefined' && (window.testCollectionUpdate = testCollectionUpdate);