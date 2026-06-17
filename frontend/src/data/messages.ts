// ─── Pre-Purchase Warning Messages ─────────────────────────────────────────
export const warningMessages = [
  "Is this chocolate really needed, or is this a cry for help?",
  "Would Future {name} approve this purchase?",
  "On a scale of Need to Chocolate, how necessary is this?",
  "The budget has asked us to double-check.",
  "Are we making financial decisions or emotional decisions?",
  "According to our records, this would be quite the purchase.",
  "Quick question. Is this a need or a snack emergency?",
  "The Budget Council is not convinced.",
  "We are currently investigating this purchase.",
  "Breaking News: Another ₹ is about to escape the savings account.",
  "The budget is fighting for its life. Please reconsider.",
  "Your wallet sent an SOS. We're just the messenger.",
  "Savings goal spotted watching nervously from the corner.",
  "This purchase has been flagged for emotional spending.",
  "The budget would like a quick discussion before proceeding.",
  "{name}, your future self is watching this transaction with concern.",
  "Our analysts have reviewed this. Verdict: Suspicious.",
  "The snack fund is running low. This is a critical situation.",
  "We've checked your history. This is not your first rodeo.",
  "Your savings goal just took a small step backward.",
  "{name}, the chocolate budget is in intensive care.",
  "Are you sure? The budget asked us to ask you twice.",
  "Fun fact: This money could have gone to your goal.",
  "The impulse alarm is going off. Proceed with caution.",
  "Your wallet would like you to sleep on this.",
  "This purchase is currently under review by the Finance Committee.",
  "{name}, we're not saying no. We're saying... are you sure?",
  "The budget accountant has concerns. Several concerns.",
  "Three seconds of joy. Permanent transaction history.",
  "This has been classified as a 'want' not a 'need'. Proceed?",
  "Your financial future is watching this moment unfold.",
  "The savings jar is making a face right now.",
  "We ran the numbers. They said: maybe reconsider.",
  "Alert: Budget stress detected. Recommend postponement.",
  "Your past self set a budget. Your present self is about to ignore it.",
  "{name}, the snacks are temporary. The regret is forever.",
  "Emergency Budget Meeting called. You're the subject.",
  "Interesting choice. Let's see if you feel the same in 24 hours.",
  "Your goals would like to present a counter-argument.",
  "The financially responsible version of you is screaming internally.",
  "We checked. This is purchase #multiple this month.",
  "Your budget is currently on life support. This may not help.",
  "A moment of silence for what this money could have been.",
  "The Finance Gods are watching. Choose wisely.",
  "This transaction requires your full emotional awareness.",
  "{name}, every penny has feelings. Please consider them.",
  "The wallet is tired. The wallet needs rest.",
  "Your dream purchase just got slightly further away.",
  "This has been flagged as 'definitely a want'.",
  "The budget auditors have entered the chat.",
];

// ─── Regret Messages ───────────────────────────────────────────────────────
export const regretMessages = [
  "{name}, the chocolate is gone. The transaction remains.",
  "{name}, the snacks were temporary. The expense is forever.",
  "{name}, the budget fought bravely. It did not survive.",
  "{name}, you are now officially sponsoring the chocolate industry.",
  "{name}, we checked. That was not an emergency.",
  "{name}, the chips have won another battle.",
  "{name}, the budget has requested legal representation.",
  "{name}, future you is already writing a strongly worded letter.",
  "{name}, the savings account is taking notes.",
  "{name}, that purchase has been recorded in the permanent record.",
  "{name}, the ice cream is melted. The debt is not.",
  "{name}, the budget would like to discuss your choices.",
  "{name}, your goal just moved one step further away.",
  "{name}, the Finance Committee has noted this transaction.",
  "{name}, this has been added to the monthly exhibit.",
  "{name}, your wallet is crying softly in a corner.",
  "{name}, the budget sends its condolences.",
  "{name}, another one bites the dust. The budget, specifically.",
  "{name}, snack acquired. Financial peace: not acquired.",
  "{name}, the chocolate was worth it. The budget disagrees.",
  "{name}, congratulations on your investment in the snack sector.",
  "{name}, the damage is done. The receipt has been issued.",
  "{name}, the budget is now on a ventilator.",
  "{name}, we're not judging. But the spreadsheet is.",
  "{name}, another impulse has been immortalized.",
  "{name}, your future laptop/phone/goal watched this happen.",
  "{name}, the savings knew this day would come.",
  "{name}, the budget has left the building.",
  "{name}, that was a financial plot twist nobody saw coming.",
  "{name}, we have updated your impulse purchase statistics.",
  "{name}, the snack industry thanks you for your continued support.",
  "{name}, the budget is in witness protection now.",
  "{name}, your financial advisor has left the group chat.",
  "{name}, the goals are on hold. The chips are not.",
  "{name}, this moment has been archived for your monthly review.",
  "{name}, the bank account moment of silence begins now.",
  "{name}, the budget said 'not again' but here we are.",
  "{name}, receipts don't lie. The chocolate did happen.",
  "{name}, the savings account is filing a complaint.",
  "{name}, we're sending thoughts and prayers to your budget.",
  "{name}, another snack has ascended. The money remains descended.",
  "{name}, your impulse percentage just climbed.",
  "{name}, future you has entered a state of mild concern.",
  "{name}, this transaction has been certified as 'totally worth it (probably)'.",
  "{name}, the budget's final form: defeated.",
];

// ─── Achievement Messages ──────────────────────────────────────────────────
export const achievementMessages = [
  "{name}, you just dodged a snack! Your wallet applauds.",
  "{name}, financial wisdom detected! The budget is healing.",
  "{name}, you resisted! The savings goal jumps for joy.",
  "{name}, incredible discipline! Future {name} is proud.",
  "{name}, the budget lives to fight another day. Thanks to you.",
  "{name}, you chose the goal over the chocolate. Legendary.",
  "{name}, your wallet just breathed a sigh of relief.",
  "{name}, the Finance Committee applauds this decision.",
  "{name}, budget preserved. Goals advanced. You're winning.",
  "{name}, that was the most financially responsible thing I've seen all week.",
];

// ─── Monthly Summary Messages ──────────────────────────────────────────────
export const monthlySummaryMessages = [
  "{name}, this month was a journey. A snack-filled journey.",
  "{name}, the numbers are in. The snacks won again.",
  "{name}, monthly report: {needs}% needs, {wants}% wants, {impulse}% impulse. The data doesn't lie.",
  "{name}, you spent {total} this month. The budget had thoughts.",
  "{name}, your wallet survived the month. Barely, but it survived.",
  "{name}, {impulse_count} impulse purchases this month. A new personal record.",
  "{name}, this month's budget was tested. It held. Mostly.",
  "{name}, the numbers are in and the snack industry is thriving. Thanks to you.",
];

// ─── Category-Specific Messages ────────────────────────────────────────────
export const categoryMessages: Record<string, string[]> = {
  chocolate: [
    "{name}, this is your chocolate purchase this month. Keeping count.",
    "The chocolate budget has entered critical condition.",
    "{name}, the cacao beans thank you for your loyalty.",
    "This is not your first chocolate. Our records confirm this.",
  ],
  chips: [
    "{name}, the chips budget is watching nervously.",
    "Another bag. Another budget line item.",
    "{name}, the crunch was worth it. The expense was not.",
    "Chips acquired. Budget: slightly concerned.",
  ],
  snacks: [
    "{name}, the snack drawer is full. The budget is empty.",
    "Snack acquired. Financial advisor: not consulted.",
    "{name}, we have noted the snack trajectory this month.",
    "The snack fund has entered overtime.",
  ],
  ice_cream: [
    "{name}, the ice cream was temporary. The transaction is permanent.",
    "Cold treat. Warm budget concerns.",
    "{name}, the scoop count this month has been... noted.",
    "The ice cream melts. The expense does not.",
  ],
  shopping: [
    "{name}, retail therapy session logged.",
    "The shopping budget has been consulted. It said please reconsider.",
    "{name}, the cart has been checked out. The savings have not.",
    "Purchase confirmed. Financial regret: pending.",
  ],
};

// ─── Impulse-Specific Dialogs ──────────────────────────────────────────────
export const impulseDialogs = [
  {
    title: "Hold on, {name}.",
    message: "This looks like an impulse purchase. Would Future {name} agree with this decision?",
    buttons: { confirm: "I Need It", cancel: "Save My Money", ignore: "Buy Anyway" },
  },
  {
    title: "The Budget Council is Convening",
    message: "An emergency session has been called regarding this purchase. The council requests 5 seconds of reflection.",
    buttons: { confirm: "It's Necessary", cancel: "I'll Skip It", ignore: "Proceed Anyway" },
  },
  {
    title: "Quick Audit, {name}",
    message: "We've reviewed your recent spending. This would be flagged as impulse. Are you sure?",
    buttons: { confirm: "100% Sure", cancel: "Actually... No", ignore: "Yolo" },
  },
  {
    title: "Your Goals Are Watching",
    message: "Your savings goal just got slightly further away. Is this purchase worth the detour?",
    buttons: { confirm: "Worth It", cancel: "Save Instead", ignore: "Buy Anyway" },
  },
  {
    title: "Financial Health Check",
    message: "Your impulse spending is trending up this month. This would add to that count. Proceed?",
    buttons: { confirm: "Add It", cancel: "Pass", ignore: "Don't Care" },
  },
];

// ─── Budget Alert Messages ─────────────────────────────────────────────────
export const budgetAlerts = {
  warning_50: "{name}, you've used half your budget. The second half is watching nervously.",
  warning_75: "{name}, 75% of the budget is gone. The remaining 25% is scared.",
  warning_90: "{name}, 90% budget used. We're in emergency territory.",
  warning_100: "{name}, the budget has been fully consumed. A moment of silence.",
  category_warning: "{name}, the {category} budget is almost gone. This might be the last one.",
  category_exceeded: "{name}, the {category} budget has been exceeded. The budget files a formal complaint.",
};

// ─── Greeting Messages ─────────────────────────────────────────────────────
export const greetings = {
  morning: ["Good morning, {name}!", "Rise and budget, {name}!", "Morning, {name}. Let's make smart choices today."],
  afternoon: ["Good afternoon, {name}!", "Afternoon check-in, {name}!", "How's the budget holding up, {name}?"],
  evening: ["Good evening, {name}!", "Evening, {name}. How did the wallet do today?", "Wind down time, {name}. Let's review."],
  night: ["Late night, {name}?", "Night owl mode, {name}.", "Don't make financial decisions this late, {name}. Just kidding. Maybe."],
};

export function getRandomMessage(messages: string[], name: string): string {
  const msg = messages[Math.floor(Math.random() * messages.length)];
  return msg.replace(/{name}/g, name);
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  let pool: string[];
  if (hour < 12) pool = greetings.morning;
  else if (hour < 17) pool = greetings.afternoon;
  else if (hour < 21) pool = greetings.evening;
  else pool = greetings.night;
  return getRandomMessage(pool, name);
}
