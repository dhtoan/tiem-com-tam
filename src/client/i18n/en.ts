import type { TranslationKey } from './vi';

export const EN_TRANSLATIONS: Record<TranslationKey, string> = {
  // Common UI
  'ui.game_title': 'Saigon Broken Rice Stall',
  'ui.day_counter': 'Day {day}',
  'ui.time': 'Time: {time}',
  'ui.cash': 'Cash: {amount} VND',
  'ui.debt': 'Outstanding Debt: {amount} VND',
  'ui.reputation': 'Reputation: {reputation}★',
  'ui.trust': 'Family Trust: {trust}%',
  'ui.start_day': 'Start New Day',
  'ui.end_day': 'Close Shop',
  'ui.pause': 'Pause',
  'ui.resume': 'Resume',
  'ui.confirm': 'Confirm',
  'ui.cancel': 'Cancel',
  'ui.close': 'Close',
  'ui.save': 'Save Game',
  'ui.loading': 'Loading...',
  'ui.offline_badge': 'Offline Mode',
  'ui.online_badge': 'Server Connected (Online)',

  // Stations
  'station.grill': 'Charcoal Grill Station',
  'station.steamer': 'Broken Rice Steamer',
  'station.prep': 'Plating & Prep Counter',
  'station.display': 'Food Display Glass Case',
  'station.register': 'Cash Register',

  // Actions & Orders
  'action.cook': 'Place on Grill',
  'action.flip': 'Flip Pork Chop',
  'action.plate': 'Assemble Plate',
  'action.serve': 'Serve Customer',
  'action.discard': 'Discard to Trash',
  'action.hire_guard': 'Hire Security Guard',
  'action.order_supplies': 'Restock Ingredients',
  'action.pay_debt': 'Pay Debt Installment',

  // Customer & Mood
  'customer.waiting': 'Waiting for order...',
  'customer.impatient': 'Customer is getting impatient!',
  'customer.delighted': 'Delicious meal! Highly recommended!',
  'customer.angry': 'Took far too long! I am leaving!',

  // Security & Theft
  'security.incident_title': 'Security Alert!',
  'security.theft_prevented': 'Guard intercepted the pickpocket just in time!',
  'security.theft_occurred': 'A thief swiped cash from the counter register!',
  'security.bribe_warning': 'Suspicious individual spotted lingering nearby.',

  // Books & Compliance
  'books.title': 'Accounting Books & Local Compliance',
  'books.compliant': 'Books are fully compliant and balanced.',
  'books.audit_passed': 'Inspectors approved your financial records!',
  'books.audit_penalized': 'Audit found discrepancy in records; penalty assessed.',

  // Market & Suppliers
  'market.title': 'Binh Dien Wholesale Market',
  'market.wholesale': 'Bulk Wholesale Depot (Cheapest, high volume)',
  'market.regular': 'Local Market (Balanced everyday prices)',
  'market.premium': 'Organic Farm Direct (Finest quality ingredients)',

  // Endings
  'ending.perfect.title': 'Queen of Saigon Broken Rice',
  'ending.perfect.subtitle': 'Perfect Ending',
  'ending.perfect.description': 'Joy completely cleared the family debt. Her stall became an iconic Saigon culinary landmark beloved by patrons far and wide!',

  'ending.family.title': 'Our Family Stall',
  'ending.family.subtitle': 'Family Hidden Ending',
  'ending.family.description': 'Beyond wiping out debt, Joy rekindled warm family bonds. Ba Long gladly took charge of finances and logistics side-by-side with Joy.',

  'ending.jd.title': 'JD — The Summer Prodigy',
  'ending.jd.subtitle': 'JD Hidden Ending',
  'ending.jd.description': 'JD summer break became an incredible turning point of growth. He blossomed into Joy indispensable right-hand partner.',

  'ending.neighborhood.title': 'Heart of the Alley',
  'ending.neighborhood.subtitle': 'Neighborhood Ending',
  'ending.neighborhood.description': 'Even with a modest debt lingering, Joy stall became the cherished warm heart of the alley, embraced and supported by all neighbors.',

  'ending.husband_finance.title': 'Husband Controls the Safe',
  'ending.husband_finance.subtitle': 'Husband Finance Ending',
  'ending.husband_finance.description': 'The stall is profitable but debt remains. Ba Long temporarily oversees major spending until the stall attains full autonomy.',

  'ending.comeback.title': 'A Resilient Clean Slate',
  'ending.comeback.subtitle': 'Comeback Ending',
  'ending.comeback.description': 'The 30-day wager had turbulence, but Joy refused to give up. Downsizing for now, she is already preparing a stronger comeback.',

  // Account & Cloud
  'account.login': 'Log In',
  'account.register': 'Create Account',
  'account.logout': 'Log Out',
  'account.cloud_synced': 'Game data synchronized to cloud',
  'account.conflict_title': 'Cloud Save Conflict',
  'account.conflict_desc': 'A newer cloud save was detected on the server.',
  'account.keep_local': 'Keep This Local Save',
  'account.keep_remote': 'Use Cloud Version',
};
