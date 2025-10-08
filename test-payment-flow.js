// Test script to verify payment flow and contribution updates
// Run this in browser console on http://localhost:3001

async function testPaymentFlow() {
  console.log('🧪 Testing Payment Flow...');

  try {
    // Step 1: Test collection fetch
    console.log('\n1. Testing collections API...');
    const collectionsResponse = await fetch('/api/collections');
    const collectionsData = await collectionsResponse.json();
    console.log('Collections:', collectionsData.collections?.length || 0);

    if (collectionsData.collections && collectionsData.collections.length > 0) {
      const testCollection = collectionsData.collections[0];
      console.log('Test collection:', {
        id: testCollection.id,
        title: testCollection.title,
        current_amount: testCollection.current_amount
      });

      // Step 2: Test payment initialization
      console.log('\n2. Testing payment initialization...');
      const paymentResponse = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          amount: 100,
          currency: 'GHS',
          metadata: {
            platform: 'AgaPay',
            purpose: `Contribution to ${testCollection.title}`,
            collection_id: testCollection.id.toString()
          }
        })
      });

      const paymentData = await paymentResponse.json();
      console.log('Payment init response:', paymentData.success ? '✅ Success' : '❌ Failed');

      if (paymentData.success) {
        console.log('Payment details:', {
          reference: paymentData.data.reference,
          access_code: paymentData.data.access_code ? '✅' : '❌'
        });

        // Step 3: Test collection update directly (simulating payment success)
        console.log('\n3. Testing collection update...');
        const updateResponse = await fetch('/api/collections/update-total', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection_id: testCollection.id,
            amount: 100
          })
        });

        const updateData = await updateResponse.json();
        console.log('Collection update:', updateData.success ? '✅ Success' : '❌ Failed');

        if (updateData.success) {
          console.log('Updated collection:', {
            id: updateData.data.id,
            title: updateData.data.title,
            old_amount: testCollection.current_amount,
            new_amount: updateData.data.current_amount
          });
        }
      }
    }

    console.log('\n✅ Payment flow test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Instructions
console.log('📋 Payment Flow Test Instructions:');
console.log('1. Open http://localhost:3001 in your browser');
console.log('2. Open browser developer console (F12)');
console.log('3. Copy and paste the entire script into the console');
console.log('4. Run: testPaymentFlow()');
console.log('\n🔍 This will test:');
console.log('- Collections API endpoint');
console.log('- Payment initialization with collection metadata');
console.log('- Collection total update mechanism');
console.log('\n💡 For full end-to-end testing, use the UI to make actual test payments');

// Export the function for use in browser console
typeof window !== 'undefined' && (window.testPaymentFlow = testPaymentFlow);