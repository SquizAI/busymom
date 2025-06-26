/**
 * API endpoint for creating Stripe checkout sessions
 */
import { mcp1_create_customer, mcp1_create_price, mcp1_create_payment_link } from '../lib/mcp-stripe';

export async function createCheckoutSession(req, res) {
  try {
    const { priceId, customerId, successUrl, cancelUrl } = req.body;
    
    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }
    
    // Create or retrieve customer
    let customer;
    if (customerId) {
      // In a real implementation, you would retrieve the customer from Stripe
      // For now, we'll create a new customer each time
      customer = await mcp1_create_customer({
        name: req.body.customerName || 'Test Customer',
        email: req.body.customerEmail || 'customer@example.com'
      });
    } else {
      customer = await mcp1_create_customer({
        name: req.body.customerName || 'Test Customer',
        email: req.body.customerEmail || 'customer@example.com'
      });
    }
    
    // Create a payment link with the specified price
    const paymentLink = await mcp1_create_payment_link({
      price: priceId,
      quantity: 1
    });
    
    return {
      id: `cs_test_${Math.random().toString(36).substring(2, 15)}`,
      url: paymentLink.url,
      customer: customer.id
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error(`Error creating checkout session: ${error.message}`);
  }
}
