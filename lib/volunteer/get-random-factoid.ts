const FACTOIDS = [
  "Globally, about one-third of all food produced for human consumption is lost or wasted.",
  "Every kilogram of food you rescue saves roughly 2.5 kg of CO2 emissions.",
  "Reducing food waste is one of the top ways to reverse climate change.",
  "The food you deliver today can provide a family's meals for an entire weekend.",
] as const;

export function getRandomFactoid(): string {
  return FACTOIDS[Math.floor(Math.random() * FACTOIDS.length)]!;
}