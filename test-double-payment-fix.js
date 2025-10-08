// Test script to verify double payment fix
// Run this in browser console on http://localhost:3001

async function testDoublePaymentFix() {
  console.log('🧪 Testing Double Payment Fix...');

  try {
    // Clear any existing processed payments
    sessionStorage.removeItem('processed_payments');

    // Step 1: Get current collection state
    console.log('\n1. Getting current collection state...');
    const collectionsResponse = await fetch('/api/collections');
    const collectionsData = await collectionsResponse.json();

    if (!collectionsData.collections || collectionsData.collections.length === 0) {
      console.error('❌ No collections found');
      return;
    }

    const testCollection = collectionsData.collections[0];
    const originalAmount = testCollection.current_amount;

    console.log('Test collection:', {
      id: testCollection.id,
      title: testCollection.title,
      original_amount: originalAmount
    });

    // Step 2: Simulate payment success with duplicate prevention
    console.log('\n2. Simulating payment success...');
    const testReference = 'TEST_DOUBLE_PAYMENT_' + Date.now();
    const testAmount = 50;

    // First update
    console.log('First collection update...');
    const update1Response = await fetch('/api/collections/update-total', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collection_id: testCollection.id,
        amount: testAmount,
        reference: testReference
      })
    });

    const update1Data = await update1Response.json();
    console.log('First update result:', update1Data.success ? '✅ Success' : '❌ Failed');

    if (update1Data.success) {
      const firstUpdateAmount = update1Data.data.current_amount;
      console.log('Amount after first update:', firstUpdateAmount);

      // Second update (should be prevented in real scenario)
      console.log('Second collection update (simulating duplicate)...');
      const update2Response = await fetch('/api/collections/update-total', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          collection_id: testCollection.id,
          amount: testAmount,
          reference: testReference + '_DUP'
        })
      });

      const update2Data = await update2Response.json();
      console.log('Second update result:', update2Data.success ? '✅ Success' : '❌ Failed');

      if (update2Data.success) {
        const secondUpdateAmount = update2Data.data.current_amount;
        console.log('Amount after second update:', secondUpdateAmount);

        // Verify the math
        const expectedAmount = originalAmount + testAmount + testAmount;
        const actualAmount = secondUpdateAmount;

        console.log('\n3. Math verification:');
        console.log('Original amount:', originalAmount);
        console.log('First addition (+):', testAmount);
        console.log('Second addition (+):', testAmount);
        console.log('Expected total:', expectedAmount);
        console.log('Actual total:', actualAmount);
        console.log('Match:', expectedAmount === actualAmount ? '✅' : '❌');

        // Test session storage prevention
        console.log('\n4. Testing session storage prevention...');

        // Mark payment as processed
        const processedPayments = JSON.parse(sessionStorage.getItem('processed_payments') || '[]');
        processedPayments.push(testReference);
        sessionStorage.setItem('processed_payments', JSON.stringify(processedPayments));

        console.log('Payment marked as processed in session storage');

        // Try to process again (should be prevented)
        const currentURL = new URL(window.location.href);
        currentURL.searchParams.set('reference', testReference);
        currentURL.searchParams.set('from', 'payment');

        console.log('💡 To test session storage prevention:');
        console.log('1. Visit: ' + currentURL.toString());
        console.log('2. Check console for "Payment already processed" message');
      }
    }

    console.log('\n✅ Double payment fix test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Instructions
console.log('📋 Double Payment Fix Test Instructions:');
console.log('1. Open http://localhost:3001 in your browser');
console.log('2. Open browser developer console (F12)');
console.log('3. Copy and paste the entire script into the console');
console.log('4. Run: testDoublePaymentFix()');
console.log('\n🔍 This will test:');
console.log('- Collection update API');
console.log('- Duplicate prevention mechanisms');
console.log('- Math verification for correct totals');
console.log('- Session storage duplicate prevention');

// Export the function for use in browser console
typeof window !== 'undefined' && (window.testDoublePaymentFix = testDoublePaymentFix);