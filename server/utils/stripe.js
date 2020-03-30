const SECRET = process.env.STRIPE_SECRET || "sk_test_PpBfGWKFGkfYXCBiZgaBgs7z00U25ats2U";

const stripe = require("stripe")(SECRET);

async function createCustomer(email = "customer@example.com") {
  const customer = await stripe.customers.create( {
    email,
    description: "test customer!" 
  });
  return customer;
}

async function createCharge(amount = 2000, source = "tok_mastercard") {
  // source will come from the front-end
  // description will change
  // amount will change
  const charge = await stripe.charges.create({
    amount,
    currency: "usd",
    source,
    description: "My First Test Charge (created for API docs)",
    // customer: customer_id -> can't do this now because we need a token from the front-end
  });
  return charge;
}

async function findCustomer(customer_id){
  const customer = await stripe.customers.retrieve(customer_id);
  return customer
}

async function createPlan(amount = 2000) {
  const plan = stripe.plans.create({
    amount,
    currency: "usd",
    interval: "month",
    product: { name: "Monthly membership" }
  });
  return plan;
}

async function createSubscription(customer, plan) {
  const subscription = stripe.subscriptions.create({
    customer,
    items: [{ plan }]
  });
  return subscription;
}

module.exports = {
  createCustomer,
  createPlan,
  createCharge,
  createSubscription,
  findCustomer
};
